function RowDataLog(){
	var dataLogArray = [];
	var savingStatusArray = [];
	var pieceLogArray = [];
	var numberOfDiskEntries = 0;

///////////////////////////////////////////////////////////////////////////////
//		Internal Object Constructors
///////////////////////////////////////////////////////////////////////////////

	function PiecesElement(rowDataIn, pieceType){
		this.savedToCloud = rowDataIn.getSavedToCloud();
		this.savedToLocal = rowDataIn.getSavedToLocal();
		this.upLoadID = rowDataIn.setUpLoadID();

		this.pieceComplete = false;
		this.userID = rowDataIn.getUserID();
		this.trainingPlanID = rowDataIn.getTrainingPlanID();
		this.sessionID = rowDataIn.getSessionID();
		this.pieceID = rowDataIn.getPieceID();
		this.startTime = rowDataIn.getGuiEventTime();
		switch(pieceType){
		case "PIECE":
			this.intervals = false;
			break;
		case "INTERVAL":
			this.intervals = true;
			this.intervalArray = [];
			this.restArray = [];
			break;
		}
	}
///////////////////////////////////////////////////////////////////////////////
//		Functions/methods called from within rowDataLog
///////////////////////////////////////////////////////////////////////////////	
	
	function dataToJsonObj(dataElement){
		 var jsonObj = {
		 // UUID if necessary
			"guiE":dataElement.guiEvent,
			"guiT":dataElement.guiEventTime,
			"logT":dataElement.logTime,
			"usID":dataElement.userID,
			"usEM":dataElement.userEM,	
			"plID":dataElement.trainingPlanID,
			"seID":dataElement.sessionID,
			"piID":dataElement.pieceID,
			"paID":dataElement.paID,
			"idX": dataElement.idX,
			"type":dataElement.type,
			"stRt":dataElement.strokeRate,
			"stCt":dataElement.strokeCount,
			"htRt":dataElement.heartRate ,
			"dist":dataElement.distance,
			"spd":dataElement.speed,
			"lat":dataElement.lat,
			"lon":dataElement.lon,
			"acc":dataElement.accuracy,
			"head":dataElement.heading,
			"webS":dataElement.savedToCloud,
			"locS":dataElement.savedToLocal,
			"upLoadID":dataElement.upLoadID
		}; 
		
		return jsonObj;
	}
	
	function dataToJson(dataElement){
		return JSON.stringify(dataToJsonObj(dataElement));
	}	


	
	function RowingDataElement(rData){
		//this.savedToCloud = false;//rData.getSavedToCloud();
		//this.savedToLocal = rData.getSavedToLocal();
		this.upLoadID = rData.getUpLoadID();
		this.guiEvent = rData.getGuiEvent();
		this.guiEventTime = rData.getGuiEventTime();
		this.logTime = rData.getLogTime();
		this.userID = rData.getUserID();
		this.userEM = rData.getUserEM();
		this.paID = rData.getPAID();
		this.type = rData.getTYPE();
		this.idX = rData.getIDX();
		this.trainingPlanID = rData.getTrainingPlanID();
		this.sessionID = rData.getSessionID();
		this.pieceID = rData.getPieceID();
		this.strokeRate = rData.getStrokeRate();
		this.strokeCount = rData.getStrokeCount();
		this.heartRate = rData.getHeartRate();
		this.distance = rData.getDistance();
		//this.speed = rData.getSpeed();
		this.speed = rData.getSplitTime();
		this.lat = rData.getLat();
		this.lon = rData.getLon();
		this.accuracy = rData.getAccuracy();
		this.heading = rData.getHeading();
		
		this.savingStatus = false;
		
	}
	function SavingDataElement(rData){

		this.upLoadID = rData.getUpLoadID();
		this.sendingState = rData.getSendingState();
		this.savedToWeb = rData.setSavedToCloud();
		
	}
	
	
	this.addRowingDataElement = function(rData){
		var dataElement = new RowingDataElement(rData);
		dataLogArray.push(dataElement);
		
	};
	this.returnDataLogArray = function(rData){
		 return dataLogArray;
		
	};
	
	
	/*this.returnLastJson = function(){
		return dataToJson(dataLogArray[dataLogArray.length - 1]);
	};*/
	
	this.returnDataUnSavedCloud = function(maxNumber, savingUUID){
		var i = 0;
		var savingNumber = 0;
		var dataLogId = [];
		var jsonArray = [];
		while (i<dataLogArray.length && savingNumber <= maxNumber){
			if(dataLogArray[i].savedToCloud === false){
				dataLogArray[i].savingUUID = savingUUID;
				jsonArray.push(dataToJsonObj(dataLogArray[i]));
				dataLogId.push(i);
				savingNumber++;
			}
			i++;
		}

		
		return jsonArray;
	};
	
	this.markDataWebSaved = function(savingUUID){
		var i = 0;
		var count =0;
		
		while (i<dataLogArray.length){
			if(dataLogArray[i].savingUUID == savingUUID){
				dataLogArray[i].savedToCloud = true;
				count++;
				if (count == dataLogArray.length){
				}
				
			}
			i++;
		}
	};
	this.checkSize = function(){
		
		var count = 0;
		var i = 0;
		var ans;
		while(i <dataLogArray.length){
			if(dataLogArray[i].savedToCloud === true){
				count++;
			}
			if(count >= dataLogArray.length){
				dataItem["syncComplete"]=true;
				ans = true;
			}else{
				ans = false;
			}
			i++;
			count++;
		}
		return ans;
	};
	this.saveArrayStorage = function (keyID) {
		
		var value = {
				"rowDataArray":dataLogArray,    // Array of RowData elements
				"savingStatus":savingStatusArray,
				"savedToWeb":false,
				"athleteId":dataLogArray[0].userID
			};
		if(value.athleteId != 0){
			var avail = $.jStorage.storageAvailable();
			if(avail){
				$.jStorage.set(keyID,value);
			}else{
				navigator.notification.alert(
					'Please free up space\ndelete Entries in History',
					MemMsgDelete,
					'Memory Full',
					'Ok'
				);
			}
			//var tempArray = $.jStorage.get(keyID);
		}else{
			//console.log("demo user data not saved");
		}
		function MemMsgDelete(){
		};
	};
	this.setSavingStatus = function (uuid,sendingState,attempts,sentDate){
			this.sendingState = sendingState;
			this.attempts = attempts;
			this.sentDate = sentDate;
		
	};
	this.getSavingStatus = function (){
		return this.savingStatus;
	};
	this.addSavingStatus = function(rData){
		var savingElement = new RowingDataElement(rData);
	};
	this.clearArray = function() {
		dataLogArray.length = 0;
	};
	this.newPiece = function(pieceType){
		var newPiece = new PiecesElement(rData, pieceType);
		pieceLogArray.push(newPiece);
	};
	
	this.intervalCompleted = function(intervalNumber){
		if(rData.getPieceID() === pieceLogArray[pieceLogArray.length -1].pieceID){
			var intervalElement = {
				"intervalNumber": intervalNumber,
				"intervalDistance": rData.getIntervalDistanceTotal(),
				"intervalTime": rData.getIntervalTimeTotal(),
				"intervalStrokeCount": rData.getIntervalStrokeCountTotal(),
				"intervalPausedTime": rData.getIntervalPausedTime()
			};
			pieceLogArray[pieceLogArray.length -1].intervalArray.push(intervalElement);
		}else{
			//error here
		}
	};
	
	this.restCompleted = function(restNumber){
		if(rData.getPieceID() === pieceLogArray[pieceLogArray.length -1].pieceID){
			var restElement = {
				"restNumber": restNumber,
				"restDistance": rData.getRestDistanceTotal(),
				"restTime": rData.getRestTimeTotal(),
				"restStrokeCount": rData.getRestStrokeCountTotal(),
				"restPausedTime": rData.getRestPausedTime()
			};
			pieceLogArray[pieceLogArray.length -1].restArray.push(restElement);
		}else{
			//error here
		}
	};
	
	this.pieceCompleted = function(){
		
			if(rData.getPieceID() === pieceLogArray[pieceLogArray.length -1].pieceID){
				pieceLogArray[pieceLogArray.length -1].pieceComplete = true;
				pieceLogArray[pieceLogArray.length -1].pieceCompletedTime = rData.getGuiEventTime();
				pieceLogArray[pieceLogArray.length -1].pieceDistance = rData.getPieceDistanceTotal();
				pieceLogArray[pieceLogArray.length -1].pieceStrokeCount = rData.getPieceStrokeCountTotal();
				pieceLogArray[pieceLogArray.length -1].pieceTime = rData.getPieceTimeTotal();
				pieceLogArray[pieceLogArray.length -1].piecePausedTime = rData.getPiecePausedTime();
				
			
			}else{
				//error here
			}
		
	};
}
