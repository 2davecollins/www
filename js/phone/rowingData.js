function RowData(){
///////////////////////////////////////////////////////////////////////////////
//		Variable Definitions
///////////////////////////////////////////////////////////////////////////////
	var guiEvent = "None";	//set by GUI, valid values can be found under Gui Event Codes
	var guiEventTime = new Date();	//javascript date object
	var logTime = new Date();	//javascript date object	
	var userID = 0;
	var userEM = "UR";
	var userSecret = "";
	var userBUp = null;
	var paID = 0;
	var type = "";
	var idX = 0;
	var clubID = 0;		//new//		TODO: ensure clubID is populated
	var trainingPlanID = 0;		//set by GUI, expected format unknown
	var sessionID = 0;		//set by GUI, expected format unknown
	var pieceID = 0;		//set by GUI, expected format unknown
	var intervalNumber = 0;		//current interval/rest number. 0 if not an interval piece 
	var savedToCloud = false;
	var savedToLocal = false;
	var upLoadID = 0;
	var developer = false;
	var resultUrl;
	var resultUrlWeb;
	var resultDone;
	
	var strokeRate = 0;		//decimal strokes per minute
	var strokeRateLastSaved = 0;	//new	//used for change based log updating
	var strokeCount = 0;	//number
	var heartRate = 0;		//expected format unknown
	//var heartRateLastUpdated = 0;		//new, needed for HR averaging
	//var sessionStartTime = new Date();	//new, important for session average heart rate. maybe stroke rate, speed ...
	var distance = 0;		//metres
	var distanceLastSaved = 0;	//new	//used for distance based log updating
	var speed = 0;		//metres per second
	var splits = 0;
	var lat = 0;		//decimal degrees
	var lon = 0;		//decimal degrees
	var accuracy = 0;	//metres
	var heading = 0;	//decimal degrees
    var didDataChange = false;	//not currently used
	var rawAcceleration;
	

	//variables for piece and interval totals
	var intervalArray = [];
	
	//pause information record
	var paused = false;
	var pausedTotalTime = 0;
	var pausedIntervalTime = 0;
	var pausedRestTime = 0;
	var pausedStartTimeStamp = 0;
	
	//piece and interval totals
	var pieceDistanceTotal = 0;
	var pieceStrokeCountTotal = 0;
	//var pieceStartTimeStamp = new Date();
	var pieceStartTimeStamp;
	var pieceEndedTimeStamp = new Date();
	var piecePausedTime = 0;
	
	var pieceTimeTotal;
	
	var intervalDistanceTotal = 0;
	var intervalStrokeCountTotal = 0;
	var intervalStartTimeStamp = new Date();
	var intervalEndedTimeStamp = new Date();
	var intervalPausedTime = 0;
	
	var intervalType = "NONE";	//values are "NONE" "PIECE" "REST" "INTERVAL"
	var restDistanceTotal = 0;
	var restStrokeCountTotal = 0;
	var restStartTimeStamp = new Date();
	var restEndedTimeStamp = new Date();
	var restPausedTime = 0;

	//Gui Event codes //most likely strings, but could be changed easily  
	var pieceStartedCode = "PSTR";
	var pieceEndedCode = "PEND";
	var intervalStartedCode = "ISTR";
	var restStartedCode = "ISTP";		//also individual interval end
	var intervalEndedCode = "IEND";		//end of all intervals
	var piecePausedCode = "PAUSE";
	var pieceResumedCode = "CONT";
	
///////////////////////////////////////////////////////////////////////////////
//		Internal object Constructors
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
//		Functions called by other functions in rowData
///////////////////////////////////////////////////////////////////////////////

	//not currently used
    this.setNoDataChange = function(){
        didDataChange = false;
    };

    function checkForChange(currentVal, newVal){
        if(currentVal !== newVal){
            //didDataChange = true;	//not currently used
			logTime = new Date();
			return true;
        }
		return false;
    }
	
	function piecePaused(){
		pausedStartTimeStamp = new Date();
		paused = true;
	}
	
	
	function pauseEnded(){
		var currentTime = new Date();
		if(paused === true){
			piecePausedTime += currentTime.getTime() - pausedStartTimeStamp.getTime();
			switch(intervalType){
			case "INTERVAL":
				intervalPausedTime += currentTime.getTime() - pausedStartTimeStamp.getTime();
				break;
			case "REST":
				restPausedTime += currentTime.getTime() - pausedStartTimeStamp.getTime();
				break;
			}
			
			paused = false;
		}
		pausedStartTimeStamp = 0;
	}
	
	function resetPieceTotals(){
		pieceDistanceTotal = 0;
		pieceStrokeCountTotal = 0;
		pieceStartTimeStamp = null;
		piecePausedTime = 0;
		
		//test to see if need to reset stroke count
		strokeCount = 0;
	}
	
	function resetRestTotals(){
		restDistanceTotal = 0;
		restStrokeCountTotal = 0;
		restStartTimeStamp = new Date();
		restEndedTimeStamp = new Date();
		restPausedTime = 0;
	
	}
	
	function resetIntervalTotals(){
		intervalDistanceTotal = 0;
		intervalStrokeCountTotal = 0;
		intervalStartTimeStamp = 0;
		intervalPausedTime = 0;
	}
	
	
///////////////////////////////////////////////////////////////////////////////
//		methods called to return values in rowData
///////////////////////////////////////////////////////////////////////////////

	this.getGuiEvent = function(){
		return guiEvent;
	};
	this.getGuiEventTime = function(){
		return guiEventTime; //.getTime();
	};
	this.getTYPE = function(){
		return type;
	};
	this.getLogTime = function(){
		//console.log("log time"+logTime.getTime());
		//return logTime.getTime();
		return logTime;
	};
	this.getUserID = function(){
		return userID;	
	};
	this.getUserEM = function(){
		return userEM;	
	};
	this.getUserSecret = function(){
		return userSecret;	
	};
	this.getUserBUp = function() {
		return userBUp;
	};
	this.getPAID = function(){
		return paID;	
	};
	this.getIDX = function(){
		return idX;	
	};
	this.getClubID = function(){
		return clubID;
	};
	this.getTrainingPlanID = function(){
		return trainingPlanID;
	};
	this.getSessionID = function(){
		return sessionID;
	};
	this.getPieceID = function(){
		return pieceID;
	};
	this.getStrokeRate = function(){
		return strokeRate;
	};
	
	this.getStrokeCount = function(){
		return strokeCount;
	};
	this.getHeartRate = function(){
		return heartRate;
	};
	this.getDistance = function(){
		return distance;
	};
	this.getSpeed = function(){
		return speed;
	};
	this.getSplitTime = function(){
		return splits;
	};
	this.getLat = function(){
		return lat;
	};

	this.getLon = function(){
		return lon;
	};
	this.getHeading = function(){
		return heading;
	};
	this.getAccuracy = function(){
		return accuracy;
	};
	this.getSavedToCloud = function(){
		return savedToCloud;
	};
	this.getSavedToLocal = function(){
		return savedToLocal;
	};
	this.getUpLoadID = function () {
		return upLoadID;
	};
	this.getDeveloperMode = function () {
		return developer;
	};
	this.getUrlResult = function(){
		return resultUrl;
	};
	this.getUrlWebResult = function(){
		return resultUrlWeb;
	};
	this.getWebResultsDate = function(){
		return resultDone;
	};
	this.getDidDataChange = function(){
		return didDataChange;
    };
	this.getRawAc = function(){
		return rawAcceleration;
    };
	
///////////////////////////////////////////////////////////////////////////////
//		methods to return piece/interval totals
///////////////////////////////////////////////////////////////////////////////
	this.getPieceStrokeCountTotal = function(){
		return pieceStrokeCountTotal;
	};
	this.getPieceDistanceTotal = function(){
		return pieceDistanceTotal;
	};
	this.getPieceTimeTotal = function(){
		var nowTime = new Date();
		//var pieceTimeTotal;
		
		if(guiEvent ==  pieceStartedCode ) {
			pieceTimeTotal = nowTime.getTime() - pieceStartTimeStamp.getTime();
		}else if(guiEvent ==  piecePausedCode) {
			// do nothing return last pieceTimeTotal
		}else if(guiEvent ==  pieceResumedCode) {
			pieceTimeTotal = nowTime.getTime() - pieceStartTimeStamp.getTime() - piecePausedTime;
		}else if(guiEvent ==  pieceEndedCode) {
			pieceTimeTotal =0;
		}else {
		}
		return pieceTimeTotal;
		
		
		/*
		dillon code for reference
		var nowTime = new Date();
		var pieceTimeTotal;
		
		switch(guiEvent){
		case piecePausedCode:
			if(pausedStartTimeStamp === 0){
				//console.log("in getPieceTimeTotal(): guiEvent is PAUS but pausedStartTimeStamp is set to 0");
				pieceTimeTotal = 0;
			}else if(! pausedStartTimeStamp instanceof Date){
				//console.log("in getPieceTimeTotal(): guiEvent is PAUS but pausedStartTimeStamp is not a date object");
				pieceTimeTotal = 0;
			}else if(! pieceStartTimeStamp instanceof Date){
				//console.log("in getPieceTimeTotal(): guiEvent is PAUS but pausedStartTimeStamp is not a date object");
				pieceTimeTotal = 0;
			}else{
				pieceTimeTotal = pausedStartTimeStamp.getTime() - pieceStartTimeStamp.getTime() - piecePausedTime;
			}
			break;
		case pieceStartedCode:
		case pieceResumedCode:
		case intervalStartedCode:
		case restStartedCode:
			if(! pieceStartTimeStamp instanceof Date){
				//console.log("in getPieceTimeTotal(): guiEvent is ISTP(REST) but pieceStartTimeStamp is not a date object");
				pieceTimeTotal = 0;
			}else{
				pieceTimeTotal = nowTime.getTime() - pieceStartTimeStamp.getTime() - piecePausedTime;
			}
			break;
		case pieceEndedCode:
		case intervalEndedCode:
			if(! pieceStartTimeStamp instanceof Date){
				//console.log("in getPieceTimeTotal(): guiEvent is IEND but pieceStartTimeStamp is not a date object");
				pieceTimeTotal = 0;
			}else if(! guiEventTime instanceof Date){
				//console.log("in getPieceTimeTotal(): guiEventTime is not a Date object");
				pieceTimeTotal = 0;
			}else{
			pieceTimeTotal = guiEventTime.getTime() - pieceStartTimeStamp.getTime() - piecePausedTime;
			}
			break;
		case "":
			pieceTimeTotal = 0;
			break;
		}
		
		
		return pieceTimeTotal;	//unit: milliseconds*/
		
	};
	this.getRestStrokeCountTotal = function(){
		return restStrokeCountTotal;
	};
	this.getRestDistanceTotal = function(){
		return restDistanceTotal;
	};
	this.getRestTimeTotal = function(){
		var nowTime = new Date();
		var restTimeTotal;
		if(! restStartTimeStamp instanceof Date){
				//console.log("in getRestTimeTotal(): restStartTimeStamp is not a date object");
				pieceTimeTotal = 0;
		}else{
			switch(guiEvent){
			case piecePausedCode:
				if(intervalType === "REST"){
					if(! pausedStartTimeStamp instanceof Date){
						//console.log("in getRestTimeTotal(): pausedStartTimeStamp is not a date object");
						pieceTimeTotal = 0;
					}else{
						restTimeTotal = pausedStartTimeStamp.getTime() - restStartTimeStamp.getTime() - restPausedTime;
					}
				}else{
					if(! restEndedTimeStamp instanceof Date){
						//console.log("in getRestTimeTotal(): restEndedTimeStamp is not a date object");
						pieceTimeTotal = 0;
					}else{
						restTimeTotal = restEndedTimeStamp.getTime() - restStartTimeStamp.getTime() - restPausedTime;
					}
				}
				break;
			case restStartedCode:
				restTimeTotal = nowTime.getTime() - restStartTimeStamp.getTime() - restPausedTime;
				break;
			case pieceResumedCode:
				if(intervalType === "REST"){
					restTimeTotal = nowTime.getTime() - restStartTimeStamp.getTime() - restPausedTime;
				}else{
					if(! restEndedTimeStamp instanceof Date){
						//console.log("in getRestTimeTotal(): restEndedTimeStamp is not a date object");
						pieceTimeTotal = 0;
					}else{
						restTimeTotal = restEndedTimeStamp.getTime() - restStartTimeStamp.getTime() - restPausedTime;
					}
				}
				break;
			case pieceStartedCode:
			case intervalStartedCode:
			case pieceEndedCode:
			case intervalEndedCode:
					if(! restEndedTimeStamp instanceof Date){
						//console.log("in getRestTimeTotal(): restEndedTimeStamp is not a date object");
						pieceTimeTotal = 0;
					}else{
						restTimeTotal = restEndedTimeStamp.getTime() - restStartTimeStamp.getTime() - restPausedTime;
					}
				break;
			case "":
				restTimeTotal = 0;
				break;
			}
		}
		
		return restTimeTotal;	//unit: milliseconds
	};

	this.getIntervalStrokeCountTotal = function(){
		return intervalStrokeCountTotal;
	};
	this.getIntervalDistanceTotal = function(){
		return intervalDistanceTotal;
	};
	this.getIntervalTimeTotal = function(){
		var nowTime = new Date();
		var intervalTimeTotal;
		if(! intervalStartTimeStamp instanceof Date){
			//console.log("in getRestTimeTotal(): intervalStartTimeStamp is not a date object");
			pieceTimeTotal = 0;
		}else{
			switch(guiEvent){
			case piecePausedCode:
				if(intervalType === "INTERVAL"){
					if(! pausedStartTimeStamp instanceof Date){
						//console.log("in getIntervalTimeTotal(): pausedStartTimeStamp is not a date object");
						pieceTimeTotal = 0;
					}else{
						intervalTimeTotal = pausedStartTimeStamp.getTime() - intervalStartTimeStamp.getTime() - intervalPausedTime;
					}
				}else{
					if(! intervalEndedTimeStamp instanceof Date){
						//console.log("in getIntervalTimeTotal(): intervalEndedTimeStamp is not a date object");
						pieceTimeTotal = 0;
					}else{
						intervalTimeTotal = intervalEndedTimeStamp.getTime() - intervalStartTimeStamp.getTime() - intervalPausedTime;
					}
				}
				break;
			case intervalStartedCode:
				intervalTimeTotal = nowTime.getTime() - intervalStartTimeStamp.getTime() - intervalPausedTime;
				break;
			case pieceResumedCode:
				if(intervalType === "INTERVAL"){
					intervalTimeTotal = nowTime.getTime() - intervalStartTimeStamp.getTime() - intervalPausedTime;
				}else{
				intervalTimeTotal = intervalEndedTimeStamp.getTime() - intervalStartTimeStamp.getTime() - intervalPausedTime;
				}
				break;
			case pieceStartedCode:
			case restStartedCode:
			case pieceEndedCode:
			case intervalEndedCode:
					if(! intervalEndedTimeStamp instanceof Date){
						//console.log("in getIntervalTimeTotal(): intervalEndedTimeStamp is not a date object");
						pieceTimeTotal = 0;
					}else{
						intervalTimeTotal = intervalEndedTimeStamp.getTime() - intervalStartTimeStamp.getTime() - intervalPausedTime;
					}
				break;
			case "":
				intervalTimeTotal = 0;
				break;
			}
		}
		
		return intervalTimeTotal;	//unit: milliseconds
	};
	this.getPieceSpeedAverage = function(){
		var averageSpeed = this.getPieceDistanceTotal * 1000 / this.getPieceTimeTotal;
		return averageSpeed;	
	};
	this.getIntervalSpeedAverage = function(){
		var averageSpeed = this.getIntervalDistanceTotal * 1000 / this.getIntervalTimeTotal;
		return averageSpeed;	//meters per second
	};
	this.getRestSpeedAverage = function(){
		var averageSpeed = this.getRestDistanceTotal * 1000 / this.getRestTimeTotal;
		return averageSpeed;	
	};
	this.getPieceStrokeRateAverage = function(){
		var averageStrokeRate = this.getPieceStrokeCountTotal * 1000 / this.getPieceTimeTotal;
		return averageStrokeRate;	
	};
	this.getIntervalStrokeRateAverage = function(){
		var averageStrokeRate = this.getIntervalStrokeCountTotal * 1000 / this.getIntervalTimeTotal;
		return averageStrokeRate;	
	};
	
	this.getRestStrokeRateAverage = function(){
		var averageStrokeRate = this.getRestStrokeCountTotal * 1000 / this.getRestTimeTotal;
		return averageStrokeRate;	
	};
	this.getPiecePausedTime = function(){
		return piecePausedTime;
	};
	this.getIntervalPausedTime = function(){
		return intervalPausedTime;
	};
	this.getRestPausedTime = function(){
		return restPausedTime;
	};

///////////////////////////////////////////////////////////////////////////////
//		 methods called to set values in rowData
///////////////////////////////////////////////////////////////////////////////

	this.setHeading = function(hding){
		if(checkForChange(heading, hding)) {
			heading = hding;
		}
	};
	
	this.setLat = function(la){
		if(checkForChange(lat, la)) {
			lat = la;
		}
	};
	
	this.setLon = function(lo){
		if(checkForChange(lon, lo)) {
			lon = lo;
		}
	};
	this.setSpeed = function(spd){
		if(checkForChange(speed, spd)) {
			speed = spd;
		}
	};
	this.setSplitTime = function(sptime){
			splits = sptime;
	};
	
	this.setAccuracy = function(acc){
		if(checkForChange(accuracy, acc)) {
			accuracy = acc;
		}
	};


	this.setGuiEventTime = function(guiEvTm){
		if(checkForChange(guiEventTime, guiEvTm)) {
			guiEventTime = guiEvTm;
		}
	};
	this.setSavedToCloud = function (saved){
		if(checkForChange(savedToCloud, saved)) {
			savedToCloud = saved;
		}
	};
	this.setSavedToLocal = function (saved){
		if(checkForChange(savedToLocal, saved)) {
			savedToLocal = saved;
		}
	};
	this.setUpLoadID = function (upID) {
        if (checkForChange(upLoadID, upID)) {
            upLoadID = upID;
        }
    };
	this.setDeveloperMode = function (dev) {
        if (checkForChange(developer, dev)) {
            developer = dev;
        }
    };
	this.setTYPE = function (tyPE) {
        if (checkForChange(type, tyPE)) {
            type = tyPE;
        }
    };
	
	//very large function, //could do with more commenting
	this.setGuiEvent = function(guiEv, intervalNumberIn){
        
		
		//if(checkForChange(guiEvent, guiEv))
		{

			var intervalNumberOld = intervalNumber;
			var guiEventOld = guiEvent;
			var intervalTypeOld = intervalType;
			//can set values now as the old ones are no longer needed to check for change types
			guiEvent = guiEv;
			intervalNumber = intervalNumberIn;
			var indexIDX = parseInt(this.getIDX())+1;
			this.setIDX(indexIDX);
			
			this.setGuiEventTime(new Date());
			
			switch(guiEv){
			case pieceStartedCode:	//piece started
				pauseEnded();
				resetPieceTotals();
				intervalType = "PIECE";
				pieceStartTimeStamp = new Date();
				rdLog.newPiece("PIECE");
				break;
			case pieceEndedCode:	//piece ended
				pauseEnded(); // ends pause if paused
				switch(intervalTypeOld){
				case "INTERVAL":	//interval also ended if piece ended
					intervalEndedTimeStamp = new Date();
					break;
				case "REST":	//rest also ended if piece ended
					restEndedTimeStamp = new Date();
					break;
				}
				pieceEndedTimeStamp = new Date();
				intervalType = "NONE";
				//guiEvent and all dependant variables set
				//Doing other stuff to be done when Piece ends
				switch(intervalTypeOld){
				case "INTERVAL":	//interval also ended if piece ended	
					rdLog.intervalCompleted(intervalNumberOld);
					break;
				case "REST":	//rest also ended if piece ended
					rdLog.restCompleted(intervalNumberOld);
					break;
				}
				rdLog.pieceCompleted();
				break;
			case piecePausedCode:	//piece paused
				piecePaused();
				break;
			case pieceResumedCode:	//piece resumed
				pauseEnded();
				break;
			case intervalStartedCode:	//interval started	
				pauseEnded();
				resetIntervalTotals();
				switch(intervalTypeOld){
				case "NONE":	//piece started if new interval, but no piece
					resetPieceTotals();
					pieceStartTimeStamp = new Date();
					break;
				case "REST":	//rest ended if interval started
					restEndedTimeStamp = new Date();
					break;
				}
				intervalType = "INTERVAL";
				intervalStartTimeStamp = new Date();
				
				//guiEvent and all dependant variables set
				//Doing other stuff to be done when interval starts
				switch(intervalTypeOld){
				case "NONE":	//piece started if new interval, but no piece
					rdLog.newPiece("INTERVAL");
					break;
				case "REST":	//rest ended if interval started
					rdLog.restCompleted(intervalNumberOld);
					break;
				}
				break;
			case intervalEndedCode:		//interval set ended, piece also ended
				pauseEnded(); // ends pause if paused
				switch(intervalType){
				case "INTERVAL":	//interval ended if interval set ended
					intervalEndedTimeStamp = new Date();
					break;
				case "REST":	//rest ended if interval set ended
					restEndedTimeStamp = new Date();
					break;
				}
				pieceEndedTimeStamp = new Date();
				intervalType = "NONE";
				
				//guiEvent and all dependant variables set
				//Doing other stuff to be done when interval starts
				switch(intervalTypeOld){
				case "INTERVAL":	//interval ended if interval set ended
					//rdLog.intervalCompleted(intervalNumberOld);
					break;
				case "REST":	//rest ended if interval set ended
					//rdLog.restCompleted(intervalNumberOld);
					break;
				}
				//rdLog.pieceCompleted();
				break;
			case restStartedCode:	//rest started
				pauseEnded();
				resetRestTotals();
				switch(intervalTypeOld){
				case "NONE":	//piece started if rest started with no piece
					resetPieceTotals();
					pieceStartTimeStamp = new Date();
					break;
				case "INTERVAL":	//interval ended if rest started
					intervalEndedTimeStamp = new Date();
					break;
				}
				intervalType = "REST";
				restStartTimeStamp = new Date();
				
				//guiEvent and all dependant variables set
				//Doing other stuff to be done when interval starts
				switch(intervalTypeOld){
				case "NONE":	//piece started if rest started with no piece
					rdLog.newPiece("INTERVAL");
					break;
				case "INTERVAL":	//interval ended if rest started
					rdLog.intervalCompleted(intervalNumberOld);
					break;
				}
				break;
			}
			// update rdLog for change in GUI Event
			rdLogArray.addElement();
			
			
/*		WE NEED TO ADD SOME CODE HERE TO MAKE SURE THAT ALL GUI Events are added to the  array 

this.addRowingDataElement = function(rowDataIn){
		var nextRowingDataElement = new RowingDataElement(rowDataIn);
		dataLogArray.push(nextRowingDataElement);
	};*/
			
			////logRowingData();
		}
	
	};
	
	this.setLogTime = function(logTm){
        if(checkForChange(logTime, logTm)) {
			logTime = logTm;
		}
	};
	this.setUserID = function(useID){
        if(checkForChange(userID, useID)){
			userID = useID;
		}
	};
	this.setUserEM = function(useEM){
        if(checkForChange(userEM, useEM)){
			userEM = useEM;
		}
	};
	this.setUserSecret = function(usersecret){
        if(checkForChange(userSecret, usersecret)){
			userSecret = usersecret;
		}
	};
	this.setUserBUp = function(userbup){
        if(checkForChange(userBUp, userbup)){
			userBUp = userbup;
		}
	};
	this.setPAID = function(PAID){
        if(checkForChange(paID, PAID)){
			paID = PAID;
		}
	};
	this.setIDX = function(idx){
        if(checkForChange(idX, idx)){
			idX = idx;
		}
	};
	this.setTrainingPlanID = function(trainID){
        if(checkForChange(trainingPlanID, trainID)){
			trainingPlanID = trainID;
			//logRowingData();
		}
	};
	this.setSessionID = function(sessID){
		if(checkForChange(sessionID, sessID)) {
			sessionID = sessID;
		}
		//logRowingData();
	};
	this.setClubID = function(clubIDIn){
		if(checkForChange(clubID, clubIDIn)) {
			clubID = clubIDIn;
			//logRowingData();
		}
	};

	this.setPieceID = function(pID){
		if(checkForChange(pieceID, pID)){
			pieceID = pID;
			//logRowingData();
		}
	};

	this.setStrokeRate = function(sr){
        if(checkForChange(strokeRate, sr))
		{
			strokeRate = sr;
			if(strokeRate-strokeRateLastSaved > 10 || strokeRate-strokeRateLastSaved < -10 ){
				//logRowingData();
			}
		}
	};
	
	this.setStrokeCount = function(sc){
        if(checkForChange(strokeCount, sc)){
			var strokeCountChanged = sc - strokeCount;
			
			switch(guiEvent){
				case pieceStartedCode:
				case pieceResumedCode:
				case intervalStartedCode:
				case restStartedCode:
					switch(intervalType){
						case "INTERVAL":
							intervalStrokeCountTotal += strokeCountChanged;
							break;
						case "REST":
							restStrokeCountTotal +=strokeCountChanged;
							break;
					}
					pieceStrokeCountTotal += strokeCountChanged;
				break;
			}
			
		
		}
		strokeCount = sc;
	};

	this.setHeartRate = function(hr){
		if(checkForChange(heartRate, hr)) {
			heartRate = hr;
			//TODO HR average(like distance, but with time integration)
		}
	};
	this.setRawAc = function(raw){
		rawAcceleration = raw;
	};
	this.setUrlResult = function(url){
		resultUrl = url;
	};
	this.setUrlWebResult = function(urlweb){
		resultUrlWeb = urlweb;
	};
	this.setWebResultsDate = function(dateDone){
		resultDone = dateDone;
	};

	this.setDistance = function(dis){
        if(checkForChange(distance, dis)){
			var distanceChanged = dis - distance;
			distance = dis;
			
			switch(guiEvent){
			case pieceStartedCode:
			case pieceResumedCode:
			case intervalStartedCode:
			case restStartedCode:
				switch(intervalType){
				case "INTERVAL":
					intervalDistanceTotal += distanceChanged;
					break;
				case "REST":
					restDistanceTotal += distanceChanged;
					break;
				}
				pieceDistanceTotal += distanceChanged;
				break;
			}

			if(distance - distanceLastSaved > 50){
				//logRowingData();
			}
		}
	};

	
}
