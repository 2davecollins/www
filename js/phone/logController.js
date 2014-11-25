function LogRowingData(){
		this.addElement = function() {
			rdLog.addRowingDataElement(rData);
		};
		this.saveArrayStorage = function(keyValue) {
			rdLog.saveArrayStorage(keyValue);
		};
		this.clearArray = function() {
			rdLog.clearArray();
		};
}
//var blockNumber = 0;
var storedLogValues = [];
var intervalLogRowingData = null;
var timeForStorageSave = 2000;
// to be used with live data 
function ExtractData () {
	var extratDataInterval = setInterval (function () {
		var keyID = "paddle";	//default
		keyID = statusItem["keyID"]; //replace with pieceid + datestamp
		if(keyID !== null){
			if(keyID != "recovery") {
				rdLogArray.saveArrayStorage(keyID);
			}else{
				// code to handle what happens imediatly after piece
			}
		
		}else{
			//tbd
		}
		
	},10000);
	
}

function sendToMongoDB(keyToSend) {
	
	var connectionStatus = txData.connectionState();
	var blockUUID;
	var blockData;
	var checkloop = 0;
	
	if (connectionStatus) {
		
		var pieceData = $.jStorage.get(keyToSend);
		statusItem["blockUUID"]=txData.generateUUID();
		blockData = txData.initialTxData(pieceData.rowDataArray,statusItem["blockUUID"]);
		pieceData.savedToWeb = false;
		//popupDialog.popup('open');

		while(blockData.length !== 0){
			
			txData.setSavingStatus(pieceData.savingStatus,statusItem["blockUUID"],"sending");
			txData.txToMongoDB(pieceData,blockData,statusItem["blockUUID"],keyToSend);
			$.jStorage.set(keyToSend,pieceData);
			statusItem["blockUUID"]=txData.generateUUID();
			blockData = txData.initialTxData(pieceData.rowDataArray,statusItem["blockUUID"]);
			checkloop++;
		}
		var attemtTries = 2;
		var attemtsInterval = statusItem["sendTimeout"] +checkloop*1000;
		var mongoDlay1 = setTimeout(function () {
			pieceData = txData.checkSendingStatus(keyToSend);
			var newSave = pieceData;
			$.jStorage.set(keyToSend,newSave);
			
			
		
		},statusItem["sendTimeout"]); //wAIT TIME BETWEEN RETRIES
	
		
		setTimeout(	function(){
			
			var sendok = txData.repeatSendToWeb(keyToSend);
			if(!sendok){
				setTimeout(	function(){
					sendok =txData.repeatSendToWeb(keyToSend);
					if(sendok){
						//txData.displayLocalStorage();//new for lost data
						txData.askForAggregation(keyToSend);
					}else{
						//txData.displayLocalStorage();//new for lost data
					}
				},attemtsInterval*2);
			
			}else{
				//txData.displayLocalStorage();//new for lost data
				txData.askForAggregation(keyToSend);
			}
		},attemtsInterval);
	}else {
	//alert("Offline");
		BlockUUID = "";
		txData.upDateSavingStatus(keyToSend,BlockUUID,false);
	}
}


function saveToLocalStorage() {
	rdLogArray.saveArrayStorage(statusItem["keyID"]);
	statusItem["keyToSend"]=statusItem["keyID"];
	statusItem["keyID"]="recovery"; // change id to prevent overwriting by Extract Data
	rdLog.clearArray();
}
/* 
used to start uploading data to web when dashboard page selected and stopped when directed away from dashboard
*/
var intervalCloudSyn;
var intervalLogRowingData;
var intervalCheckFinish;

function onConfirmSend(btn){
	if(btn == 2){
		sendToMongoDB(statusItem["keyToSend"]);
		statusItem["pieceFinishedDataSend"] = true;
		
	}
}
	

$(document).delegate('#dashboard','pageshow', function(event) {
	if(statusItem["pieceState"] == "RUNNING"){
		results.getPieceData();
		statusItem["syncComplete"]=false;
		if(intervalCheckFinish){
			clearInterval(intervalCheckFinish);
			intervalCheckFinish = null;
		}
		if(intervalLogRowingData){
			clearInterval(intervalLogRowingData);
			intervalLogRowingData = null;
		}
		
		intervalCheckFinish = setInterval( function(){
			if((statusItem["pieceState"] == "STOP")||(statusItem["pieceState"] == "READY")){
				clearInterval(intervalCheckFinish);
				intervalCheckFinish = null;
				clearInterval(intervalLogRowingData);
				intervalLogRowingData = null;
				saveToLocalStorage();
				$.jStorage.reInit();
				setTimeout(function (){
					
					var dataToSend =$.jStorage.get(statusItem["keyToSend"]);
					if(dataToSend){
						var connectionStatus = txData.connectionState();
						if(connectionStatus){
							if(navigator.notification){
								navigator.notification.confirm(
									'Data is ready for sending ',
									onConfirmSend,
									'Piece Finished',
									['Later','Send Now']
								);
							}else{
								var ans = confirm("Send Data Now");
								if(ans){
									onConfirmSend(2);
								}
							}
						}else{
							$.mobile.showPageLoadingMsg("a","Offline Cant Send Data ...",true);
							setTimeout(function () {
								$.mobile.hidePageLoadingMsg();
							},1000);
						}
					}
				},timeForStorageSave);
			}
			
		},1000);
		
		
		intervalLogRowingData = setInterval( function() {
			rData.setLogTime(new Date());
			var indexIDX = parseInt(rData.getIDX())+1;
			rData.setIDX(indexIDX);
			rdLogArray.addElement();
		},parseInt(statusItem["freqCollection"]));
	}
});

