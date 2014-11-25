var accelWatchDC = null;
(function() {
	var accelMeasurement = 100;
	var accelOptions = { frequency: accelMeasurement };

	document.addEventListener("deviceready", startAccelDC, false);
	
	function startAccelDC(){
		accelWatchDC = navigator.accelerometer.watchAcceleration(accelCallbackDC, accelErrorDC, accelOptions);
	}
	function stopAccelCalsDC() {
		if(!accelWatchDC){
			navigator.accelerometer.clearWatch(accelWatchDC);
		}
	}
	
	
	function accelCallbackDC(acceleration){
		var accelPointDC = new Object();
		accelPointDC.x = acceleration.x;
		accelPointDC.y = acceleration.y;
		accelPointDC.z = acceleration.z;
		accelPointDC.t = ((new Date()).getTime());
		rData.setRawAc(accelPointDC);
	}
	function accelErrorDC(){
		stopAccelCalsDC();
		alert("Error ");
	}
	
	var i=0;
	
	function charttest(){
		var i=0,x,y,z,hr,rawAc,rawSR,rms,disacc;
		
		var series1 = new Array();
		var series2 = new Array();
		var series3 = new Array();
		var series4 = new Array();
		var series5 = new Array();
		
		var itemx = new Array();
		var itemy = new Array();
		var itemz = new Array();
		var itemc = new Array();
		var items = new Array();
		var itemh = new Array();
		itemx = [];
		itemy = [];
		itemz = [];
		itemc = [];
		items = [];
		itemh = [];
		series1 = [ itemx ];
		series2 = [ itemy ];
		series3 = [ itemz ];
		series4 = [ itemc ];
		series5 = [ items ];
		var rdDis;
		var data = [ series1,series2,series3,series4,series5 ];
	
		var iplot =setInterval(function(){
			hr =rData.getHeartRate();
			rawAc = rData.getRawAc();
			rawSR = rData.getStrokeRate();
			rdDis= rData.getGuiEvent();
			
			if(rawAc){
				itemx = [i,rawAc.x];
				itemy = [i,rawAc.y];
				itemz = [i,rawAc.z];
				var arr = [rawAc.x,rawAc.y,rawAc.z];
				var g =[0,0,-9.8];
				var ge = rootms(g);
				rms = rootms(arr)-ge;
				itemc = [i,rms];
				//series1.push(itemx);
				//series2.push(itemy);
				//series3.push(itemz);
				//series4.push(itemc);
				disacc = rms*100;
				disacc = Math.round(disacc);
				disacc = Math.abs(disacc);
				//$('#accrate').text("RMS :"+disacc+"         x  : "+Math.round(5*rawAc.x)+" y: "+Math.round(5*rawAc.y)+" z: "+Math.round(5*rawAc.z));
				
			
			}
			if(rawSR){
				items=[i,rawSR/10];
				series1.push(items);
				if((i >180)&&(series1.length>1)){
					series1.shift();
				}
			}
			if(hr && hr !=NaN){
				itemh=[i,hr/10];
				series5.push(itemh);
				if((i >180)&&(series5.length>1)){
					series1.shift();
				}
			}
			i++;
			/*if(i>120){
				series1.shift();
				//series2.shift();
				//series3.shift();
				//series4.shift();
				series5.shift();
				
			}*/
	
	  		 $.plot($("#graph"), data);
			 	
			if((rdDis=="PEND")||(rdDis=="IEND")){
				 items.length=0;
				 series4.length=0;
				 itemh.length=0;
				 series5.length=0;
				 $('#graph').empty();
			 }
		},1000);
 
	}
	charttest();
	function rootms(arr) {
		var sum_of_squares = arr.reduce(function(s,x) {
			return (s + x*x);
		}, 0);
    	return Math.sqrt(sum_of_squares / arr.length);
	}
	
	
	
})();//self invoking function 