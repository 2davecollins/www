var accelWatchId = null;
(function() {
	//var accelArray = [];	//array of accelerations
	var accelWatchId = null;
	var rateCountingId;	//clear this watch to stop watching acceleration and calculating stroke rate
	var strokeTimeoutId = null;
	var accelMeasurementDelay = 50;		//unit: ms	//time between recordings of acceleration
	var maxRateMinute = 60;			//unit: strokes/minute	//maximum reasonable stroke rate
	var minRateMinute = 10;			//unit: strokes/minute	//minimum reasonable stroke rate
	

    // Start of Changes for PRTP-41
    var likelyFromRate = 17;			//unit: strokes/minute	//maximum reasonable stroke rate
    var likelyToRate = 50;			//unit: strokes/minute	//minimum reasonable stroke rate
    var fromLikelyShift = Math.round(60000 / (accelMeasurementDelay * likelyToRate));	//unit: array entries
    var toLikelyShift = Math.round(60000 / (accelMeasurementDelay * likelyFromRate));	//unit: array entries	
	var preferredRateMultiplier = 1.3;
    // End of Changes for PRTP-41
	
	
	var maxIdealFitnessMagnitude = 40; // To eliminate large fit values due to large forces
	var minIdealFitnessMagnitude = 0.2; // To eliminate lack of motion fit values due to stationary phone
	var valueForMinFitnessWhenIdealIsLow  = 0.5;
	var proportionOfIdealAcceptableAsFitness = 0.3;
	var index =0;
	
	
	$("#divSlider").change(function() {
		var sliderValue = $("#accelSetting1").slider().val();
		var setting = $.jStorage.get("setingKey");
		if(setting){
			if(setting.proportionOfIdealAcceptableAsFitness){
				setting.proportionOfIdealAcceptableAsFitness = sliderValue;
				$.jStorage.set("setingKey",setting);
				proportionOfIdealAcceptableAsFitness = setting.proportionOfIdealAcceptableAsFitness;
			}else{
				proportionOfIdealAcceptableAsFitness = 0.3;
				setting.proportionOfIdealAcceptableAsFitness = proportionOfIdealAcceptableAsFitness ;
				$.jStorage.set("setingKey",setting);
			}
		}else{
			proportionOfIdealAcceptableAsFitness = 0.3;
			var setting = [];
			setting.proportionOfIdealAcceptableAsFitness = proportionOfIdealAcceptableAsFitness ;
			$.jStorage.set("setingKey",setting);
		}
	});
	
	var debugMode = false;
	// converting regular units to SI or array entries
	var accelFrequency = (1000/accelMeasurementDelay);	
	/*unit: 1/s (Hz)*/
	var maxRateS = maxRateMinute / 60;	//unit: 1/s (Hz)
	var minRateS = minRateMinute / 60;	//unit: 1/s (Hz)
	var maxShift = Math.round(accelFrequency / minRateS);
	//unit: array entries
	var minShift = Math.round(accelFrequency / maxRateS);
	//unit: array entries
	var accelArrayLength = maxShift * 2;	//unit: array entries	//array must contain at least 2 strokes
	var accelOptions = { frequency: accelMeasurementDelay };
	var accelUpdateFrequency = 1;		//display update frequency, also frequency of large calculation
	var accelCount=0;
	var accelInitLength =10;
	var interpolatedArray = [accelArrayLength]; 
	var accelArray = new Array(accelInitLength);	//array of accelerations
	var nAA = new Array(accelInitLength);
	// global variables to exchange information between different timing loops
	var latestFitness = 0;
	var latestBestShift = 0;
	var strokeCountCurrent = 0;
	var strokeTime = 0;		//milliseconds
	var nextStrokeTimeStamp = 0;
	var accelcalsStarted = false;
	
	document.addEventListener("deviceready", onDeviseAccelCals, false);
	// initilise arrays prevent undefined error
	function initAA_Arrays() {
		for(i=0;i< accelInitLength; i++){
		    nAA[i] = {};
			accelArray[i] = {};
			nAA[i].x = nAA[i].y = nAA[i].z =  1;
			
			accelArray[i].x = accelArray[i].y = accelArray[i].z = nAA[i].x;
			accelArray[i].t = ((new Date()).getTime());
		}
	}
	initAA_Arrays();
	function reinit(){
		accelFrequency = 1000 / accelMeasurementDelay;	//unit: 1/s (Hz)
		maxRateS = maxRateMinute / 60;	//unit: 1/s (Hz)
		minRateS = minRateMinute / 60;	//unit: 1/s (Hz)
		maxShift = Math.round(accelFrequency / minRateS);	//unit: array entries
		minShift = Math.round(accelFrequency / maxRateS);	//unit: array entries
		accelArrayLength = maxShift * 2;	//unit: array entries	//array must contain at least 2 strokes
		accelOptions = { frequency: accelMeasurementDelay };
		accelUpdateFrequency = 1;		//display update frequency, also frequency of large calculation
		accelCount=0;
		accelInitLength =10;
		interpolatedArray = [accelArrayLength]; 
		accelArray = new Array(accelInitLength);	//array of accelerations
		nAA = new Array(accelInitLength);
		latestFitness = 0;
		latestBestShift = 0;
		strokeCountCurrent = 0;
		strokeTime = 0;		//milliseconds
		nextStrokeTimeStamp = 0;
		
	}
	function onDeviseAccelCals(){
		document.addEventListener('pause',onPauseaccelCals, false);
		document.addEventListener('resume',onResumeaccelcals,false);
		
	}
	
	$(document).delegate('#dashboard','pageshow', function() {
		accelcalsStarted = true;
		startaccelCals();
	});
	$(document).delegate('#dashboard','pagehide', function() {
		accelcalsStarted = false;
		stopAccelCals();
	});
	function startaccelCals() {
		if(!accelWatchId) {
			startAccelRecord();
		}
	}
	function stopAccelCals() {
		if(accelWatchId){
			navigator.accelerometer.clearWatch(accelWatchId);
			accelWatchId = null;
			clearInterval(rateCountingId);
			rateCountingId = null;
			clearTimeout(strokeTimeoutId);
			strokeTimeoutId = null;
			nextStrokeTimeStamp = 0;
		}
	}
	
	function startAccelRecord(){
		if(navigator.accelerometer){
			accelWatchId = navigator.accelerometer.watchAcceleration(accelCallback, accelError, accelOptions);
			rateCountingId = setInterval(calculateStrokeRate,(1000/accelUpdateFrequency));
		}
	}
	function onPauseaccelCals(){
		if(accelWatchId){
			stopAccelCals();
		}
	}
	function onResumeaccelcals(){
		if(!accelWatchId){
			reinit();
			initAA_Arrays();
			startAccelRecord();
		}
	}
	
	function getAcceleration(){
		if(navigator.accelerometer){
			navigator.accelerometer.getCurrentAcceleration(accelCallback, accelError);
		}
	}
	//I don't know when to expect an acceleration measurement error, but might as well have something to handle it
	function accelError(){
		
		if (accelArray.length > maxShift){
			accelArray.push(accelArray[accelArray.length - 1]);
			//copies last entry in case of singular or temporary error
			accelArray.shift();	//prevents array from growing too large
		}
	}
	
	function accelCallback(acceleration){
		//index++
		var accelPoint = new Object();
		accelPoint.x = acceleration.x;
		accelPoint.y = acceleration.y;
		accelPoint.z = acceleration.z;
		accelPoint.t = ((new Date()).getTime());
		accelArray.push(accelPoint);
		onNewAccelPoint();
	}
	
	function onNewAccelPoint(){
		while( (accelArray.length > 2) && (accelArray[accelArray.length -1].t - accelArray[1].t) > accelArrayLength * accelMeasurementDelay){	
		//trimming based on array element timestamps
		//while (accelArray.length > accelArrayLength)
		//trimming based on number of elements
		// last - first timestame  > 12000
			accelArray.shift();
		}
	}
	
	var fitness;
	var relativeFitness;
	var minFitness;
	var fitnessArray = [];
	var bestShift;
	var prevStrokeShift=0;
	var prevStrokeRate;
	var prevRate;
	var idealFitness;
	var to;
	var from;
	var harmonicShift;
	var harmonicFound = false;
	var rate = 0;
	
	function calculateStrokeRate(){
	
		/*var fitness;
		var relativeFitness;*/
		//calculates nAA
		//nAA is the normalized acceleration array
		accelAverage(); 
		/*var prevRate = rData.getStrokeRate();
		var idealFitness = calculateIdealFitness();*/
		prevRate = rData.getStrokeRate();
		idealFitness = calculateIdealFitness();
		
		//parameters ruling out extremely high or extremely low accelerations in advance of most computations
		//for paddling in a single: fitness is generally between 1 and 2, very light is below this, and race pace should be above
		if (idealFitness > maxIdealFitnessMagnitude ){
			rData.setStrokeRate(-1);
			clearTimeout(strokeTimeoutId);
			strokeTimeoutId = null;
			nextStrokeTimeStamp = 0;
		
		}else if( idealFitness < minIdealFitnessMagnitude){
			rData.setStrokeRate(-2);
			clearTimeout(strokeTimeoutId);
			strokeTimeoutId = null;
			nextStrokeTimeStamp = 0;
		}else {
			//parameters for accepting a stroke rate are set here
			/*var minFitness = Math.max(idealFitness * proportionOfIdealAcceptableAsFitness, valueForMinFitnessWhenIdealIsLow );
			var fitnessArray = [];
			var bestShift = 0;
			var prevStrokeShift=0; // default to 10
			var prevStrokeRate = rData.getStrokeRate();*/
			minFitness = Math.max(idealFitness * proportionOfIdealAcceptableAsFitness, valueForMinFitnessWhenIdealIsLow );
			fitnessArray = [];
			bestShift = 0;
			prevStrokeShift=0; // default to 10
			prevStrokeRate = rData.getStrokeRate();
			if( prevStrokeRate > 0){
				prevStrokeShift = Math.round(60000/(prevStrokeRate * accelMeasurementDelay));
			}
						
			// Start of Changes for PRTP-41				
			// If previous is in the Likely Range then look around it Otherwise check from min to max
			
			bestShift = 0;
			if((prevStrokeShift >= fromLikelyShift) && (prevStrokeShift<=toLikelyShift))			 			
			{
				to = Math.min(prevStrokeShift + 5,maxShift);
				from = Math.max(prevStrokeShift - 5,minShift);
				
				bestShift = findBestShift(minFitness, from , to, fitnessArray);
			}
			 			 
			if(bestShift == 0){			 			
				bestShift = findBestShift(minFitness, minShift, maxShift, fitnessArray);
				
				var nextBestShift = findNextBestShift(bestShift, minShift, maxShift, fitnessArray);
				
				// If the difference between the bestfitness and nextBestFitness is less than 20% of the bestFitness				
				// we should look closer
				if ((fitnessArray[bestShift] - fitnessArray[nextBestShift] ) < .2*fitnessArray[bestShift])
				{
					
					// If we have found nextBestShift a reasonable multiple of bestShift away  ..ie a harmonic
					if( (Math.abs(bestShift-nextBestShift)  > 1.6*bestShift) || (Math.abs(bestShift-nextBestShift) > bestShift/1.6))
					{
						// If NextBestShift is closer to the previous 
						if(Math.abs(bestShift-prevStrokeShift) > Math.abs(nextBestShift-prevStrokeShift))						
							bestShift = nextBestShift;
					}										
				}								
			}
			// REMOVING HARMONICS CHECKING CODE
			// End of Changes for PRTP-41				
			
            rate = 0;
			if (bestShift == 0){
			
				latestBestShift = 0;
				if (rData.getStrokeRate() >= 0){
					clearTimeout(strokeTimeoutId);
					strokeTimeoutId = null;
				}
				
			} else{
				//strokeTime = (accelArray[accelArray.length -1].t - accelArray[accelArray.length - 1 - bestShift].t);
				strokeTime = bestShift * accelMeasurementDelay;
				rate = 60000 / strokeTime;
				//latestBestShift = bestShift;
				if (strokeTimeoutId === null){
					nextStroke();
				}
			}
			
			rData.setStrokeRate(rate);			
		}
	}
	
	function checkFitness(timeshift, fitnessArray){
		if(fitnessArray[timeshift] !== undefined){
			return fitnessArray[timeshift];
		}else {
			var k;
			var fitness=0;
			var productSum = new Object();
			productSum.x = 0;
			productSum.y = 0;
			productSum.z = 0;
			if(nAA.length>timeshift) {
				k = nAA.length - timeshift;
				while (k<nAA.length){
					productSum.x = productSum.x + nAA[k].x * nAA[k-timeshift].x;
					productSum.y = productSum.y + nAA[k].y * nAA[k-timeshift].y;
					productSum.z = productSum.z + nAA[k].z * nAA[k-timeshift].z;
					k++;
				}
				//productSum = accelDivideConst(productSum, timeshift);
				productSum.x = productSum.x / timeshift;
				productSum.y = productSum.y / timeshift;
				productSum.z = productSum.z / timeshift;
				fitness = productSum.x + productSum.y + productSum.z;
				
				// Start of Changes for PRTP-41				
				if((timeshift > fromLikelyShift) && (timeshift<toLikelyShift))				
					fitness = fitness * preferredRateMultiplier;
				// End of Changes for PRTP-41
				
				fitnessArray[timeshift] = fitness;
			}
			return fitness;
		}
	}
	
	function findBestShift(minFitness, minShift, maxShift, fitnessArray){
	
		minFitness = Math.max(minFitness, checkFitness(minShift, fitnessArray), checkFitness(maxShift, fitnessArray));
		var bestFitness = minFitness;
		var bestFitnessChanged = false;
		var timeshift = minShift;
		var bestShift = 0;
		
		while (timeshift <= maxShift){
			var fitness = checkFitness(timeshift, fitnessArray);
			if (fitness < 0){
				timeshift++;
			}else if (fitness > bestFitness){
				bestFitness = fitness;
				bestShift = timeshift;
				bestFitnessChanged = true;
			} else if (bestFitnessChanged == true && (timeshift >= bestShift + 4 || timeshift == maxShift)){
				relativeFitness = bestFitness;
				if((timeshift * 2)<=maxShift){
					relativeFitness = relativeFitness + 0.2 * checkFitness(2*bestShift, fitnessArray) - 0.2 * checkFitness(Math.round(1.5*bestShift), fitnessArray);
					if ((timeshift * 3)<=maxShift){
						relativeFitness = relativeFitness + 0.1 * checkFitness(3*bestShift, fitnessArray)- 0.1 * checkFitness(Math.round(2.5*bestShift), fitnessArray);
					}
					relativeFitness = relativeFitness / minFitness;
					
				}
				bestFitnessChanged = false;
				if (relativeFitness < 0.9){
					bestFitness = minFitness;
					bestShift = 0;
				}
			}
			timeshift++;
		}
		if (bestFitness != minFitness){
			latestFitness = bestFitness;
		}else{
			latestFitness = 0;
		}
		return bestShift;
	
	}
	// Start of Changes for PRTP-41				
	function findNextBestShift(thresholdShift, minShift, maxShift, fitnessArray){
					
		var k = minShift;
		var nextBestShift = minShift;
		
		var thresholdFitness = checkFitness(thresholdShift,fitnessArray);

		var nextBestFitness = checkFitness(k, fitnessArray);
		

		// skip over the shifts in the vicinity of thresholdShift
		while ((k <= maxShift) && (k<thresholdShift-4) && (k>thresholdShift+4))
		{
			var fitness = checkFitness(k, fitnessArray);
			
			if ((fitness > nextBestFitness) && (fitness < thresholdFitness)){
				nextBestFitness = fitness;
				nextBestShift = k;			
				k++;
			} 			
		}
		return nextBestShift;	
	}
	
// End of Changes for PRTP-41					
	function calculateIdealFitness(){
		var sumSq = new Object();
		sumSq.x = 0;
		sumSq.y = 0;
		sumSq.z = 0;
		var k;
		k = 0;
		if(nAA.length>0) {
			while (k<nAA.length && k<maxShift){
				if(nAA[k] !== undefined){
					sumSq.x = sumSq.x + nAA[k].x * nAA[k].x;
				}
				if(nAA[k] !== undefined){
					sumSq.y = sumSq.y + nAA[k].y * nAA[k].y;
				}
				if(nAA[k] !== undefined){
					sumSq.z = sumSq.z + nAA[k].z * nAA[k].z;
				}
				k++;
			}
			if(k>0){
				sumSq.x = sumSq.x / k;
				sumSq.y = sumSq.y / k;
				sumSq.z = sumSq.z / k;
			}
		}
		
		
		var idealFitness = sumSq.x + sumSq.y + sumSq.z;
		return idealFitness;
	}
	
	
	function nextStroke(){
		rData.setStrokeCount(rData.getStrokeCount() + 1);
		if(nextStrokeTimeStamp === 0){
			nextStrokeTimeStamp = new Date().getTime() + strokeTime;
		}else {
			nextStrokeTimeStamp += strokeTime;
		}
		strokeTimeoutId = setTimeout(nextStroke,nextStrokeTimeStamp - new Date().getTime());
	}
	
	// functions taking elements of accelArray as arguments and returning similar objects
	
	function accelDivideConst(in1,in2){
		var out = new Object();
		out.x = in1.x / in2;
		out.y = in1.y / in2;
		out.z = in1.z / in2;
		//out.t = in1.t;
		return out;
	}
	
	
	function accelMultiplyScalar(in1,in2){
		var out = new Object();
		out.x = in1.x * in2;
		out.y = in1.y * in2;
		out.z = in1.z * in2;
		//out.t = in1.t;
		return out;
	}
	
	function accelMultiply(in1,in2){
		var out = new Object();
		out.x = in1.x * in2.x;
		out.y = in1.y * in2.y;
		out.z = in1.z * in2.z;
		//out.t = in1.t;
		return out;
	}
	
	function accelAdd(in1,in2){
		var out = new Object();
		out.x = in1.x + in2.x;
		out.y = in1.y + in2.y;
		out.z = in1.z + in2.z;
		//out.t = in1.t;
		return out;
	}
	
	function accelSubtract(in1,in2){
		var out = new Object();
		out.x = in1.x - in2.x;
		out.y = in1.y - in2.y;
		out.z = in1.z - in2.z;
		//out.t = in1.t;
		return out;
	}
	
	function accelAverage(){
		var out = new Object();
		out.x = 0;
		out.y = 0;
		out.z = 0;
		//out.t = accelArray[accelArray.length - 1].t;
		if (accelArray.length <=0)
			return;
			
		var i = 0;
		while (i < accelArray.length){
			out.x += accelArray[i].x;
			out.y += accelArray[i].y;
			out.z += accelArray[i].z;
			i++;
		}
	
		out.x = out.x / accelArray.length;
		out.y = out.y / accelArray.length;
		out.z = out.z / accelArray.length;

		var j = 0;
		var elapsedTime = accelArray[accelArray.length-1].t -accelArray[0].t;
		var expectedElapsedTime = accelMeasurementDelay*(accelArray.length-1);
		var expRatio = expectedElapsedTime/elapsedTime;
		if ( expRatio < 1.01 && expRatio > 0.99) {
		  // Our accelArray has been returned at an time interval spacing as expected
			while (j<accelArray.length){
				nAA[accelArrayLength - 1 - j] = accelSubtract(accelArray[ accelArray.length - 1 -j],out);
				j++;
			}
		}
		else
		{
		/* The code below will create a new array of points that are equally spaced in time slots. The accel values for these points
		  are interpolated from the actual points for accel that we have in accelArray
		  Starting at the back of the regularized array we find he point in time in accelArray that has a time less than the corresponding regularized time and we know that the previous point in AccelArray must have a time greater than the regularized time slot we are intending to fill */
			var k = accelArray.length - 1;
			var latestTime = accelArray[accelArray.length - 1].t;
			for (j=0;j<accelArrayLength;j++){
				while(j*accelMeasurementDelay > latestTime - accelArray[k-1].t && k>1){  // Loop until we find a real time less than what we want to fill
					k--;
				}
				if(k>=0){
					// on coming out of loop accelArray[k-1].t	is > than the time slot 
					//we want to fill accelArray[k] is < than the one we want to fill	
					kFactor = ((latestTime - accelArray[k-1].t) - j*accelMeasurementDelay)/(accelArray[k].t - accelArray[k-1].t);
					kMinus1Factor = (j*accelMeasurementDelay - (latestTime - accelArray[k].t))/(accelArray[k].t - accelArray[k-1].t);
					
					
					interpolatedArray[accelArrayLength - 1 - j] = accelAdd(accelMultiplyScalar(accelArray[k],kFactor),accelMultiplyScalar(accelArray[k-1],kMinus1Factor));
				}else{
					interpolatedArray[accelArrayLength - 1 - j] = accelArray[0];
				}
				
				nAA[accelArrayLength - 1 - j] = accelSubtract(interpolatedArray[accelArrayLength - 1 - j],out);
			}
		}
	}
})();//self invoking function 