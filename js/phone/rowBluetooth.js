document.addEventListener('deviceready',onDeviceReadyBLE, false);
var index = 0;
var intervalCheck = null;
var IntervalCheckDataTimer = 10000;
var batlowlevel = 20;

$("#findBlueBelt").on("click", function(){
    blueLE.isOFF = true;
	blueLE.isInUse = true;
	setButtonsOff();
	if(!intervalCheck){
		intervalCheck = setInterval(IntervalCheckData, IntervalCheckDataTimer);
	}
	//$("#indicatorble").show();
	$("#disconnectBluetooth").removeClass('ui-disabled');
	resetMessages();
	$("#messageTitle").text("Trying to connect");
		blueLE.startConnection();
});
	
$("#connectBluetooth").on("click", function(){
	setButtonsOff();
	
	if(!intervalCheck){
		IntervalCheckData();
		intervalCheck = setInterval(IntervalCheckData, IntervalCheckDataTimer);
	}
	//$("#indicatorble").show();
	$("#disconnectBluetooth").removeClass('ui-disabled');
    blueLE.isOFF = true;
	blueLE.isInUse = true;
    if(blueLE.isConn){
        blueLE.unsubscribeDevice();
        setTimeout(function(){
           resetDevice();
        },2000);
    }else{
        resetDevice();
    }
});
$("#disconnectBluetooth").on("click", function(){
		
	blueLE.isOFF=false;
	blueLE.isInUse = false;
	setButtonsOn();
	$("#disconnectBluetooth").addClass('ui-disabled');
	if(blueLE.isDisc === true){
		blueLE.unsubscribeDevice();
	}else{
		blueLE.disconnectDevice();
	}
	
	setTimeout(function (){
		clearInterval(intervalCheck);
		intervalCheck = null;
		resetMessages();
		resetDisplay();
		$("#indicatorble").hide();
					
	},2000);
});


$("#closepopupbelt").on("click", function(){
	$("#beltfound").popup("close");
});

function resetDevice(){
    if(!blueLE.isInit){
        blueLE.startConnection();
    }else{
		if(blueLE.deviceAdd !== null){
			blueLE.connectDevice(blueLE.deviceAdd);
		}else{
			blueLE.startConnection();
		}
	}
}
function setButtonsOn() {
	$("#connectBluetooth").removeClass('ui-disabled');
	$("#findBlueBelt").removeClass('ui-disabled');
}
function setButtonsOff() {
	$("#connectBluetooth").addClass('ui-disabled');
	$("#findBlueBelt").addClass('ui-disabled');
}
function phoneAndroidVer() {
	if (window.device.platform == blueLE.androidPlatform){
		var v1 = parseFloat(getAndroidVersion());
		if(v1 < 4.3) {
			$("#blutoothstatus").text(" Android version :  "+v1+" does not Support Bluetooth Low Energy Devices");
			setButtonsOff();
		}
	}
}

function resetMessages(){
	$("#messageStatus").text("");
	$("#messageError").text("");
	$("#messageReturn").text("");
	$("#messageReturn2").text("");
	$("#messageReturn3").text("");
	blueLE.messageRData("N/c");
}

function resetDisplay() {
	$("#messageTitle").text("");
	$("#messageReturn").text("");
	$("#messageReturn2").text("");
	$("#messageReturn3").text("");
	blueLE.messageRData("N/c");
}

function onDeviceReadyBLE() {
	$("#indicatorble").hide();
	$("#disconnectBluetooth").addClass('ui-disabled');
	
	if (window.device.platform == blueLE.wp8Platform) {
		$("#connectBluetooth").addClass('ui-disabled');
		$("#findBlueBelt").addClass('ui-disabled');
	
	} else {
	    phoneAndroidVer();
	    $("#disconnectBluetooth").addClass('ui-disabled');
	    document.addEventListener("pause", onPauseBLE, false);
	    $("#messageTitle").text("Bluetooth Ready");
	    //IntervalCheckData();
	    //intervalCheck = setInterval(IntervalCheckData, IntervalCheckDataTimer);

	}
	
	resetMessages();
	resetDisplay();
	blueLE.isScan = false;
	blueLE.isConn = false;
	blueLE.isDisc = false;
	blueLE.isOFF = false;
	
}
//phoneAndroidVer ()

function getAndroidVersion (ua) {
	ua = ua || navigator.userAgent;
	var match = ua.match(/Android\s([0-9\.]*)/i);
	return match ? match[1] : false;
}


function IntervalCheckData(){
	$("#regBluetooth").page();
	blueLE.checkStatus();
	
	if(!blueLE.isInit) {
		resetMessages();
		resetDisplay();
		$("#messageTitle").text("Bluetooth OFF");
			
	}else if(blueLE.isConn && !blueLE.isDisc){
		resetMessages();
		$("#messageTitle").text("Disconnecting");
		blueLE.disconnectDevice();
	}else if(!blueLE.isConn && !blueLE.isDisc){
		resetMessages();
		 blueLE.startConnection();
		//resetDevice();		
		$("#messageTitle").text("Bluetooth Ready");
	}else if(blueLE.isConn && blueLE.isDisc){
		setButtonsOff();
		$("#disconnectBluetooth").removeClass('ui-disabled');
		$("#messageTitle").text("Bluetooth Ready");
	}else{
		$("#messageTitle").text("Bluetooth Ready");
	}
}
function onPauseBLE() {
	if (window.device.platform != blueLE.wp8Platform) {
		clearInterval(intervalCheck);
		intervalCheck = null;
		
		blueLE.unsubscribeDevice();
		document.addEventListener("resume",onResumeBLE,false);
	}
}
function onResumeBLE() {
	if (window.device.platform != blueLE.wp8Platform) {
		if(!intervalCheck){
			
			if(blueLE.isInUse == true){	
				resetMessages();
				resetDevice();	
				$("#messageTitle").text("Reset in Progress ...");
				IntervalCheckData();
				intervalCheck = setInterval(IntervalCheckData, IntervalCheckDataTimer);
			}else{
				resetMessages();
				resetDisplay();
			}
				
		}
	}
}

function onUnLoad(){
	if(window.device){
		if (window.device.platform != blueLE.wp8Platform) {
			clearInterval(intervalCheck);
			intervalCheck = null;
			blueLE.disconnectDevice();
		}
	}
}


var blueLE = {
	addressKey : "address",
	deviceAdd : "ADD",
	isConn	: false,
	isInit	: false,
	isScan	: false,
	isDisc	: false,
    isOFF   : false,
	isInUse : false,
	    
    heartRateServiceUuid : "180d",
    heartRateMeasurementCharacteristicUuid : "2a37",
    clientCharacteristicConfigDescriptorUuid :"2902",
    batteryServiceUuid : "180f",
    batteryLevelCharacteristicUuid : "2a19",

	scanTimer: null,
	connectTimer : null,
	reconnectTimer : null,

	iOSPlatform: "iOS",
	androidPlatform : "Android",
	wp8Platform : "Win32NT",
	
	messageSuccess:function(msg){
		$("#messageStatus").text(msg);
	},
	messageError:function(msg) {
		$("#messageError").text(msg);
	},
	messageReport:function(rpt) {
		$("#messageReturn2").text("HR  : "+rpt);
		
	},
	messagepopup:function(msg,popupTime) {
		$('#beltfound').popup("close");
		$("#beltmsg").text(msg);
		$('#beltfound').popup("open");
		setTimeout(function(){
			$('#beltfound').popup("close");
		},popupTime);
		
	},
	batteryLevelMessage:function(res){
		$("#messageReturn").text("Battery "+res);
		if(res < batlowlevel){
			blueLE.messagepopup("Heart Rate Belt Battery Low  :"+res+"%",2000);
		}
	},
	alertBatLow: function(){		
		//tbd   handed batery LOw");
	},
	messageRData:function(msg){
		rData.setHeartRate(msg);
	},
	checkInit: function() {
		bluetoothle.isInitialized(blueLE.isInitializedCall);
		
	},
	checkConnection: function() {
		bluetoothle.isConnected(blueLE.isConnectedCall);
		
	},
	checkDiscovered: function() {
		bluetoothle.isDiscovered(blueLE.isDiscoveredCall);
		
	},
	checkScanning: function() {
		bluetoothle.isScanning(blueLE.isScanningCall);
	},
	checkStatus: function() {
		blueLE.checkInit();
		blueLE.checkConnection();
		blueLE.checkDiscovered();
		blueLE.checkScanning();
		
	},
	isInitializedCall: function(obj) {
		
		if(window.device.platform == blueLE.iOSPlatform){
			blueLE.isInit = obj;
		}else{
			blueLE.isInit = obj.isInitalized;
		}
		
		if(blueLE.isInit === true){
			$("#indicator1").removeClass("indRed").addClass("indGreen");
		}else{
			$("#indicator1").removeClass("indGreen").addClass("indRed");
		}
	},
	isScanningCall: function(obj) {
		/*if(window.device.platform == blueLE.iOSPlatform){
			blueLE.isScan = obj;
		}else{
			blueLE.isScan = obj.isScanning;
		}*/
		
		if(blueLE.isScan === true){
			$("#indicator2").removeClass("indYellow").addClass("indGreen");
		}else{
			$("#indicator2").removeClass("indGreen").addClass("indYellow");
		}
	},
	isConnectedCall: function(obj) {
		if(window.device.platform == blueLE.iOSPlatform){
			blueLE.isConn = obj;
		}else{
			blueLE.isConn = obj.isConnected;
		}
		if(blueLE.isConn === true){
			$("#indicator3").removeClass("indRed").addClass("indGreen");
		}else{
			$("#indicator3").removeClass("indGreen").addClass("indRed");
		}
	},
	isDiscoveredCall: function(obj) {
		if(window.device.platform == blueLE.iOSPlatform){
			//blueLE.isScan = obj;
		}else{
			
		}
		//blueLE.isDisc = obj;
		if(blueLE.isDisc === true){
			$("#indicator4").removeClass("indRed").addClass("indGreen");
		}else{
			$("#indicator4").removeClass("indGreen").addClass("indRed");
		}
	},
	checkBLE: function(){
		alert("Pressed in BLE");
	},
	startConnection : function() {
		blueLE.checkStatus();
        //bluetoothle.initialize(blueLE.initializeSuccess, blueLE.initializeError);
        blueLE.messageSuccess("Search for Belt");
        
		if(blueLE.isScan){
			blueLE.messageSuccess("Scan in Progress");
		}else{
			if(blueLE.isDisc){
				blueLE.unsubscribeDevice();
			}else if(blueLE.isConn) {
				blueLE.disconnectDevice();
			}
			setTimeout( function() {
				blueLE.deviceAdd = null;
				bluetoothle.initialize(blueLE.initializeSuccess, blueLE.initializeError);
			},1000);
		}
	},
	connectDevice: function(address) {
		blueLE.messageSuccess("Connect to :"+address);
		var paramsObj = {"address":address};
		bluetoothle.connect(blueLE.connectSuccess, blueLE.connectError, paramsObj);
		blueLE.connectTimer = setTimeout(blueLE.connectTimeout, 10000);
	},
	reconnect: function(){
		blueLE.messageSuccess("Reconnection in 5 sec");
		bluetoothle.reconnect(blueLE.reconnectSuccess, blueLE.reconnectError);
		blueLE.reconnectTimer = setTimeout(blueLE.reconnectTimeout, 8000);
	},
	disconnectDevice:function() {
		blueLE.checkConnection();
		if(blueLE.isConn){
			bluetoothle.disconnect(blueLE.disconnectSuccess, blueLE.disconnectError);
		}else{
			blueLE.messageSuccess("Not Connected");
			blueLE.closeDevice();
		}
	},
	closeDevice:function() {
		bluetoothle.close(blueLE.closeSuccess, blueLE.closeError);
	},
	unsubscribeDevice: function() {
		blueLE.messageSuccess("Disconnecting HR Service");
		var paramsObj = {"serviceUuid":blueLE.heartRateServiceUuid,
						 "characteristicUuid":blueLE.heartRateMeasurementCharacteristicUuid};
		bluetoothle.unsubscribe(blueLE.unsubscribeSuccess, blueLE.unsubscribeError, paramsObj);
	},
	readBatteryLevel:function() {
		blueLE.messageSuccess("Reading Battery Level");
		var paramsObj = {"serviceUuid":blueLE.batteryServiceUuid,
		 "characteristicUuid":blueLE.batteryLevelCharacteristicUuid};
		bluetoothle.read(blueLE.readSuccess, blueLE.readError, paramsObj);
	},

	
	initializeSuccess:function(obj) {
		$("#blutoothstatus").text("");
		$("#indicatorble").show();
        blueLE.isInit = true;
		if(!blueLE.isScan){
			var paramsObj = {"serviceUuids":[blueLE.heartRateServiceUuid]};
			bluetoothle.startScan(blueLE.startScanSuccess, blueLE.startScanError, paramsObj);
		}
	},
    
	startScanSuccess: function(obj){
        blueLE.isScan = true;
		if (obj.status == "scanResult"){
			blueLE.deviceAdd = obj.address;
			setTimeout(function() {
				blueLE.connectDevice(blueLE.deviceAdd);
				bluetoothle.stopScan(blueLE.stopScanSuccess, blueLE.stopScanError);
				blueLE.clearScanTimeout();
				
			},500);
			blueLE.messageSuccess("Scan Found :"+obj.name+" - "+obj.address);
			
		}
		else if (obj.status == "scanStarted") {
			//blueLE.messageSuccess("Scan Started :");
			blueLE.scanTimer = setTimeout(blueLE.scanTimeout, 10000);
		}else {
            blueLE.isScan = false;
			blueLE.messageSuccess("Error: " + obj.status);
		}
	},
	
    stopScanSuccess: function(obj){
       blueLE.isScan = false;
        if (obj.status == "scanStopped") {
			// tbd
        } else {
			//tbd
        }
    },
	
	connectSuccess: function(obj) {
		$("#indicatorble").show();
		if (obj.status == "connected") {
			$("#messageTitle").text(obj.name+" - "+obj.address);
			blueLE.clearConnectTimeout();
			if (window.device.platform == blueLE.iOSPlatform){
				blueLE.messageSuccess("HR Service");
				var paramsObj = {"serviceUuids":[blueLE.heartRateServiceUuid]};
				bluetoothle.services(blueLE.servicesHeartSuccess, blueLE.servicesHeartError, paramsObj);
			}else if (window.device.platform == blueLE.androidPlatform){
				blueLE.messageSuccess("Collecting Data");
				bluetoothle.discover(blueLE.discoverSuccess, blueLE.discoverError);
			}
			//blueLE.tempDisconnectDevice();
		}else if (obj.status == "connecting"){
			blueLE.messageSuccess("Connecting to "+obj.name+" - "+obj.address);
		}else{
            blueLE.isDisc = false;
			blueLE.messageSuccess("Connection Problem : " + obj.status);
            
            //unsubscribe to close and allow reconnect
			blueLE.clearConnectTimeout();
		}
	},
	reconnectSuccess: function(obj) {
		$("#indicatorble").show();
		if (obj.status == "connected"){
			blueLE.messageSuccess("Reconnected to "+obj.name);
			blueLE.clearReconnectTimeout();
			
			if (window.device.platform == blueLE.iOSPlatform){
				blueLE.messageSuccess("HR Service");
				var paramsObj = {"serviceUuids":[blueLE.heartRateServiceUuid]};
				bluetoothle.services(blueLE.servicesHeartSuccess, blueLE.servicesHeartError, paramsObj);
			}else if (window.device.platform == blueLE.androidPlatform){
				blueLE.messageSuccess("Gathering Data");
				bluetoothle.discover(blueLE.discoverSuccess, blueLE.discoverError);
			}
		}else if (obj.status == "connecting"){
			blueLE.messageSuccess("Reconnecting to "+obj.name);
		}else{
			blueLE.messageSuccess("Error : " + obj.status);
            //blueLE.isConn = false;
			blueLE.disconnectDevice();
		}
	},
    
    servicesHeartSuccess: function(obj) {
       
        if (obj.status == "discoveredServices") {
			blueLE.isDisc = true;
            var serviceUuids = obj.serviceUuids;
            for (var i = 0; i < serviceUuids.length; i++) {
                var serviceUuid = serviceUuids[i];
                
                if (serviceUuid == blueLE.heartRateServiceUuid) {
                    var paramsObj = {"serviceUuid":blueLE.heartRateServiceUuid, "characteristicUuids":
                        [blueLE.heartRateMeasurementCharacteristicUuid]};
                    bluetoothle.characteristics(blueLE.characteristicsHeartSuccess, blueLE.characteristicsHeartError, paramsObj);
                    return;
                }
            }
        } else {
            //Unexpected services heart status: " + obj.status
        }
        blueLE.disconnectDevice();
    },
    

	characteristicsHeartSuccess:function(obj) {
       
       //"characteristic heart success : "+obj.status
		
		if (obj.status == "discoveredCharacteristics") {
			blueLE.isDisc = true;
			var characteristicUuids = obj.characteristicUuids;
			for (var i = 0; i < characteristicUuids.length; i++) {
				blueLE.messageSuccess("HR Service Started");
				var characteristicUuid = characteristicUuids[i];
				if (characteristicUuid == blueLE.heartRateMeasurementCharacteristicUuid) {
					var paramsObj = {"serviceUuid":blueLE.heartRateServiceUuid,
					   "characteristicUuid":blueLE.heartRateMeasurementCharacteristicUuid};
					bluetoothle.descriptors(blueLE.descriptorsHeartSuccess, blueLE.descriptorsHeartError, paramsObj);
					return;
				}
			}
			blueLE.messageSuccess("Error: ");
            blueLE.isDisc=false;
		}else{
			blueLE.messageSuccess("Error : " + obj.status);
            blueLE.isDisc = false;
		}
		blueLE.disconnectDevice();
	},
	
	descriptorsHeartSuccess: function(obj) {
		
		if (obj.status == "discoveredDescriptors"){
			blueLE.messageSuccess("Checking Battery ");
			var paramsObj = {"serviceUuids":[blueLE.batteryServiceUuid]};
			bluetoothle.services(blueLE.servicesBatterySuccess, blueLE.servicesBatteryError, paramsObj);
		}else{
			blueLE.messageSuccess("Error : "+obj.status );
			blueLE.disconnectDevice();
		}
	},
	
	servicesBatterySuccess:function(obj) {
		
		if (obj.status == "discoveredServices") {
			var serviceUuids = obj.serviceUuids;
			for (var i = 0; i < serviceUuids.length; i++) {
				var serviceUuid = serviceUuids[i];
				if (serviceUuid == blueLE.batteryServiceUuid) {
					blueLE.messageSuccess("Checking Battery Level ");
					var paramsObj = {"serviceUuid":blueLE.batteryServiceUuid,
					  "characteristicUuids":[blueLE.batteryLevelCharacteristicUuid]};
					  bluetoothle.characteristics(
					  blueLE.characteristicsBatterySuccess,blueLE.characteristicsBatteryError, paramsObj
					);
					return;
				}
			}
			blueLE.messageSuccess("Cant Check Battery: ");
		}else{
			blueLE.messageSuccess("Error : " + obj.status);
		}
		blueLE.disconnectDevice();
	},
	characteristicsBatterySuccess: function(obj){
		
		if (obj.status == "discoveredCharacteristics") {
			var characteristicUuids = obj.characteristicUuids;
			for (var i = 0; i < characteristicUuids.length; i++) {
				var characteristicUuids = characteristicUuids[i];

				if (characteristicUuids == blueLE.batteryLevelCharacteristicUuid) {
					blueLE.readBatteryLevel();
					return;
				}
			}
			blueLE.messageSuccess("Error : ");
		}else{
			blueLE.messageSuccess("Problem Checking Battery: " + obj.status);
		}
		blueLE.disconnectDevice();
	},
	discoverSuccess:function(obj) {
		
		if (obj.status == "discovered") {
			blueLE.messageSuccess("Retriving Data");
			blueLE.readBatteryLevel();
            blueLE.isDisc = true;
		}else{
			blueLE.messageSuccess("Problem with Data : " + obj.status);
            blueLE.isDisc = false;
			blueLE.disconnectDevice();
		}
	},
	readSuccess:function(obj) {
		
		if (obj.status == "read") {
            var bytes = bluetoothle.encodedStringToBytes(obj.value);
			//$("#messageReturn").text("Battery "+bytes[0]);
			var b = bytes[0];
			//"bat level   :"+b);
			if(b){
				blueLE.batteryLevelMessage(b);
			}
			blueLE.messageSuccess("Data in 5 Sec ");
			var paramsObj = {"serviceUuid":blueLE.heartRateServiceUuid,
			 "characteristicUuid":blueLE.heartRateMeasurementCharacteristicUuid};
			bluetoothle.subscribe(blueLE.subscribeSuccess, blueLE.subscribeError, paramsObj);
			//setTimeout(blueLE.unsubscribeDevice, 5000);
		}else{
			//console.log("Unexpected read status: " + obj.status);
			blueLE.messageSuccess(" Error : " + obj.status);
			blueLE.disconnectDevice();
			
		}
	},
	
	subscribeSuccess:function(obj){
       
		 
		if (obj.status == "subscribedResult"){
			blueLE.messageSuccess("Data ");
            //Parse array of int32 into uint8
			//var bytes = bluetoothle.getBytes(obj.value);
			blueLE.isDisc = true;
            var bytes = bluetoothle.encodedStringToBytes(obj.value);
 			//Check for data
			if (bytes.length === 0){
				blueLE.messageSuccess("Result zero length");
				return;
			}
			//Get the first byte that contains flags
			var flag = bytes[0];

			//Check if u8 or u16 and get heart rate
			var hr;
			if ((flag & 0x01) == 1) {
				var u16bytes = bytes.buffer.slice(1, 3);
				var u16 = new Uint16Array(u16bytes)[0];
				hr = u16;
			}else{
				var u8bytes = bytes.buffer.slice(1, 2);
				var u8 = new Uint8Array(u8bytes)[0];
				hr = u8;
			}
			blueLE.messageReport(hr);
			blueLE.messageRData(hr);
		}else if (obj.status == "subscribed"){
			blueLE.messageSuccess("Gathering Data ");
		}else{
			blueLE.messageSuccess("Error : " + obj.status);
            blueLE.isDisc= false;
			blueLE.disconnectDevice();
		}
	},
	unsubscribeSuccess:function(obj){
        
        blueLE.isDisc = false;
		
		if (obj.status == "unsubscribed"){
			blueLE.messageSuccess("Disconnecting Belt ");
			var paramsObj = {"serviceUuid":blueLE.heartRateServiceUuid,
							 "characteristicUuid":blueLE.heartRateMeasurementCharacteristicUuid,
							 "descriptorAssignedNumber":blueLE.clientCharacteristicConfigDescriptorUuid};
			bluetoothle.readDescriptor(blueLE.readDescriptorSuccess, blueLE.readDescriptorError, paramsObj);
		}else{
			blueLE.messageSuccess("Problem Disconnecting : " + obj.status);
			blueLE.disconnectDevice();
		}
	},
	readDescriptorSuccess:function(obj){
        //blueLE.isConn = true;
		
		if (obj.status == "readDescriptor") {
			//var bytes = bluetoothle.getBytes(obj.value);
            var bytes = bluetoothle.stringToBytes(obj.value);
			var u16Bytes = new Uint16Array(bytes.buffer);
			//console.log("Read descriptor value: " + u16Bytes[0]);
			//$("#messageReturn3").text("Read value "+u16Bytes[0]);
			blueLE.disconnectDevice();
		}else{
			blueLE.messageSuccess("Error : " + obj.status);
			blueLE.disconnectDevice();
		}
	},
	disconnectSuccess:function(obj){
        blueLE.isDisc = false;
		if (obj.status == "disconnected"){
			blueLE.messageSuccess("Belt Disconnected");
			blueLE.closeDevice();
		}else if (obj.status == "disconnecting"){
			blueLE.messageSuccess("Disconnecting Belt");
		}else{
		blueLE.messageSuccess("Error : " + obj.status);
		}
	},
	closeSuccess:function(obj) {
        blueLE.isInit = false;
		
		if (obj.status == "closed"){
			blueLE.messageSuccess("Belt Disconnected");
			blueLE.isInit=false;
			blueLE.messageRData("N/c");
			$("#indicatorble").hide();
		}else{
			blueLE.messageSuccess("Unexpected Problem : " + obj.status);
		}
	},
	
	
	initializeError: function(obj) {
        blueLE.isInit = false;
		blueLE.messageSuccess("Problem Connecting :"+obj.message);
		blueLE.messagepopup("Heart Rate Belt Problem Connecting",2000);
	},
	startScanError: function(obj){
        blueLE.isScan = false;
		blueLE.messageSuccess("Searching for Belt"+obj.message);
		
	},
	stopScanError: function(obj){
        blueLE.isScan=true;
		blueLE.messageSuccess("Scan Stoped : " + obj.error+" - "+obj.message);
		
	},
	connectError:function(obj){
		//blueLE.checkConnection();
        //blueLE.isConn = false;
        blueLE.unsubscribeDevice();
		blueLE.messageSuccess("Error Trying Again: " + obj.error+" - "+obj.message);
		blueLE.clearConnectTimeout();
	},
	reconnectError: function(obj){
        //blueLE.isConn = false;
		blueLE.messageSuccess("Error : " + obj.message);
		blueLE.disconnectDevice();
		
	},
	servicesHeartError: function(obj){
        blueLE.isDisc = false;
		blueLE.messageSuccess("Error : " + obj.message);
		blueLE.disconnectDevice();
		
	},
	characteristicsHeartError: function(obj){
        blueLE.isDisc = false;
		blueLE.messageSuccess("Error : " + obj.message);
		blueLE.disconnectDevice();
		
	},
	descriptorsHeartError:function(obj){
		blueLE.messageSuccess("Error : " + obj.message);
		blueLE.disconnectDevice();
		
	},
	servicesBatteryError: function(obj) {
		blueLE.messageSuccess("Error : " + obj.message);
		blueLE.disconnectDevice();
		
	},
	characteristicsBatteryError:function(obj) {
		blueLE.messageSuccess("Error : " + obj.message);
		blueLE.disconnectDevice();
		
	},
	discoverError:function(obj){
        blueLE.isDisc = false;
		blueLE.messageSuccess("Error : " + obj.message);
		blueLE.disconnectDevice();
		
	},
	readError:function(obj){
		blueLE.messageSuccess("Error : " + obj.message);
		blueLE.disconnectDevice();
		
	},
	readDescriptorError:function(obj){
		blueLE.messageSuccess("Error : "+obj.message);
		blueLE.disconnectDevice();
		
	},
	subscribeError:function(obj){
		blueLE.messageSuccess("Error : " + obj.message);
		blueLE.disconnectDevice();
		
	},
	unsubscribeError:function(obj) {
		blueLE.messageSuccess("Error : " + obj.message);
		blueLE.disconnectDevice();
		
	},
	disconnectError:function(obj){
        //blueLE.isConn = false;
		blueLE.messageSuccess("Error : " + obj.error + " - " + obj.message);
	},
	
	closeError:function(obj){
		//blueLE.messageSuccess("Error : " + obj.message);
		//blueLE.disconnectDevice();
	},

	scanTimeout: function(){
		blueLE.messageSuccess("Scan Stopped");
		if(!blueLE.isConn){
			blueLE.messagepopup("Scanning to Find Belt if this continues please ensure you have the correct Belt Type Bluetooth 4.0 and Check Battery in Belt",5000);
		}
		bluetoothle.stopScan(blueLE.stopScanSuccess, blueLE.stopScanError);
		
	},
	clearScanTimeout: function(){
		if (blueLE.scanTimer !== null){
			clearTimeout(blueLE.scanTimer);
			blueLE.scanTimer = null;
		}
	},

	connectTimeout:function(){
		blueLE.messageSuccess("Connection Timed Out");
	},
	clearConnectTimeout:function(){ 
		blueLE.messageSuccess("Reattempt Search");
        //blueLE.unsubscribeDevice();
        //blueLE.disconnectDevice();
		if (blueLE.connectTimer !== null) {
			clearTimeout(blueLE.connectTimer);
			blueLE.connectTimer = null;
		}
	},

	tempDisconnectDevice:function() {
		blueLE.messageSuccess("Disconnecting :");
		bluetoothle.disconnect(blueLE.tempDisconnectSuccess, blueLE.tempDisconnectError);
	},
	tempDisconnectSuccess:function(obj) {
		if (obj.status == "disconnected") {
			blueLE.messageSuccess("Reconnecting in ...");
			setTimeout(blueLE.reconnect, 2000);
		}else if (obj.status == "disconnecting"){
			blueLE.messageSuccess("Disconnecting from Belt");
		}else{
			blueLE.messageSuccess("Error ");
		}
	},
	tempDisconnectError:function(obj) {
		blueLE.messageSuccess("Error : " + obj.message);
	},

	reconnectTimeout:function() {
		blueLE.messageSuccess("Reconnection Timed out");
	},

	clearReconnectTimeout: function() { 
		blueLE.messageSuccess("Restart ");
		if (blueLE.reconnectTimer !== null){
			clearTimeout(blueLE.reconnectTimer);
			blueLE.reconnectTimer = null;
		}
	}

};//blueLE
