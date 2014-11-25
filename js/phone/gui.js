// declare global variable
var rData = new RowData(); 
var rdLog = new RowDataLog();
var rdLogArray = new LogRowingData();
var cData = new Constraints();
var gData = new Geoloc();

var geolocAccuracy = 50;
var dataItem = {};
dataItem["appVers"] = "0.5.5";
dataItem["Piece_Id"] = "initial";
dataItem["Session_Id"] = "initial";
dataItem["TP_Id"] = "initial";




/*
can be used to maximise screen use on dashboard
var testWidth = $(document).width();
var testHeight = $(document).height();
testWidth = 0.95*testWidth;
testHeight = 0.9*testHeight;
$("#bordertest").css('height',testHeight+'px');
$("#bordertest").css('width',testWidth+'px');
*/

/* current context data of selected piece
*@parm dataItem["TP_Name"]
*@parm dataItem["TP_Id"]
*@parm dataItem["Piece_Id"]
*@parm dataItem["Session_Id"]
*@parm dataItem["S_Name"]
*@parm dataItem["S_Date"]
*@parm dataItem["S_Description"]
*@parm dataItem["S_TrainingZone"]
*@parm dataItem["S_Time"]
*@parm dataItem["S_Mode"]
*@parm dataItem["S_ModeBName"]
*@parm dataItem["S_ModeBType"]
*@parm dataItem["emailUsr"]
*@parm dataItem["appVers"]
*@parm dataItem["paID"] 
*@parm dataItem["type"] type = PA PD PT PS ID IT TS RD DT RS
*@param dataItem["appVers"]
*@param dataItem["UsrType"]

*/
var statusItem = {};
/* used for controling dashboard setting local storage and txData
*@parm statusItem["pieceState"]
*@parm statusItem["keyID"]
*@param statusItem["keyToSend"]
*@parm statusItem["blockUUID"]
*@parm statusItem["syncComplete"]
*@parm statusItem["txEnabled"]
*@param statusItem["baseURL"]
*@param statusItem["onStartPage"]
*/
var setting = {};
var userId ={};
var altConstaint = null;
var intervalConstraint = null;
statusItem["baseURL_1"] = "http://rowsagetest.cloudapp.net:3000";
statusItem["baseURL_2"] = "http://rowcatchertest.cloudapp.net:3000";
statusItem["baseURL_ls"] = "192.168.1.100";
statusItem["baseURL_3"] = "http://"+statusItem["baseURL_ls"]+":3000";
statusItem["freqCollection_1"] = 1000;
statusItem["freqCollection_2"] = 2000;
statusItem["freqCollection_4"] = 4000;
statusItem["freqCollection_6"] = 6000;
statusItem["freqCollection_8"] = 8000;
statusItem["freqCollection_10"] = 10000;
statusItem["freqCollection"] = statusItem["freqCollection_4"];
statusItem["daysToKeep"] = 21;
statusItem["paddleTimeLimit"] = 3*60*60*1000;
statusItem["developer"] = false;
statusItem["txEnabled"] = true;
statusItem["pieceState"] = "READY";
statusItem["onStartPage"] = true;
statusItem["sendTimeout"] = 15000;
statusItem["pieceFinishedDataSend"]= false;
statusItem["updateSessionTimer"]= 5*60000;
statusItem["demoUser"] = false;
var saveToW = false;
var stateConnection1 = false;
// phone session create var
var TimeHours = $('#TimeHrs');
var TimeMins  = $('#TimeMins');
var TimeSecs  = $('#TimeSecs');
var TimeHrsInterval   = $("#TimeHrsInterval");
var TimeMinsInterval  = $('#TimeMinsInterval');
var TimeSecsInterval  = $('#TimeSecsInterval');
var RepeatTime        = $("#RepeatTime");
var TimeHrsRest       = $("#TimeHrsRest");
var TimeMinsRest      = $('#TimeMinsRest');
var TimeSecsRest      = $('#TimeSecsRest');
var DistHrsRest   = $("#DistHrsRest");
var DistMinsRest  = $('#DistMinsRest');
var DistSecsRest  = $('#DistSecsRest');
var DisInterval    = $("#DisInterval");
var DisRepeat      = $("#DisRepeat");
var StrokeInterval = $("#StrokeInterval");
var StrokeRepeat   = $("#StrokeRepeat");
var StrokeRest     = $("#StrokeRest");
var DistanceM = $('#DisM');
var TgtHR     = $('#HrTgt');
var TgtStk    = $('#SrtTgt');
// initialise values for phone sessions
function setInitialPieceValues(){
	TgtHR.val(100);
	TgtStk.val(90);
	DistanceM.val(1000);
	DisInterval.val(2000);
	TimeHours.val(0);
	TimeMins.val(5);
	TimeSecs.val(0);
	TimeHrsInterval.val(0);
	TimeMinsInterval.val(4);
	TimeSecsInterval.val(0);
	RepeatTime.val(2);
	TimeHrsRest.val(0);
	TimeMinsRest.val(1);
	TimeSecsRest.val(0);
	DistHrsRest.val(0);
	DistMinsRest.val(1);
	DistSecsRest.val(0);
	DisInterval.val(1000);
	DisRepeat.val(2);
	StrokeInterval.val(20);
	StrokeRepeat.val(2);
	StrokeRest.val(10);
	
}
setInitialPieceValues();

function setDemoPieceValues(){
	TgtHR.val(100);
	TgtStk.val(90);
	TimeHours.val(0);
	TimeMins.val(1);
	TimeSecs.val(25);
	DistanceM.val(390);
	DisInterval.val(150);
	TimeHrsInterval.val(0);
	TimeMinsInterval.val(4);
	TimeSecsInterval.val(0);
	RepeatTime.val(2);
	TimeHrsRest.val(0);
	TimeMinsRest.val(1);
	TimeSecsRest.val(0);
	DistHrsRest.val(0);
	DistMinsRest.val(0);
	DistSecsRest.val(30);
	DisRepeat.val(2);
	StrokeInterval.val(15);
	StrokeRepeat.val(2);
	StrokeRest.val(9);
	
}

var hoursTimedPiece,minsTimedPiece,secsTimedPiece;
var hoursIntervalPiece,minsIntervalPiece,secsIntervalPiece,repeatTime;
var hoursRestPiece,minsRestPiece,secsRestPiece;
var hoursDistPiece,minsDistPiece,secsDistPiece,distRest;
var hrTarget,stkTarget;
var distInterval;
var strokeInterval,strokeRepeat,strokeRest;
var developer=true;
var silentmode = true;

function setPhoneSessionValues() {
	hoursTimedPiece = TimeHours.val();
	minsTimedPiece = TimeMins.val();
	secsTimedPiece = TimeSecs.val();
	
	hoursIntervalPiece = TimeHrsInterval.val();
	minsIntervalPiece  = TimeMinsInterval.val();
	secsIntervalPiece  = TimeSecsInterval.val();
	repeatTime         = RepeatTime.val();
	
	hoursRestPiece = TimeHrsRest.val();
	minsRestPiece  = TimeMinsRest.val();
	secsRestPiece  = TimeSecsRest.val();
	
	hoursDistPiece = DistHrsRest.val();
	minsDistPiece  = DistMinsRest.val();
	secsDistPiece  = DistSecsRest.val();
	distRest       = DisRepeat.val();
	distInterval   = DisInterval.val();
	
	strokeInterval = StrokeInterval.val();
	strokeRepeat   = StrokeRepeat.val();
	strokeRest     = StrokeRest.val();
	
	pieceDistanceSelected =  DistanceM.val();
	
	hrTarget  = TgtHR.val();
	stkTarget = TgtStk.val();
}
setPhoneSessionValues();

var ref;
if(silentmode == true){
	$("#flipswitchBeep").slider();
	$("#flipswitchBeep").val('true').slider("refresh");
}else{
	$("#flipswitchBeep").slider();
	$("#flipswitchBeep").val('false').slider("refresh");
}
silentmode = $("#flipswitchBeep").val();

$(document).ready(function() {	
	var userLastLogged = $.jStorage.get("lst");
	if(userLastLogged){
		if(typeof userLastLogged.email !="undefined"){
			$('#emailUser').val(userLastLogged.email);
		}
	}else{
		$('#emailUser').val("");
	}
	$("#versionno").text("App Version  :\t\t"+dataItem["appVers"]);
	//$("#mySession").fixedtoolbar({ fullscreen: true });
	$("#bluetoothpage").on("click", function(){
	var platformType = device.platform;
	if(platformType != "Win32NT"){
		$.mobile.changePage( "#regBluetooth",{
			transition: "none",
			reverse: true,
			changeHash: true
		});
	}else{
		$.mobile.showPageLoadingMsg("b","HeartRate Belt not Supported ...",true);
		setTimeout(function(){
			$.mobile.hidePageLoadingMsg();
		},1000);
	}
});
$("#goToSettings").on("click", function(){
	$.mobile.changePage( "#settings",{
		transition: "none",
		reverse: true,
		changeHash: true
	});
});

$("#checkStorage").on("click", function() {
	var storage = $.jStorage.storageSize();
	$("#storagevalue").text(storage+ "bytes used");
	var platformName = device.platform;
	
	if(platformName == "iOS"){
		// local storage on iphone 2500 kb
		storage = (storage/2500000)*100;
		
	}else{
		//local storage android 5100 k wp8 4864 
		storage = (storage/5000000)*100;
	}
	
	$("#storageUsed").progressbar({
		value:storage
	});
	setTimeout( function () {
		$("#storagevalue").text("");
	},2000);
});
$("#flipswitch").on("change",function(){
	var d =$("#flipswitch").val();
	if(d == "true"){
		$(".developer").show();
	}else{
		$(".developer").hide();
	}
});

function checkInitialSettings() {
	setting = $.jStorage.get("setingKey");
	if(!setting){
		setting = {};
		setting.Server =  statusItem["baseURL_1"];
		setting.IP = statusItem["baseURL_ls"];
		$("#HostIP").val(setting.IP);
		var proportionOfIdealAcceptableAsFitness = 0.3;
		setting.proportionOfIdealAcceptableAsFitness = proportionOfIdealAcceptableAsFitness ;
		setting.Freq = statusItem["freqCollection_4"];
		$.jStorage.set("setingKey",setting);
		setServer();
		resetFreqCollectionCBoxs();
		setFreqCollection();
		initialServer(1);
		$("#settings").page();
		$("#accelSetting1").slider().val(setting.proportionOfIdealAcceptableAsFitness);
		$("#accelSetting1").slider("refresh");
		
	}
}
checkInitialSettings();

//replaced with developer mode
function setServer() {
	setting = $.jStorage.get("setingKey");
	if(!setting.Server){
		setting.Server = statusItem["baseURL_1"];
		$.jStorage.set("setingKey",setting);
	}
	if(!setting.IP){
		setting.IP = statusItem["baseURL_ls"];
		$("#HostIP").val(setting.IP);
		$.jStorage.set("setingKey",setting);
	}
}
function initialServer(server){
	if(server==3){
		$("#server3").checkboxradio();
		$("#server3").prop("checked",true).checkboxradio('refresh');
		$("#server2").checkboxradio();
		$("#server2").prop("checked",false).checkboxradio('refresh');
		$("#server1").checkboxradio();
		$("#server1").prop("checked",false).checkboxradio('refresh');
		statusItem["baseURL"]=statusItem["baseURL_3"];
		
	}else if(server==2){
		$("#server3").checkboxradio();
		$("#server3").prop("checked",false).checkboxradio('refresh');
		$("#server2").checkboxradio();
		$("#server2").prop("checked",true).checkboxradio('refresh');
		$("#server1").checkboxradio();
		$("#server1").prop("checked",false).checkboxradio('refresh');
		statusItem["baseURL"]=statusItem["baseURL_2"];
	}else{
		$("#server3").checkboxradio();
		$("#server3").prop("checked",false).checkboxradio('refresh');
		$("#server2").checkboxradio();
		$("#server2").prop("checked",false).checkboxradio('refresh');
		$("#server1").checkboxradio();
		$("#server1").prop("checked",true).checkboxradio('refresh');
		statusItem["baseURL"]=statusItem["baseURL_1"];
	}
	statusItem["regURL"] = statusItem["baseURL"]+"/ShortRegister.html";
	statusItem["updateURL"] = statusItem["baseURL"]+"/EditProfile.html";
	statusItem["resultURL"] = statusItem["baseURL"]+"/PieceDetailChart.html";
	showServers();
}

//1 rowsagetest 2 rowcatcher2 3 localhost
initialServer(1);
statusItem["regURL"] = statusItem["baseURL"]+"/ShortRegister.html";
statusItem["updateURL"] = statusItem["baseURL"]+"/EditProfile.html";
statusItem["resultURL"] = statusItem["baseURL"]+"/PieceDetailChart.html";
function showServers(){
	// not for production
}

function setUpServer(sServer,sIP) {
	statusItem["baseURL"] = sServer;
	$("#settings").page();
	// set default on settings page
	if(sServer == statusItem["baseURL_1"]){
		$("#server1").prop("checked",true).checkboxradio('refresh');
	
	}else if(sServer == statusItem["baseURL_2"]){
		$("#server2").prop("checked",true).checkboxradio('refresh');
	
	}else {
		
		$("#server3").prop("checked",true).checkboxradio('refresh');
		$("#HostIP").val(sIP);
	}
}

//setServer();
function resetFreqCollectionCBoxs(){
	$("#settings").page();
	$("#time1").prop("checked",false).checkboxradio('refresh');
	$("#time2").prop("checked",false).checkboxradio('refresh');
	$("#time4").prop("checked",false).checkboxradio('refresh');
	$("#time6").prop("checked",false).checkboxradio('refresh');
	$("#time8").prop("checked",false).checkboxradio('refresh');
	$("#time10").prop("checked",false).checkboxradio('refresh');
}
function setUpFreqCollection(sFreq) {
	resetFreqCollectionCBoxs();
	statusItem["freqCollection"] = sFreq;
	$("#settings").page();
	if(sFreq == statusItem["freqCollection_1"]){
		statusItem["freqCollection"] = statusItem["freqCollection_1"];
		$("#time1").prop("checked",true).checkboxradio('refresh');
	
	}else if(sFreq == statusItem["freqCollection_2"]){
		statusItem["freqCollection"] = statusItem["freqCollection_2"];
		$("#time2").prop("checked",true).checkboxradio('refresh');
	
	}else if(sFreq == statusItem["freqCollection_4"]){
		statusItem["freqCollection"] = statusItem["freqCollection_4"];
		$("#time4").prop("checked",true).checkboxradio('refresh');
	
	}else if(sFreq == statusItem["freqCollection_6"]){
		statusItem["freqCollection"] = statusItem["freqCollection_6"];
		$("#time6").prop("checked",true).checkboxradio('refresh');
	
	}else if(sFreq == statusItem["freqCollection_8"]){
		statusItem["freqCollection"] = statusItem["freqCollection_8"];
		$("#time8").prop("checked",true).checkboxradio('refresh');
	
	}else if(sFreq == statusItem["freqCollection_10"]){
		statusItem["freqCollection"] = statusItem["freqCollection_10"];
		$("#time10").prop("checked",true).checkboxradio('refresh');
	
	}else {
		statusItem["freqCollection"] = statusItem["freqCollection_4"];
		$("#time10").prop("checked",true).checkboxradio('refresh');
	}
}

function setFreqCollection() {
	setting = $.jStorage.get("setingKey");
	if(setting.Freq != null){
		setUpFreqCollection(setting.Freq);
	}else{
		setting.Freq = statusItem["freqCollection_4"];
		$.jStorage.set("setingKey",setting);
		setting = $.jStorage.get("setingKey");
		setUpFreqCollection(setting.Freq);
	}
}

setFreqCollection();

//exit button hide for ios
$('#hideExit').hide();

	
// register page sets iframe attributes display and hide loading message
$('#iframeregister').show();

$("#inappbrowser").on("click", function(){
	//var url =statusItem["baseURL"]+"/ShortRegister.html";
	var url = "http://rowcatcher.com/EditProfile.html";
	ref = window.open(url, '_blank', 'location=yes');
	/*ref.addEventListener('loadstart', function(event) { alert('start: ' + event.url); });
	ref.addEventListener('loadstop', function(event) { alert('stop: ' + event.url); });
	ref.addEventListener('loaderror', function(event) { alert('error: ' + event.message); });
	ref.addEventListener('exit', function(event) { alert(event.type); });*/
	
});
$("#updateprofile").on("click", function(){
	var url =statusItem["baseURL"]+"/ShortRegister.html";
	ref = window.open(url, '_blank', 'location=yes');
	/*ref.addEventListener('loadstart', function(event) { alert('start: ' + event.url); });
	ref.addEventListener('loadstop', function(event) { alert('stop: ' + event.url); });
	ref.addEventListener('loaderror', function(event) { alert('error: ' + event.message); });
	ref.addEventListener('exit', function(event) { alert(event.type); });*/
	
});

$('#iframeupdatemsg').show();
$(document).delegate('#updatepage','pageshow', function() {
	$.mobile.showPageLoadingMsg("b","Loading ...");
	$.mobile.loadPage("#updatepage",{prefetch:"true"});
	$("#iframeupdate").attr('src',statusItem["updateURL"]).attr('height','500px').attr('width','100%');
});

//$('#iframeresult').show();
$(document).delegate('#resultwebpage','pageshow', function() {
	$.mobile.showPageLoadingMsg("b","Loading ...");
	$("#webresult").attr('src',statusItem["resultURL"]).attr('height','590px').attr('width','95%');
});





$(document).delegate('#resultwebpage','pagehide', function() {
	//$('#iframeresult').show();
});
$(document).delegate('#startpage','pageshow', function() {
	statusItem["onStartPage"] = true;
	statusItem["demoUser"] = false;
	setInitialPieceValues();
	setPhoneSessionValues();
	
});
$(document).delegate('#startpage','pagehide', function() {
	statusItem["onStartPage"] = false;
	
});
$('#iframereg').load(function(){
	$('#iframeregister').hide();
	$.mobile.hidePageLoadingMsg();
});
$('#iframeupdate').load(function(){
	$('#iframeupdatemsg').hide();
	$.mobile.hidePageLoadingMsg();
});
$('#webresult').load(function(){
	$.mobile.hidePageLoadingMsg();
});
/*$('#democonstraints').on("click",function(){
	setDemoPieceValues();
	setPhoneSessionValues();
});*/


$(document).delegate('#settings','pageshow', function() {
	setServer();
});
$(document).delegate('#results','pageshow', function() {
	if(dataItem["UsrType"] == "Reg"){
		txData.displayLocalStorage();
		//var userIdKey ="userid"+rData.getUserEM();
		//userId = $.jStorage.get(userIdKey);
	}else{
		$('#storageList').children().remove();
		if(navigator.notification){
			navigator.notification.alert(
				'To see Results you will need to register\n',
				alertDismissed,
				'Notice',
				'Ok'
			);
		}else{
			alert("To see Results you will need to register");
		}
	}
});
$(document).delegate('#mySession','pageshow', function() {
	
	var responseSend = dataStillToSend();
	var ConnectionState = txData.connectionState();
	if(responseSend && ConnectionState){
		if(dataItem["UsrType"] != "UnReg"){
			if(navigator.notification){
				navigator.notification.confirm(
					'You have data to send to web \n(Data Older than 7 days will be Deleted from the Phone)',
					onConfirm,
					'Sync to WEB ?',
					['Later','Send Now']
				);
			}else{
				var ans = confirm("Send Data Now");
				if(ans){
					onConfirm(2);
				}else{
					onConfirm(1);
				}
					
			}
			
		}
	}
	txData.deleteOldEntries();
});

function dataStillToSend () {
	var responseSend = false;
	var responseCheck = txData.checkForStatus();
	for (var i=0; i<responseCheck.length; i++) {
		if(responseCheck[i].Save == true) {
			responseSend = false;
		}else {
			responseSend = true;
			break;
		}
	}
	return responseSend;
}
function onConfirm(buttonIndex) {
	if(buttonIndex==2){
		var connectionState = txData.connectionState();
		if(connectionState){
			if(navigator.notification){
				navigator.notification.alert(
					'Sending Data',
					alertDismissed,
					'Notice',
					'Ok'
				);
			}else{
				alert("Sending Data");
			}
			txData.syncToWeb();
		}else {
			if(navigator.notification){
				navigator.notification.alert(
					'You Are OffLine Try Again Later...',
					alertDismissed,
					'Notice',
					'Ok'
				);
			}else{
				alert('You Are OffLine Try Again Later...');
			}
		}
	}
}

$('input:radio[name=server]').click(function() {
	var value = $(this).val();
	if (value == "server1"){
		statusItem["baseURL"] = statusItem["baseURL_1"];
	}else if (value == "server2") {
		statusItem["baseURL"] = statusItem["baseURL_2"];
	}else if (value =="server3") {
		var hostip = $("#HostIP").val();
		if(hostip){
			statusItem["baseURL_ls"] = $("#HostIP").val();
		}
		statusItem["baseURL"] = "http://"+statusItem["baseURL_ls"]+":3000";
	}
	// change url for shortregister and piece detail chart to match server selected
	statusItem["regURL"] = statusItem["baseURL"]+"/ShortRegister.html";
	statusItem["updateURL"] = statusItem["baseURL"]+"/EditProfile.html";
	statusItem["resultURL"] = statusItem["baseURL"]+"/PieceDetailChart.html";
	setting.Server = statusItem["baseURL"];
	setting.IP = statusItem["baseURL_ls"];
	$.jStorage.set("setingKey",setting);
	
});
$("#restart").on("click", function() {
	setting.Server = statusItem["baseURL"];	
	setting.IP = statusItem["baseURL_ls"];
	$.jStorage.set("setingKey",setting);
});
$("#flipswitchBeep").on("change", function(){
	silentmode =$("#flipswitchBeep").val();
});

$('input:radio[name=freqDataCollect]').click(function() {
	var value = $(this).val();
	if (value == "time1"){
		statusItem["freqCollection"] = statusItem["freqCollection_1"]
	}else if (value == "time2") {
		statusItem["freqCollection"] = statusItem["freqCollection_2"]
	}else if (value =="time4") {
		statusItem["freqCollection"] = statusItem["freqCollection_4"]
	}else if (value == "time6") {
		statusItem["freqCollection"] = statusItem["freqCollection_6"]
	}else if (value =="time8") {
		statusItem["freqCollection"] = statusItem["freqCollection_8"]
	}else if (value == "time10") {
		statusItem["freqCollection"] = statusItem["freqCollection_10"]
	}
	setting.Freq = statusItem["freqCollection"];
	$.jStorage.set("setingKey",setting);
	setFreqCollection();
});

$('input:radio[name=BsaveToWeb]').click(function() {
	var value = $(this).val();
	if (value == "yes"){
		saveToW = true;
	}else if (value == "no") {
		saveToW = false;
	}
});

$('.closeDialog').on("touchstart click", function(e){
	e.stopPropagation();
	e.preventDefault();
	$('.ui-dialog').dialog('close');
});
// phone sessions time piece
$("#HrsUp").on("click", function() {
	setPhoneSessionValues();
	if(hoursTimedPiece<0){
		hoursTimedPiece = 0;
	}else{
		hoursTimedPiece++;
		TimeHours.val(hoursTimedPiece);
		
	}
	
});
$("#HrsDwn").on("click", function() {
	setPhoneSessionValues();
	if(hoursTimedPiece ==0){
		hoursTimedPiece = 0;
	}else{
		hoursTimedPiece--;
		TimeHours.val(hoursTimedPiece);
	}
	
});
$("#MinsUp").on("click", function() {
	setPhoneSessionValues();
	if(minsTimedPiece >= 59){
		hoursTimedPiece++;
		TimeHours.val(hoursTimedPiece);
		minsTimedPiece = 0;
		TimeMins.val(minsTimedPiece);
	}else{
		minsTimedPiece++;
		TimeMins.val(minsTimedPiece);
	}
	
});
$("#MinsDwn").on("click", function() {
	setPhoneSessionValues();
	if(minsTimedPiece == 0 ){
		if(hoursTimedPiece !=0){
			hoursTimedPiece--;
			TimeHours.val(hoursTimedPiece);
		}
		minsTimedPiece = 59;
		TimeMins.val(minsTimedPiece);
	}else{
		minsTimedPiece--;
		TimeMins.val(minsTimedPiece);
		
	}
	
});
$("#SecsUp").on("click", function() {
	setPhoneSessionValues();
	
	if(secsTimedPiece >= 59){
		if(minsTimedPiece >= 59) {
			hoursTimedPiece++;
			TimeHours.val(hoursTimedPiece);
			minsTimedPiece = 0;
			TimeMins.val(minsTimedPiece);
			secsTimedPiece = 0;
			TimeSecs.val(secsTimedPiece);
			
		}else{
			minsTimedPiece++;
			TimeMins.val(minsTimedPiece);
			secsTimedPiece = 0;
			TimeSecs.val(secsTimedPiece);
		}
	}else{
		secsTimedPiece++;
		TimeSecs.val(secsTimedPiece);
	}
	
});
$("#SecsDwn").on("click", function() {
	setPhoneSessionValues();
	if(secsTimedPiece ==0){
		if(minsTimedPiece ==0){
			if(hoursTimedPiece >=1){
				hoursTimedPiece--;
				TimeHours.val(hoursTimedPiece);
			}else{
				hoursTimedPiece= 0;
				TimeHours.val(hoursTimedPiece);
			}
			minsTimedPiece = 59;
			TimeMins.val(minsTimedPiece);
			secsTimedPiece = 59;
			TimeSecs.val(secsTimedPiece);
		}else{
			minsTimedPiece--;
			TimeMins.val(minsTimedPiece);
			secsTimedPiece = 59;
			TimeSecs.val(secsTimedPiece);
		}
	}else{
		secsTimedPiece--;
		TimeSecs.val(secsTimedPiece);
		
	}
	
	
});
// phone sessions interval
	
$("#HrsUpInterval").on("click", function() {
	setPhoneSessionValues();
	if(hoursIntervalPiece<0){
		hoursIntervalPiece = 0;
		TimeHrsInterval.val(hoursIntervalPiece);
	}else{
		hoursIntervalPiece++;
		TimeHrsInterval.val(hoursIntervalPiece);
	}
	
});
$("#HrsDwnInterval").on("click", function() {
	setPhoneSessionValues();
	if(hoursIntervalPiece ==0){
		hoursIntervalPiece = 0;
		TimeHrsInterval.val(hoursIntervalPiece);
	}else{
		hoursIntervalPiece--;
		TimeHrsInterval.val(hoursIntervalPiece);
	}
	
});
$("#MinsUpInterval").on("click", function() {
	setPhoneSessionValues();
	
	if(minsIntervalPiece >= 59){
		hoursIntervalPiece++;
		TimeHrsInterval.val(hoursIntervalPiece);
		minsIntervalPiece = 0;
		TimeMinsInterval.val(minsIntervalPiece);
	}else{
		minsIntervalPiece++;
		TimeMinsInterval.val(minsIntervalPiece);
	}
	
});
$("#MinsDwnInterval").on("click", function() {
	setPhoneSessionValues();
	if(minsIntervalPiece ==0){
		if(hoursIntervalPiece !=0){
			hoursIntervalPiece--;
			TimeHrsInterval.val(hoursIntervalPiece);
		}
		minsIntervalPiece = 59;
		TimeMinsInterval.val(minsIntervalPiece);
	}else{
		minsIntervalPiece--;
		TimeMinsInterval.val(minsIntervalPiece);
		
	}
	
});
$("#SecsUpInterval").on("click", function() {
	setPhoneSessionValues();
	if(secsIntervalPiece >= 59){
		if(minsIntervalPiece >= 59) {
			hoursIntervalPiece++;
			TimeHrsInterval.val(hoursIntervalPiece);
			minsIntervalPiece = 0;
			TimeMinsInterval.val(minsIntervalPiece);
			secsIntervalPiece = 0;
			TimeSecsInterval.val(secsIntervalPiece);
			
		}else{
			minsIntervalPiece++;
			TimeMinsInterval.val(minsIntervalPiece);
			secsIntervalPiece = 0;
			TimeSecsInterval.val(secsIntervalPiece);
		}
	}else{
		secsIntervalPiece++;
		TimeSecsInterval.val(secsIntervalPiece);
	}
	
});
$("#SecsDwnInterval").on("click", function() {
	setPhoneSessionValues();
	if(secsIntervalPiece ==0){
		if(minsIntervalPiece ==0){
			if(hoursIntervalPiece >=1){
				hoursIntervalPiece--;
				TimeHrsInterval.val(hoursIntervalPiece);
			}else{
				hoursIntervalPiece= 0;
				TimeHrsInterval.val(hoursIntervalPiece);
			}
			minsIntervalPiece = 59;
			TimeMinsInterval.val(minsIntervalPiece);
			secsIntervalPiece = 59;
			TimeSecsInterval.val(secsIntervalPiece);
		}else{
			minsIntervalPiece--;
			TimeMinsInterval.val(minsIntervalPiece);
			secsIntervalPiece = 59;
			TimeSecsInterval.val(secsIntervalPiece);
		}
	}else{
		secsIntervalPiece--;
		TimeSecsInterval.val(secsIntervalPiece);
		
	}
	
	
});
//time interval rest
	

$("#HrsUpRest").on("click", function() {
	setPhoneSessionValues();
	if(hoursRestPiece<0){
		hoursRestPiece = 0;
	}else{
		hoursRestPiece++;
		TimeHrsRest.val(hoursRestPiece);
	}
});
$("#HrsDwnRest").on("click", function() {
	setPhoneSessionValues();
	
	if(hoursRestPiece <=0){
		hoursRestPiece = 0;
	}else{
		hoursRestPiece--;
		TimeHrsRest.val(hoursRestPiece);
	}
});
$("#MinsUpRest").on("click", function() {
	setPhoneSessionValues();
	if(minsRestPiece >= 59){
		hoursRestPiece++;
		TimeHrsRest.val(hoursRestPiece);
		minsRestPiece = 0;
		TimeMinsRest.val(minsRestPiece);
	}else{
		minsRestPiece++;
		TimeMinsRest.val(minsRestPiece);
	}
});
$("#MinsDwnRest").on("click", function() {
	setPhoneSessionValues();
	if(minsRestPiece ==0){
		if(hoursRestPiece !=0){
			hoursRestPiece--;
			TimeHrsRest.val(hoursRestPiece);
		}
		minsRestPiece = 59;
		TimeMinsRest.val(minsRestPiece);
	}else{
		minsRestPiece--;
		TimeMinsRest.val(minsRestPiece);
	}
});
$("#SecsUpRest").on("click", function() {
	setPhoneSessionValues();
	if(secsRestPiece >= 59){
		if(minsRestPiece >= 59) {
			hoursRestPiece++;
			TimeHrsRest.val(hoursRestPiece);
			minsRestPiece = 0;
			TimeMinsRest.val(minsRestPiece);
			secsRestPiece = 0;
			TimeSecsRest.val(secsRestPiece);
			
		}else{
			minsRestPiece++;
			TimeMinsRest.val(minsRestPiece);
			secsRestPiece = 0;
			TimeSecsRest.val(secsRestPiece);
		}
	}else{
		secsRestPiece++;
		TimeSecsRest.val(secsRestPiece);
	}
	
});
$("#SecsDwnRest").on("click", function() {
	setPhoneSessionValues();
	if(secsRestPiece ==0){
		if(minsRestPiece ==0){
			if(hoursRestPiece >=1){
				hoursRestPiece--;
				TimeHrsRest.val(hoursRestPiece);
			}else{
				hoursRestPiece= 0;
				TimeHrsRest.val(hoursRestPiece);
			}
			minsRestPiece = 59;
			TimeMinsRest.val(minsRestPiece);
			secsRestPiece = 59;
			TimeSecsRest.val(secsRestPiece);
		}else{
			minsRestPiece--;
			TimeMinsRest.val(minsRestPiece);
			secsRestPiece = 59;
			TimeSecsRest.val(secsRestPiece);
		}
	}else{
		secsRestPiece--;
		TimeSecsRest.val(secsRestPiece);
		
	}

});
// phone session dist interval

$("#HrsUpDistRest").on("click", function() {
	
	
	setPhoneSessionValues();
	if(hoursDistPiece<0){
		hoursDistPiece = 0;
		DistHrsRest.val(hoursDistPiece);
	}else{
		hoursDistPiece++;
		DistHrsRest.val(hoursDistPiece);
	}
	
});
$("#HrsDwnDistRest").on("click", function() {
	if(hoursDistPiece ==0){
		hoursDistPiece = 0;
		DistHrsRest.val(hoursDistPiece);
	}else{
		hoursDistPiece--;
		DistHrsRest.val(hoursDistPiece);
	}
	
});
$("#MinsUpDistRest").on("click", function() {
	setPhoneSessionValues();
	if(minsDistPiece >= 59){
		hoursDistPiece++;
		DistHrsRest.val(hoursDistPiece);
		minsDistPiece = 0;
		DistMinsRest.val(minsDistPiece);
	}else{
		minsDistPiece++;
		DistMinsRest.val(minsDistPiece);
	}
	
});
$("#MinsDwnDistRest").on("click", function() {
	setPhoneSessionValues();
	if(minsDistPiece ==0){
		if(hoursDistPiece !=0){
			hoursDistPiece--;
			DistHrsRest.val(hoursDistPiece);
		}
		minsDistPiece = 59;
		DistMinsRest.val(minsDistPiece);
	}else{
		minsDistPiece--;
		DistMinsRest.val(minsDistPiece);
	}
});
$("#SecsUpDistRest").on("click", function() {
	
	setPhoneSessionValues();
	if(secsDistPiece >= 59){
		if(minsDistPiece >= 59) {
			hoursDistPiece++;
			DistHrsRest.val(hoursDistPiece);
			minsDistPiece = 0;
			DistMinsRest.val(minsDistPiece);
			secsDistPiece = 0;
			DistSecsRest.val(secsDistPiece);
			
		}else{
			minsDistPiece++;
			DistMinsRest.val(minsDistPiece);
			secsDistPiece = 0;
			DistSecsRest.val(secsDistPiece);
		}
	}else{
		secsDistPiece++;
		DistSecsRest.val(secsDistPiece);
	}

	
});
$("#SecsDwnDistRest").on("click", function() {
	hoursDistPiece = DistHrsRest.val();
	minsDistPiece  = DistMinsRest.val();
	secsDistPiece = DistSecsRest.val();
	setPhoneSessionValues();
	if(secsDistPiece ==0){
		if(minsDistPiece ==0){
			if(hoursDistPiece >=1){
				hoursDistPiece--;
				DistHrsRest.val(hoursDistPiece);
			}else{
				hoursDistPiece= 0;
				DistHrsRest.val(hoursDistPiece);
			}
			minsDistPiece = 59;
			DistMinsRest.val(minsDistPiece);
			secsDistPiece = 59;
			DistSecsRest.val(secsDistPiece);
		}else{
			minsDistPiece--;
			DistMinsRest.val(minsDistPiece);
			secsDistPiece = 59;
			DistSecsRest.val(secsDistPiece);
		}
	}else{
		secsDistPiece--;
		DistSecsRest.val(secsDistPiece);
		
	}
});
function checkForNegative(data,minValue){
	if(data <minValue){
		data = minValue;
	}
	return data;
}
// end phone session create
$("#TimeCreatePiece").on("click", function(){
	$("#createPieces").children().trigger("collapse");
});
$("#DistCreatePiece").on("click", function(){
	$("#createPieces").children().trigger("collapse");
});
$("#TimeICreatePiece").on("click", function(){
	$("#createPieces").children().trigger("collapse");
});
$("#DistICreatePiece").on("click", function(){
	$("#createPieces").children().trigger("collapse");
});
$("#StrokeICreatePiece").on("click", function(){
	$("#createPieces").children().trigger("collapse");
});

$("#RepeatTime").on("change",function(){
	repeatTime= RepeatTime.val();
	var displayData = checkForNegative(repeatTime,1);
	RepeatTime.val(displayData);
});

$("#DisInterval").on("change",function(){
	distInterval= DisInterval.val();
	var displayData = checkForNegative(distInterval,1);
	DisInterval.val(displayData);
});
$("#DisRepeat").on("change",function(){
	distRest = DisRepeat.val();
	var displayData = checkForNegative(distRest,1);
	DisRepeat.val(displayData);
	distRest = DisRepeat.val();
	
});

$("#StrokeInterval").on("change",function(){
	strokeInterval = StrokeInterval.val();
	var displayData = checkForNegative(strokeInterval,5);
	StrokeInterval.val(displayData);
	strokeInterval = StrokeInterval.val();
	
});
$("#StrokeRepeat").on("change",function(){
	strokeRepeat = StrokeRepeat.val();
	var displayData = checkForNegative(strokeRepeat,1);
	StrokeRepeat.val(displayData);
	strokeRepeat = StrokeRepeat.val();
	
});
$("#StrokeRest").on("change",function(){
	strokeRest = StrokeRest.val();
	var displayData = checkForNegative(strokeRest,5);
	StrokeRest.val(displayData);
	strokeRest = StrokeRest.val();
	
});


$("#Targetdata").on("click", function(){
	hrTarget  = TgtHR.val();
	stkTarget = TgtStk.val();
	$("#pieceTargets").children().trigger("collapse");
});
$('#HrTgt').on("change", function() {
	hrTarget  = TgtHR.val();
	var displayData = checkForNegative(hrTarget,0);
	TgtHR.val(displayData);
	hrTarget  = TgtHR.val();
	
});
$('#SrtTgt').on("change", function() {
	stkTarget = TgtStk.val();
	var displayData = checkForNegative(stkTarget,1);
	TgtStk.val(displayData);
	stkTarget = TgtStk.val();
	
});
$('#DisM').on("change", function() {
	pieceDistanceSelected = DistanceM.val();
	var displayData = checkForNegative(pieceDistanceSelected,0);
	DistanceM.val(displayData);
	pieceDistanceSelected = DistanceM.val();
});
	// end phone piece
	
// erase local storage
$("#eraseStorage").on("click", function() {
	
	if(typeof prompt != "undefined"){
		var eraseData = prompt("Enter Password");
		if(eraseData == "flush"){
			var eraseconfirm = confirm("Erase All Data  ?");
			
		}else{
			if(navigator.notification){
				navigator.notification.alert(
					'Incorrect Password',
					alertDismissed,
					'Notice',
					'Ok'
				);
			}else{
				alert("Sorry Incorrect Password");
			}
		}
		
		if(eraseconfirm){
			$.jStorage.flush();
			checkInitialSettings();
		}
	}else{
		var answer = confirm("Are You Sure ?");
		
		if(answer){
			$.jStorage.flush();
			checkInitialSettings();
		}
	}
});
	function alertDismissed(){
		//tbd
	}

});//document ready


(function($){
	var intervalContraintTimer = 10000;
	
	
	$(document).delegate('#dashboard','pageshow', function() {
		$('#quotap').text("");
		$('#quotad').text("");
		// refrest network state display
		txData.connectionState();
		
		// use insomnia plugin to keep windows phone awake while on dashboard
		if(typeof device != "undefined"){
			var platformName = device.platform;
			window.plugins.insomnia.keepAwake();
		}
								
		intervalConstraint = setInterval(function(){
			var dataNow = {};
			var rT = cData.getPieceType();
			if((rT==0)||(rT==1)||(rT==2)){
				dataNow.time = rData.getPieceTimeTotal()/1000;
				dataNow.meters = rData.getPieceDistanceTotal();
				dataNow.strokes = rData.getPieceStrokeCountTotal();
			}else{
				dataNow.time =  rData.getIntervalTimeTotal()/1000;
				dataNow.meters = rData.getIntervalDistanceTotal();
				dataNow.strokes =rData.getIntervalStrokeCountTotal();
			}

			cData.setDataNow(dataNow);
			
			var atlConst = cData.getAtlConstraint();
			if(atlConst){
				var rD = cData.isDailyLimitReached(atlConst);
				var rP = cData.isPieceLimitReached(atlConst);
				var peiceDId;
				if(rP){
					if((rT==0)||(rT==1)||(rT==2)){
						rData.setGuiEvent( "PEND");
					}else{
						rData.setGuiEvent( "IEND");
					}

					peiceDId =cData.getPieceDiveq();
					statusItem["pieceState"] = "STOP";
					dataItem["paID"]=0;
					rData.setPAID(dataItem["paID"]);
					doCancel(peiceDId);
					
					clearInterval(intervalConstraint);
					$('#quotamsg').text("");
					$('#popupquota').popup();
					$('#popupquota').popup('open');
					
				}else if(rD){
					$("#proceedquota").hide();
					if((rT==0)||(rT==1)||(rT==2)){
						rData.setGuiEvent( "PEND");
					}else{
						rData.setGuiEvent( "IEND");
					}
					
					peiceDId =cData.getPieceDiveq();
					statusItem["pieceState"] = "STOP";
					dataItem["paID"]=0;
					rData.setPAID(dataItem["paID"]);
					
					doCancel(peiceDId);
					
					clearInterval(intervalConstraint);
					$('#quotamsg').text("");
					$('#popupquota').popup();
					$('#popupquota').popup('open');
				}
				
			}
		},intervalContraintTimer);
	});
	$(document).delegate('#dashboard','pagehide', function() {
        clearInterval(intervalConstraint);
		
		if(window.plugins){
			window.plugins.insomnia.allowSleepAgain();
		}
		/*
		var platformName = device.platform;
		if((platformName =="Win32NT")||(platformName=="WinCE")){
			window.plugins.insomnia.allowSleepAgain();
			
		}else if(platformName == "iOS"){
			window.plugins.insomnia.allowSleepAgain();
		}*/
	});
	$(document).delegate('#controlPage','pageshow', function() {
		if(window.plugins){
			window.plugins.insomnia.keepAwake();
		}
	});
	$(document).delegate('#controlPage','pagehide', function() {
		// use insomnia plugin return screen lock control
		if(window.plugins){
			window.plugins.insomnia.allowSleepAgain();
		}
	});
//self invoking functions keep variable local to gui.js
// refreshRate can be used to globally control timer values
	function alertDismissed(){
		
	}
	function pieceQuota(data){
	}
	function dailyQuota(data){
	}
	
	function setDemoPieceConditions(){
		
	}
	function resetPieceConditions(){
	}
	$('#democonstraints').on("click",function(){
		cData.checkSameDay();
		//rData.setUserID(0);
		var html = cData.getDemoHtml();
		$("#constraintmsg").html(html);
		$("#demouser").show();
		$("#subscribeduser").hide();
		var demoConstraint = cData.getDefaultQuota();
		cData.setAtlConstraint(demoConstraint);
		
		$('#session_div').empty();
		$('#controlBtns').empty();
		statusItem["demoUser"] = true;
		var newData = phonePiece();
		showSessionData(newData);	
		
	});
	$('#resetconstraints').on("click",function(){
		resetConstraints();
		
		$.mobile.changePage( "#startpage",{
			transition: "slideup",
			reverse: true,
			changeHash: true
		});
		
	});
	function resetConstraints(){
		$.jStorage.deleteKey("constraint");
		cData.setNewBalance();
	}
	$("#goDashBoard").on("click",function() {
		$.mobile.changePage( "#dashboard",{
			transition: "slideup",
			reverse: true,
			changeHash: true
		});
		doReady();
	});
	$("#LimitedFunctionality").on("click", function() {
		dataItem["emailUsr"] = "UnRegistered";
		dataItem["UsrType"] = "UnReg";
		rData.setUserEM(dataItem["emailUsr"]);
		rData.setUserID(0);	
	});
		
	function setDeveloperOption(devMode){
		if(devMode){
			$(".developer").hide();
			$("#flipswitch").slider();
			$("#flipswitch").val('off').slider("refresh");
			$("#developerdisplay").show()
		}else{
			$(".developer").hide();
			$("#developerdisplay").hide();
		}
	}
	
	function phonePiece() {
		var d = new Date();
		var y  = d.getFullYear(),
			m  = d.getUTCMonth()+1,
			dy = +d.getDate();
		var	hoursNow = d.getHours(),
			minsNow = d.getMinutes(),
			secNow = d.getSeconds();
		var timeNow = convertToMilliSec(hoursNow,minsNow,secNow);
		var displyToday = y +"-"+m+"-"+dy;

		var dataCreatePiece = {};
		dataCreatePiece["_id"]="Phone";
		dataCreatePiece["RegisterID"]="initial";
		dataCreatePiece["TP_Name"]="Phone Favorites";
		dataCreatePiece["TP_Description"]="";
		dataCreatePiece["TP_AssignUsers"]="user assigned number";
		dataCreatePiece["Session_ID"]="12345";
		dataCreatePiece["S_Name"]="Favorites";
		dataCreatePiece["S_Description"]="";
		dataCreatePiece["S_Time"]=timeNow;
		dataCreatePiece["S_TotalDuration"]="";
		dataCreatePiece["S_Mode"]="";
		dataCreatePiece["S_TrainingZone"]="";
		dataCreatePiece["S_ModeBName"]="";
		dataCreatePiece["S_ModeBType"]="";
		
		var newData = {
				"_id"		: dataCreatePiece["_id"],
				"RegisterID": dataCreatePiece["RegisterID"],
				"TP_Name"	: dataCreatePiece["TP_Name"],
				"TP_Description":dataCreatePiece["TP_Description"],
				"TP_AssignUsers": [
					dataCreatePiece["TP_AssignUsers"]
				],
				"PlannedSession":[
					{
						"Session_ID": dataCreatePiece["Session_ID"],
						"S_Name": "Favorites",
						"S_Description": "",
						"S_Date": displyToday,
						"S_Time": dataCreatePiece["S_Time"],
						"S_TotalDuration": dataCreatePiece["S_TotalDuration"],
						"S_Mode":dataCreatePiece["S_Mode"],
						"S_TrainingZone": dataCreatePiece["S_TrainingZone"],
						"S_ModeBName": dataCreatePiece["S_ModeBName"],
						"S_ModeBType": dataCreatePiece["S_ModeBType"],
						"Piece": setNewPiece()
					}
				]
			};
			
			var newArrayData = [];
			newArrayData.push(newData);
			return  newArrayData;
	}
	
	function setNewPiece () {
		var data = {};
		var Piece = [];
		var pieceTimeSelected = convertToMilliSec(hoursTimedPiece,minsTimedPiece,secsTimedPiece);
		var intervalTimeSelected = convertToMilliSec(hoursIntervalPiece,minsIntervalPiece,secsIntervalPiece);
		var intervalRestTimeSelected = convertToMilliSec(hoursRestPiece,minsRestPiece,secsRestPiece);
		var intervalRestDistanceSelected = convertToMilliSec(hoursDistPiece,minsDistPiece,secsDistPiece);
		//var pieceDistanceSelected = 
		var p1 = {
			"Session_ID":"User Defined",
			"_id": "123456",
			"PieceType": "TIME",
			"PieceTime": pieceTimeSelected,
			"HeartRate": hrTarget,
			"StrokeRate": stkTarget
		};
		Piece.push(p1);
		var dist = parseInt(pieceDistanceSelected);
		var p2 = {
			"Session_ID":"User Defined",
			"_id": "234567",
			"PieceType": "DISTANCE",
			"Distance": dist,
			"HeartRate": hrTarget,
			"StrokeRate": stkTarget
		};
		Piece.push(p2);
		
		var i1 = {
			"Session_ID":"User Defined",
			"_id": "234567",
			"PieceType": "INTERVAL SET",
            "IS_Interval": intervalTimeSelected,
            "IS_Rest": intervalRestTimeSelected,
            "IntervalType": "Time",
            "RestType": "Time",
            "IS_Repeat": repeatTime
		};
		Piece.push(i1);
		
		var i2 = {
			"Session_ID":"User Defined",
			"_id": "234567",
			"PieceType": "INTERVAL SET",
            "IS_Interval": distInterval,
            "IS_Rest": intervalRestDistanceSelected,
            "IntervalType": "Distance",
            "RestType": "Time",
            "IS_Repeat": distRest
			
		};
		Piece.push(i2);
		
		var i3 = {
			"Session_ID":"User Defined",
			"_id": "234567",
            "PieceType": "INTERVAL SET",
            "IS_Interval": strokeInterval,
            "IS_Rest": strokeRest,
            "IntervalType": "Stroke",
            "RestType": "Stroke",
            "IS_Repeat": strokeRepeat
		};
		Piece.push(i3);
		
		return Piece;
		
	}
	function convertToMilliSec(hr,mn,sc) {
		var answer;
		answer = hr*60*60*1000 + mn*60*1000 + sc*1000;
		return answer;
	}
	var refreshRate = 100, 
		pieceTypeInt = 0;
		
	var targetTime = 0,			//TIME	 target
		startTime = 0,			//single piece distance start time	
		intervalTime = 0,		// interval time target
		intervalRestTime = 0,	//interval rest time
		intervalDistance=0,
		intervalRestDistance=0,
		intervalSCount=0,
		intervalRestSCount=0,
		intervalRepeat=0,
		iType = "",	//Interval Set Type
		rType = "",	//Interval Set Rest Type
		intervalData = "",
		restData = "",	
		count = 0,
		distance = 0;

		var targetDistance = 100;
		var targetStroke = 10;

		var pieceDiveq=0;
		var l=0;
		
		var interval;
		
		// not needed  ??

	var Sc = 0,
		ScNow = 0,
		ScRest = 0,
		ScStart = 0,
		ScTarget = 0,
		ScType = false;


	// cache jquery for performane improvement
	var dTime = $('#time'),
		dDistance = $('#distanceTraveled'),
		dStrokeRate = $('#strokeRate'),
		dStrokeCount = $('#strokeCount'),
		dStroke = $('#stroke'),	//alt display interval stroke count
		dSplit =$('#split'),
		dHeartRate = $('#heartRate'),
		dSplitTime = $('#splitTarget'),
		dLocAccuracy=$('#locAccuracy');

	var stateRest = false,
		stateConnection = false ; // used to control dialog display during Rest period
	var timeElemVisable = $('#timeElement').is(':visible');

	$('#progressbar').progressbar({disabled:true});

	$('#intervalContainer').hide();
	$('#strokeElement').hide();

	$('#stopinterval').click(function(e){
		e.stopPropagation();
		e.preventDefault();
		clearInterval(interval);
	});
	
	document.addEventListener("deviceready",onDeviseReady,false);
	
	function onDeviseReady() {
		txData.connectionState();
		if(typeof device != "undefined"){
			var platformName = device.platform;
		if(platformName == "iOS"){
			$('#hideExit').hide();	
		}else{
			$('#hideExit').show();
		}
	
	}
		
		
		/*var platformType = device.platform;
		if(platformType != "Win32NT"){
			
			window.addEventListener("batterylow", batteryLow ,false);
		}*/
		//document.addEventListener("offline",onOffLine,false);
		//document.addEventListener("online",onOnLine,false);
	}
	
	/*function onOffLine() {
		stateConnection1=false;
	}
	function onOnLine() {
		stateConnection1=true;
	}*/
	function batteryLow(info) {
		//tbd cater for low battery
		//alert("Battery Low :");
	}
	$('#login').on('click',function (e){
		e.stopPropagation();
		e.preventDefault();
		logon();
		
	});
	$("#startapp").on("click",function(e){
		var username = $("#emailUser").val();
		var password = $("#passwordUser").val();
		e.stopPropagation();
		e.preventDefault();
		
		if(password != ""){
			logon();
		}else{
			if(navigator.notification){
				navigator.notification.confirm(
					'Do you wish to proceed Unregistered ?',
					onConfirmUnReg,
					'Notice',
					['Yes','No']
			);
			}else{
				var ans = confirm("Do You wish to proceed Unregistered");
				if(ans){
					onConfirmUnReg(1);
				}
			}
		}
		
		function onConfirmUnReg(btn){
			if(btn == 1){				
				setDemoPieceValues();
				setPhoneSessionValues();
				$.mobile.navigate( "#NotReg");
				
			}
		}
});
	//use keboard to logon
		$(document).keypress(function(e) {
			if((e.which ==13)&&(statusItem["onStartPage"]==true)) {
				logon ();
			}
		});
	
	function logon () {
		//$('#loading').show();
		$('#session_div').empty();
		$.mobile.showPageLoadingMsg("e","Please Wait Retrieving your Details \nAre you on-line...");
		cData.checkSameDay();
		var html = cData.getSubscriptionHtml();
		$("#constraintmsg").html(html);
		$("#demouser").hide();
		$("#subscribeduser").show();
		stateConnection = txData.connectionState();
		dataItem["UsrType"] = "Reg";
		var emailLogIn = $('#emailUser').val();
		if(emailLogIn) {
			dataItem["emailUsr"]=emailLogIn;
		}else{
			dataItem["emailUsr"]="UnRegistered";
		}
		rData.setUserEM(dataItem["emailUsr"]);
		var emailpassword = $('#passwordUser').val();
		var secret =SHA256(emailpassword);
		rData.setUserSecret(secret);
		if (stateConnection) {
			checkDeveloiperMode();
			getUserByEMail();			
			
		}else {
					
			failBackUp(true);
			//go to session page 
		}
		$('#passwordUser').val("");
	}
    
	function failBackUp(initial) {
		$('#session_div').empty();
		$('#controlBtns').empty();
		
		var key = "userid"+rData.getUserEM();
		var localStorageUser =$.jStorage.get(key);
		var userSecretId = rData.getUserSecret();
		
		if(localStorageUser){
			if(localStorageUser.userPwd == userSecretId){
				rData.setUserID(localStorageUser.userID);
				rData.setDeveloperMode(true);
			}else{
				dataItem["emailUsr"]="UnRegistered";
				rData.setUserEM(dataItem["emailUsr"]);
				rData.setUserID(0);
				if(navigator.notification){				
					navigator.notification.alert(
						'Cant Verify who you are \nCheck logon Details and try again\nLeave password Blank for Unregistered user ',
						alertDismissed,
						'Sorry',
						'Ok'
					);
				}else{
					alert("Cant Verify who you are Check email and password and try again");
				}
				$.mobile.hidePageLoadingMsg();
				var sd =$("#sessions_data").html("");
				doReady();
				//setDemoPieceValues();
				//$.mobile.navigate( "#mySession");
				
				return;
			}
			if(localStorageUser.userBUp){
				var downLoadDate = localStorageUser.bUpDate;
				if(downLoadDate){
					var dd = new Date(downLoadDate);
					var year = dd.getFullYear();
					var month = dd.getUTCMonth();
					var day = dd.getUTCDate();
					if(!initial){
						if(navigator.notification){
							navigator.notification.alert(
								'From Conection made on  '+day+"/"+month+"/"+year,
								alertDismissed,
								'Showing Sessions',
								'Ok'
							);
						}else{
							alert("Showing Sessions from connection made on"+day+"/"+month+"/"+year);
						}
					}
				}
				$.mobile.loadingMessage = "Loading in Progress";
				$.mobile.showPageLoadingMsg("b","Loading ...");
				showSessionData(localStorageUser.userBUp);			
				var newData = phonePiece();
				showSessionData(newData);
				
				setTimeout(function () {
					$.mobile.navigate( "#mySession");
					$.mobile.hidePageLoadingMsg();
				},500);
				
			}else {
				if(navigator.notification){
					navigator.notification.alert(
						'No Sessions Stored',
						alertDismissed,
						'Notice',
						'Ok'
					);
				}else{
					alert("No Sessions Stored");
				}
				$.mobile.navigate( "#mySession");
				var newData = phonePiece();
				showSessionData(newData);
			}
			if(localStorageUser.isDeveloper == true){
				setDeveloperOption(localStorageUser.isDeveloper);
			}else{
				setDeveloperOption(false);
			}
			var con;
			if(localStorageUser.dateDownLoaded.length >0){
				var inTollerance = cData.checklastDownLoad(localStorageUser.dateDownLoaded);
				if(inTollerance){
					con = localStorageUser.constraint;
					if(con){
						cData.setAtlConstraint(con);
					}else{
						con = cData.getDefaultQuota();
						cData.setAtlConstraint(con);
					}
					
				}else{
					con = cData.getDefaultQuota();
					cData.setAtlConstraint(con);
				}
			}
			$.mobile.navigate( "#mySession");
		}else{
			con = cData.getDefaultQuota();
			cData.setAtlConstraint(con);
			dataItem["emailUsr"]="UnRegistered";
			rData.setUserEM(dataItem["emailUsr"]);
			rData.setUserID(0);
			
			if(navigator.notification){
				navigator.notification.alert(
					'To Proceed Leave password blank... Cant verify who you are',
					alertUnknownDismissed,
					'Notice',
					'Ok'
				);
			}else{
				alert("To Proceed Leave password blank... Cant Verify Who You are");
				$.mobile.navigate( "#startpage");
			}
			
			$.mobile.hidePageLoadingMsg();
		}
		
		var sd =$("#sessions_data").html("");
		doReady();
	}
	function alertUnknownDismissed(){
		$.mobile.navigate( "#startpage");
		
	}
	function checkDeveloiperMode(){
		var key = "userid"+rData.getUserEM();
		var devModeUser =$.jStorage.get(key);
		if(devModeUser){
			if(devModeUser.isDeveloper == true){
				setDeveloperOption(true);
			}else{
				setDeveloperOption(false);
			}
		}else{
			//no local storage
			setDeveloperOption(false);
		}
	}
	// navigator.notification not working yet fall back to confirm confirmExitApp
	function onConfirm2(buttonIndex){
		
		//alert("pressed :"+buttonIndex);
	}
	function storagefull(){
		if(navigator.notification){
			navigator.notification.alert(
				'Please free up space\ndelete Entries in History',
				msgOk,
				'Memory Full',
				'Ok'
			);
		}else{
			alert("Please free up space\nDelete Entries in History");
		}
		function msgOk (){
		}
	}
	function reInitialServer(server){
		if(server==3){
			$("#server3").checkboxradio();
			$("#server3").prop("checked",true).checkboxradio('refresh');
			$("#server2").checkboxradio();
			$("#server2").prop("checked",false).checkboxradio('refresh');
			$("#server1").checkboxradio();
			$("#server1").prop("checked",false).checkboxradio('refresh');
			statusItem["baseURL"]=statusItem["baseURL_3"];
			
		}else if(server==2){
			$("#server3").checkboxradio();
			$("#server3").prop("checked",false).checkboxradio('refresh');
			$("#server2").checkboxradio();
			$("#server2").prop("checked",true).checkboxradio('refresh');
			$("#server1").checkboxradio();
			$("#server1").prop("checked",false).checkboxradio('refresh');
			
			statusItem["baseURL"]=statusItem["baseURL_2"];
		}else{
			$("#server3").checkboxradio();
			$("#server3").prop("checked",false).checkboxradio('refresh');
			$("#server2").checkboxradio();
			$("#server2").prop("checked",false).checkboxradio('refresh');
			$("#server1").checkboxradio();
			$("#server1").prop("checked",true).checkboxradio('refresh');
			statusItem["baseURL"]=statusItem["baseURL_1"];
		}
	}
	function confirmExitApp() {
		if(navigator.notification){
		
			navigator.notification.confirm(
				'Are you sure you want to Exit ?',
				onConfirmExit,
				'Notice',
				['Cancel','Ok']
			);
		}else{
			var ans = confirm("Are you Sure you want to Exit");
			if(ans){
				onConfirmExit(2);
			}else{
				onConfirmExit(1);
			}
		}
		
		function onConfirmExit(btn){
			if(btn == 2){
				reInitialServer(1);
				gData.clearWatches();
				$.mobile.changePage("#startpage",{
					transition: "none",
					reverse: true,
					changeHash: true
				});
				var platformType = device.platform;
				if(platformType != "iOS"){
					navigator.app.exitApp();
				}
			}
		};
		
	}
	$("#CreatePiece").on("click", function(){
		$('#session_div').empty();
		$('#controlBtns').empty();
		var userIdKey ="userid"+rData.getUserEM();
		var websession = $.jStorage.get(userIdKey);
		if(!websession){
		}else{
			if(websession.userBUp){
				$.mobile.showPageLoadingMsg("b","Loading ...");
				showSessionData(websession.userBUp);
				var newData = phonePiece();
				//showSessionData(newData);
				setTimeout(function () {
					$.mobile.navigate( "#mySession");
					$.mobile.hidePageLoadingMsg();
					//$( "#mySession" ).fixedtoolbar( "show" );
				},500);
				
				
			}
		}
		var newData = phonePiece();
		//showSessionData(newData);
		$.mobile.showPageLoadingMsg("b","Loading ...");
		showSessionData(newData);
		setTimeout(function () {
			$.mobile.navigate( "#mySession");
			$.mobile.hidePageLoadingMsg();
			//$( "#mySession" ).fixedtoolbar( "show" );
		},500);
		//clear pieces
		//$.mobile.navigate( "#mySession");
		
	});
	
	$('.exitApplication').on('click touchstart', function(e){
		e.stopPropagation();
		e.preventDefault();
		rData.setUserID(0);
		confirmExitApp();
		
	});
	$('#appExit').on('click',function(e){
		e.stopPropagation();
		e.preventDefault();
		rData.setUserID(0);
		confirmExitApp();
		//confirmExit();
	});
	
	$('#defaultSession').on('click',function() {
		doReady();
		$("#controlBtns").empty();
		$.mobile.changePage( "#controlPage",{
			transition: "slideup",
			reverse: true,
			changeHash: true
		});
		//$.mobile.fixedToolbars.show();
		dataItem["Piece_Id"] = txData.generateUUID();
		dataItem["Session_Id"]= txData.generateUUID();
		dataItem["TP_Id"] = txData.generateUUID();
	});
	
	$('#clearData').on("click touchstart", function(e){
		e.stopPropagation();
		e.preventDefault();
		var ans = confirm("Storage Size"+$.jStorage.storageSize()+" Do You Want To Clear");
		if(ans){
			$.jStorage.flush();
		}
	});
	$('#changeSession').on('click', function(e){
		e.stopPropagation();
		e.preventDefault();
		if(statusItem["pieceState"]=="RUNNING"){
										
			if((pieceTypeInt == 0)||
				(pieceTypeInt == 1)||
				(pieceTypeInt == 2)){
				rData.setGuiEvent("PEND");
				//rData.setGuiEvent( "PIDLE" );
			}else{
				rData.setGuiEvent("IEND");
				count = intervalRepeat;
				$('#strokeElement').hide();
				$('#timeElement').show();
			}
			statusItem["pieceState"] = "STOP";
		}
		$.mobile.changePage( "#mySession",{
					transition: "none",
					reverse: true,
					changeHash: true
		});
		//$( "#mySession" ).fixedtoolbar( "show" );
	});
	

	function ctlBtnsDefault(){
		$('.cbpause').hide();
		$('.cbplay').show();
		$('.cbstop').hide();
		$('.cbcont').hide();
		
	}
	function ctlBtnsHide(){
		$('.cbpause').hide();
		$('.cbplay').hide();
		$('.cbstop').hide();
		$('.cbcont').hide();
		
	}
	function doReady() {
		$('.cbpause').hide();
		$('.cbplay').show();
		$('.cbstop').hide();
		$('.cbcont').hide();
		rData.setStrokeCount(0);
	}
	doReady();
	
	function doPause(pieceDiveq) {
		$('.cbplay').eq(pieceDiveq).hide();
		$('.cbpause').eq(pieceDiveq).show();
		
		$('.cbstop').eq(pieceDiveq).hide();
		//$('.cbcont').eq(pieceDiveq).hide();
		$('.cbcont').eq(pieceDiveq).show();
		$.mobile.changePage( "#dashboard",{
			transition: "none",
			reverse: true,
			changeHash: true
		});
		//$.mobile.fixedToolbars.show();
		
		
	}
	function doResume(pieceDiveq) {
		$('.cbplay').eq(pieceDiveq).hide();
		$('.cbstop').eq(pieceDiveq).show();
		$('.cbpause').eq(pieceDiveq).hide();
		$('.cbcont').eq(pieceDiveq).show();

		$.mobile.showPageLoadingMsg("b","Paused ...",true);
	}
	function doContinue(pieceDiveq) {
		$('.cbplay').eq(pieceDiveq).hide();
		$('.cbstop').eq(pieceDiveq).hide();
		//$('.cbcont').eq(pieceDiveq).hide();
		$('.cbcont').eq(pieceDiveq).show();
		$('.cbpause').eq(pieceDiveq).show();
		showDialog ({heading:"Cont", mode: "cancel"});
		$("#dialog,#mask").fadeOut();
		$.mobile.changePage( "#dashboard",{
			transition: "none",
			reverse: true,
			changeHash: true
		});
	}
	function doCancel(pieceDiveq) {
		$('.cbplay').eq(pieceDiveq).show();
		$('.cbstop').eq(pieceDiveq).hide();
		$('.cbpause').eq(pieceDiveq).hide();
		$('.cbcont').eq(pieceDiveq).hide();
		$("#dialog,#mask").fadeOut();
		$.mobile.changePage( "#dashboard",{
			transition: "none",
			reverse: true,
			changeHash: true
		});
	}
	function doFinish(pieceDiveq) {
		$('.cbplay').eq(pieceDiveq).hide();
		$('.cbstop').eq(pieceDiveq).hide();
		$('.cbpause').eq(pieceDiveq).hide();
		$('.cbcont').eq(pieceDiveq).hide();
	}
	
	function setUpPaddle() {
		dataItem["Piece_Id"] = txData.generateUUID();
		//dataItem["Session_Id"]= txData.generateUUID();
		//dataItem["TP_Id"] = txData.generateUUID();
		dataItem["paID"]=txData.generateUUID();
		dataItem["type"]="PA";
		rData.setPieceID(dataItem["Piece_Id"]);
		rData.setSessionID(dataItem["Session_Id"]);
		rData.setTrainingPlanID(dataItem["TP_Id"]);
		rData.setPAID(dataItem["paID"]);
		rData.setTYPE(dataItem["type"]);
		rData.setIDX(0);

	}
	
	
	function changePiece() {
		if(navigator.notification){
			navigator.notification.alert(
				'Please end The Previous Selected Piece Before Continuing.... ',
				paddleMsgDismissed,
				'New Piece Selected',
				'Ok'
			);
		}else{
			alert("Please End Previous Selected Piece Before Continuing");
		}
	}
	$(document).delegate('#mySession','pageshow', function() {
		if(statusItem["pieceState"]=="RUNNING"){
			statusItem["pieceState"] = "STOP";
			doReady();			
		}
	});
	

	$('.cbplay').eq(0).on("click", function(e){
		//e.stopPropagation();
		//e.preventDefault();
		if(statusItem["pieceState"]=="RUNNING"){
			changePiece();
		}else{
			// piece not running
			setUpPaddle();
			cData.setPieceDiveq(0);
			$('#intervalContainer').hide();
			$('#timeLegent').text("Time");
			$('#distanceLegent').text("Distance");
			$('#distanceTarget').text("");
			$('#timeTarget').text("");
			if(!timeElemVisable){
				$('#strokeElement').hide();
				$('#timeElement').show();
			}
			statusItem["pieceState"] = "RUNNING";
			rData.setGuiEvent("PSTR");
			pieceTypeInt = 0;
			pieceStart(pieceTypeInt);
			doPause(0);
		}

	});

	$('.cbpause').eq(0).on("click", function(e){
		e.stopPropagation();
		e.preventDefault();
			rData.setGuiEvent("PAUSE");
			doResume(0);
			e.handled= true;
		
	});

	$('.cbcont').eq(0).on("click", function(e){
		e.stopPropagation();
		e.preventDefault();
		rData.setGuiEvent("CONT");
		doContinue(0);
		
	});
	$('.cbstop').eq(0).on("click", function(e){
		e.stopPropagation();
		e.preventDefault();
		rData.setGuiEvent("PEND");
		//rData.setGuiEvent( "PIDLE" );
		statusItem["pieceState"] = "STOP";
		dataItem["paID"]=0;
		rData.setPAID(dataItem["paID"]);
		doCancel(0);
		
		//doReady(); //note dataitem["piece_id"] set to recovery
		
	});
	
	// function start piece if no action occurs not implemented	

	$('#dashboard').click(function(){
		//$.mobile.changePage( "#controlPage",{transition:"slidedown",changeHash:false});
		$.mobile.changePage( "#controlPage",
			{
			transition:"none",
			changeHash:false}
		);
		//$.mobile.fixedToolbars.show();
	});

	$('#Interval').click(function() {
		showDialogInterval( {heading: "Restart", content: "", btnOptions: "extra"}, clickedOk);
	});
	var updateSessions = null;
	var updateSessionTimer = statusItem["updateSessionTimer"];
	var initialAuthentication = false;
	document.addEventListener("deviceready", onDeviseUpdate, false);
	function onDeviseUpdate(){
		initialAuthentication = false;
		document.addEventListener("pause", updatePause, false);
		document.addEventListener("resume", updateResume, false);
		
	}
	function updatePause (){
		if(updateSessions != null){
			clearInterval(updateSessions);
			updateSessions = null;
			initialAuthentication = false;
		}
		
	}
	function updateResume (){
		var activePage = $.mobile.activePage.attr("id");
		initialAuthentication = true;
		if(activePage =="mySession"){
			if(statusItem["demoUser"] == false){
				getLatestSessions ();
				updateSessions = setInterval(function (){
					getLatestSessions ();
				},updateSessionTimer);
			}else{
				$('#session_div').empty();
				var newData = phonePiece();
				showSessionData(newData);				
			}
		}
	}
	
	$(document).delegate('#mySession','pageshow', function() {
		
		if(initialAuthentication){
			if(statusItem["demoUser"] == false){
				getLatestSessions ();
			}else{
				$('#session_div').empty();
				var newData = phonePiece();
				showSessionData(newData);
			}
		}
		
		if(statusItem["demoUser"] == false){
			updateSessions = setInterval(function (){			
				getLatestSessions ();
			},updateSessionTimer);
		}
		
	
	});
	$(document).delegate('#mySession','pagehide', function() {
		if(updateSessions != null){
			clearInterval(updateSessions);
			updateSessions = null;
			initialAuthentication = true;
		}
	
	});	
	
	function getLatestSessions (){
		var Connection = txData.connectionState();
		if (Connection) {
			var lastuser = $.jStorage.get("lst");
			if(lastuser != null){
				if(lastuser.data != null){
					if(lastuser.data._id != null){
						getSessionById(lastuser.data._id);
					}else{
						//lastuser.data._id
					}
				}else{
					//lastuser.data
				}
			}else{
				//lastuser
				if(navigator.notification){
					navigator.notification.alert(
						'Please Log in to Check latest Sessions',
						sessionupdateDismissed,
						'Message',
						'Ok'
					);
				}else{
					alert("Please Log in to Check latest Sessions");
				}				
			}
		}else {
			//!Connection
			failBackUp(false);
			setTimeout( function () {
				$.mobile.hidePageLoadingMsg();				
				clearData();
				clearTargetData();
				setUpPaddle();				
			},2000);
			
		}
		
		function sessionupdateDismissed(){
			
		}
			
		
	};

	function getUserByEMail() {
	//server returns user id from email and password
		//show phone created pieces if no credit immediatly
		var newData = phonePiece();
		showSessionData(newData);
		
		var urlPlanByUser = statusItem["baseURL"]+'/Mobile/',
			emailLogIn = $('#emailUser').val(),
			emailPsw = $('#passwordUser').val(),
			appVer =dataItem["appVers"],
			dataLog = emailLogIn + '$' + emailPsw +'$'+appVer;
		urlPlanByUser += dataLog;
		$.ajax({
			url: urlPlanByUser,
			dataType: "jsonp",
			jsonpCallback: "_rowsage",
			cache: false,
			timeout: 10000,
			success: function(data) {
				if(data){
					rData.setUserID(data._id);
					var dateDownloaded = new Date().toDateString();
					cData.setAtlConstraint(data.constraints);
					if(data.Developer){
						rData.setDeveloperMode(data.Developer);
					}else{
						rData.setDeveloperMode(false);
					}
					var key = "userid"+rData.getUserEM();
					//set data to local storage
					var lastuser = {};
					lastuser.email =  rData.getUserEM();
					lastuser.data = data;
					
					var storageAvailable = $.jStorage.storageAvailable();
					if(storageAvailable){
						$.jStorage.set("lst",lastuser);
						var userdata ={};
						userdata.userName = rData.getUserEM();
						userdata.userPwd = rData.getUserSecret();
						userdata.userID  = rData.getUserID();
						userdata.constraint = cData.getAtlConstraint();
						userdata.dateDownLoaded = dateDownloaded;
						$.jStorage.set(key,userdata);
					}else{
						storagefull();
					}
					
					getLatestSessions ();
					setTimeout( function () {									
						$.mobile.changePage( "#mySession",{
							transition: "none",
							reverse: true,
							changeHash: true
						});					
					
					},1000);					
				}else{
					$('#entryMessage').text("Check Credentials");
					setTimeout( function () {
						$('#entryMessage').text("");
					},2000);
					$('#popupDInvalid').popup();
					$('#popupDInvalid').popup('open');
					var to = setTimeout(function () {
						$('#popupDInvalid').popup();
						$('#popupDInvalid').popup('close');
					},4000);
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$.mobile.hidePageLoadingMsg();
				//$.mobile.showPageLoadingMsg("a","Have you got creit ...",true);
				
				
				$('#popupDNoConn').popup();
				$('#popupDNoConn').popup('open');
				var to = setTimeout(function () {
					$('#popupDNoConn').popup('close');
					//$.mobile.hidePageLoadingMsg();
				}, 10000);
				setDeveloperOption(false);
				//failBackUp();
				
				$.mobile.changePage( "#mySession",{
						transition: "none",
						reverse: true,
						changeHash: true
				});
			}
		}).done(function(){
			$.mobile.hidePageLoadingMsg();
		});
	}


	function getSessionById(user_Id) {
		
		// returns data for todays session for specified user
		
		var urlPlanBySession = statusItem["baseURL"]+'/SessionMobile/';	
			var today = new Date();
			var todayAsMS = today.getTime();
			var dayParam = "$"+todayAsMS;
			urlPlanBySession += user_Id;
			urlPlanBySession += dayParam;

		$('#session_div').empty();
		var newData = phonePiece();
		showSessionData(newData);
		
		$.ajax({
			url:urlPlanBySession,
			dataType: "jsonp",
			jsonpCallback: "_rowsage",
			cache: false,
			timeout: 30000,
			success: function(data) {
				var key = "userid"+rData.getUserEM();
				var localStorageUser =$.jStorage.get(key);
				if(localStorageUser){
					localStorageUser.isDeveloper = rData.getDeveloperMode();
					$.jStorage.set(key,localStorageUser);
				}
				
				if(data.length == 0){
					$.mobile.showPageLoadingMsg("a","There are No Sessions Scheduled for Today ...",true);
					newData = phonePiece();
					showSessionData(newData);
					setTimeout( function () {
						$.mobile.hidePageLoadingMsg();
						clearData();
						clearTargetData();
						setUpPaddle();
						
					},2000);
					
				
				}else{
					//$.mobile.hidePageLoadingMsg();
					$.mobile.showPageLoadingMsg("e","Loading please wait ...");
					var sd =$("#sessions_data").html("");
					if(localStorageUser){
						localStorageUser.userBUp = data;
						localStorageUser.bUpDate = new Date();
						$.jStorage.set(key,localStorageUser);
					}
					txData.syncFromWeb(data);
					$('#session_div').empty();
					showSessionData(data);
					newData = phonePiece();
					showSessionData(newData);
					setTimeout(function () {
						$.mobile.hidePageLoadingMsg();
						$.mobile.navigate( "#mySession");
						$.mobile.hidePageLoadingMsg();
					},500);
										
				}
			  },
			  error: function(jqXHR, textStatus, errorThrown) {
				$.mobile.hidePageLoadingMsg();
				$.mobile.showPageLoadingMsg("a","Problem refresing session data\nHave you got creit ...",true);
				
				failBackUp(false);
				setTimeout(function (){
					$.mobile.hidePageLoadingMsg();
				},1000);
			}
		});
	}


	function showSessionData(data){
		
		$('#intervalContainer').hide();
		$('#strokeElement').hide();
		$('#timeElement').show();

		var sessionDivData ='<div class="sessionDiv"><p>${S_Name}</p>\
							<hr>\
							<p>Plan :${TP_Name} </p>\
							<p>Date :${S_Date}</P><p>Time : ${S_Time}</p>\
							<p>${S_Mode} &nbsp; ${S_ModeBType}</p>\
							</div>';
		$('#controlBtns').empty();
		$.template('sessionList',sessionDivData);
		$.each(data, function(i,tPlan){
			dataItem["TP_Name"] = tPlan.TP_Name;
			dataItem["TP_Id"] = tPlan._id;
			dataItem["TP_Id_Save"] = dataItem["TP_Id"];
			dataItem["TP_Description"] = tPlan.TP_Description;
			$.each(tPlan.PlannedSession, function(j,sPlan){
				
				dataItem["S_Name"] =  sPlan.S_Name;
				dataItem["S_Date"] = sPlan.S_Date;
				dataItem["S_Time"] =  millisecondsToString(sPlan.S_Time);  
				dataItem["S_Mode"] = sPlan.S_Mode;
				dataItem["S_TrainingZone"] = sPlan.S_TrainingZone;
				dataItem["S_ModeBType"] = sPlan.S_ModeBType;
				dataItem["S_ModeBName"] = sPlan.S_ModeBName;
				dataItem["Session_Id"] = sPlan.Session_ID;
				dataItem["S_Description"] = sPlan.S_Description;
				statusItem["pieceState"] = "Ready";
				$.tmpl('sessionList',dataItem)
					.appendTo('#session_div')
					.click(function(){
						dataItem["Session_Id"] = sPlan.Session_ID;
						dataItem["TP_Id"] = data[i]._id;
						rData.setTrainingPlanID(dataItem["TP_Id"]);
						rData.setSessionID(dataItem["Session_Id"]);
						ShowPieceData(data,sPlan,i,j);
						$.mobile.showPageLoadingMsg("b","Loading ...");
						$.mobile.loadPage("#controlPage",{prefetch:"true"});
						$.mobile.changePage( "#controlPage",{
							transition: "slidedown",
							reverse: true,
							changeHash: true
						});
					});
				});
			});
	}// show session data
	
	// passed in to following fubction
	// data  all returned data from ajax call
	// sPlan data for selected session
	// i index of selected training plan
	// j index of selected session

	function ShowPieceData(data,sPlan,i,j) {
		
		$('#controlBtns').empty(); // resets display
		var btnDivData= '<div class="pieceDiv"><h4>${pieceType}</h4>\
		<div>\
		<div class="cbstop"><img src="img/stopbutton100By100.png" /></div>\
		<div class="cbpause"><img src="img/pausebutton100By100.png" /></div>\
		<div class="cbplay"><img src="img/playbutton100By100.png" /></div>\
		<div class="cbcont"><img src="img/playbutton100By100.png" /></div>\
		</div>\
		<h4>${pieceDes}</h4>\</div>';
		$.template('btnList',btnDivData);
		if(typeof(sPlan.Piece) == "undefined"){
			return;
		}
		
		$.each(sPlan.Piece, function (k, pPlan) {
            checkPiece(data, i, j, k);

            var pieceData = pPlan;
            if (pieceData.PieceType	 == "DISTANCE") {
                var btnDist = $.tmpl('btnList', dataItem)
                    .appendTo('#controlBtns')
                    .on("click", function distBtns(e) {
                        e.stopPropagation();
                        e.preventDefault();
                        var self = $(this);
                    });
                $('.cbplay', btnDist).on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var pieceDiveq = $(this).parent().parent().index() + 1;
                   
                    // check if piece already running stop first
                    if (statusItem["pieceState"] == "RUNNING") {
						changePiece();
                        /*if ((pieceTypeInt == 0) ||
                            (pieceTypeInt == 1) ||
                            (pieceTypeInt == 2)) {
                            rData.setGuiEvent("PEND");
                        } else {
                            rData.setGuiEvent("IEND");
                            count = intervalRepeat;
                            $('#strokeElement').hide();
                            $('#timeElement').show();
                        }
                        statusItem["pieceState"] = "STOP";
                        var t = setTimeout(function () {
                            statusItem["pieceState"] = "RUNNING";
                            pieceTypeInt = 2;
                            targetDistance = parseInt(pieceData.Distance);
                            showDialog({heading: "Piece Start in 5", mode: "go"});
                            // set buttons to pause
                            doPause(pieceDiveq);
                        }, 200);*/

                    } else {
                        // piece not running
						
						cData.setPieceDiveq(pieceDiveq);
						$('#timeTarget').text("");
						$('#timeLegent').text("Time");
						$('#distanceLegent').text("Distance *");
						$('#distanceTarget').text(pieceData.Distance + "m");
						$('#heartTarget').text(pieceData.HeartRate);
						$('#strokeTarget').text(pieceData.StrokeRate);
						$('#intervalContainer').hide();
	
						dataItem["Piece_Id"] = pieceData._id;
						dataItem["Session_Id"] = pieceData.Session_ID;
						rData.setTrainingPlanID(dataItem["TP_Id"]);
						rData.setPieceID(dataItem["Piece_Id"]);
						rData.setSessionID(dataItem["Session_Id"]);
						dataItem["paID"]=txData.generateUUID();
						dataItem["type"]="PD";
						rData.setPAID(dataItem["paID"]);
						rData.setTYPE(dataItem["type"]);
						rData.setIDX(0);
						
						
                        statusItem["pieceState"] = "RUNNING";
                        pieceTypeInt = 2;
                        targetDistance = parseInt(pieceData.Distance);
                        showDialog({heading: "Piece Start in 5", mode: "go"});
                        doPause(pieceDiveq);
                    }
                });
                $('.cbpause', btnDist).on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    //statusItem["pieceState"] = "RUNNING";
                    rData.setGuiEvent("PAUSE");
                    var pieceDiveq = $(this).parent().parent().index() + 1;
                    // set buttons to allow resume or cancel
                    doResume(pieceDiveq);
                });
                $('.cbcont', btnDist).on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    //statusItem["pieceState"] = "RUNNING";
                    rData.setGuiEvent("CONT");
                    var pieceDiveq = $(this).parent().parent().index() + 1;
                    // set buttons to pause
                    doContinue(pieceDiveq);
                });
                $('.cbstop', btnDist).on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    // dataItem used to clear Intervals
                    statusItem["pieceState"] = "STOP";
                    rData.setGuiEvent("PEND");
                    dataItem["paID"]=0;
                    dataItem["type"]="";
                    rData.setPAID(dataItem["paID"]);
                    rData.setTYPE(dataItem["type"]);
                    rData.setIDX(0);
					//rData.setGuiEvent( "PIDLE" );
                    var pieceDiveq = $(this).parent().parent().index() + 1;
                    // set buttons to start again
                    doCancel(pieceDiveq);

                });

            } else if (pieceData.PieceType	 == "TIME") {
                //var myP = pieceData;
                var btnTime = $.tmpl('btnList', dataItem)
                    .appendTo('#controlBtns')
                    .on("click", function timeBtnCtl(e) {
                    });
                $('.cbplay', btnTime).on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
					
                   
                    // check to see if piece already runnins stop if it is
                    if (statusItem["pieceState"] == "RUNNING") {
						changePiece();

                        /*if ((pieceTypeInt == 0) || (pieceTypeInt == 1) || (pieceTypeInt == 2)) {
                            rData.setGuiEvent("PEND");
							//rData.setGuiEvent( "PIDLE" );
                        } else {
                            rData.setGuiEvent("IEND");
                            count = intervalRepeat;
                            $('#strokeElement').hide();
                            $('#timeElement').show();
                        }
                        statusItem["pieceState"] = "STOP";
                        // set buttons to pause
                        //doReady(); pieceTime()
                        var t = setTimeout(function () {
                            statusItem["pieceState"] = "RUNNING";
                            pieceTypeInt = 1;
                            targetTime = (parseInt(pieceData.PieceTime	));
                            showDialog({heading: "Piece Start in 5", mode: "go"});
                            doPause(pieceDiveq);

                        }, 200);*/
                    } else {
						
						$('#timeLegent').text("Time *");
						$('#distanceLegent').text("Distance");
						$('#distanceTarget').text("");
						$('#timeTarget').text(millisecondsToString(parseInt(pieceData.PieceTime	)));
						$('#heartTarget').text(pieceData.HeartRate);
						$('#strokeTarget').text(pieceData.StrokeRate);
						$('#intervalContainer').hide();
						rData.setTrainingPlanID(dataItem["TP_Id"]);
						rData.setPieceID(pieceData._id);
						rData.setSessionID(pieceData.Session_ID);
						dataItem["Piece_Id"] = pieceData._id;
						dataItem["Session_Id"] = pieceData.Session_ID;
						dataItem["paID"]=txData.generateUUID();
						dataItem["type"]="PT";
						rData.setPAID(dataItem["paID"]);
						rData.setTYPE(dataItem["type"]);
						rData.setIDX(0);
						var pieceDiveq = $(this).parent().parent().index() + 1;
						cData.setPieceDiveq(pieceDiveq);
                        // piece not running
                        statusItem["pieceState"] = "RUNNING";
                        pieceTypeInt = 1;
                        targetTime = (parseInt(pieceData.PieceTime	));
                        showDialog({heading: "Piece Start in 5", mode: "go"});
                        // set buttons to allow pause
                        doPause(pieceDiveq);
                    }
                });
                $('.cbpause', btnTime).on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    rData.setGuiEvent("PAUSE");
                    var pieceDiveq = $(this).parent().parent().index() + 1;
                    // set buttons to resume or cancel
                    doResume(pieceDiveq);
                });
                $('.cbcont', btnTime).on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    rData.setGuiEvent("CONT");
                    var pieceDiveq = $(this).parent().parent().index() + 1;
                    // set buttons to start again
                    doContinue(pieceDiveq);
                });
                $('.cbstop', btnTime).on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    // allows othere functions to know a stop occured
                    statusItem["pieceState"] = "STOP";
                    rData.setGuiEvent("PEND");
                    dataItem["paID"]=0;
                    dataItem["type"]="";
                    rData.setPAID(dataItem["paID"]);
                    rData.setTYPE(dataItem["type"]);
                    rData.setIDX(0);
					//rData.setGuiEvent( "PIDLE" );
                    var pieceDiveq = $(this).parent().parent().index() + 1;
                    // sets buttons to restart
                    doCancel(pieceDiveq);
                });
            } else if (pieceData.PieceType	 == "STROKE") {
                // to be tested not currently available from web
                var btnStroke = $.tmpl('btnList', dataItem)
                    .appendTo('#controlBtns')
                    .on("click", function strokeBtnCtl(e) {
                        e.stopPropagation();
                        e.preventDefault();
                        var self = $(this);
                        pieceTypeInt = 6;
                        rData.setPieceID(pieceData._id);
                        rData.setSessionID(pieceData.Session_ID);
                        dataItem["Piece_Id"] = pieceData._id;
                        dataItem["Session_Id"] = pieceData.Session_ID;
                    });
                $('.cbplay', btnStroke).on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var pieceDiveq = $(this).parent().parent().index() + 1;
					
                    if (statusItem["pieceState"] == "RUNNING") {
                        // stops previouse piece
						changePiece();

                        /*if ((pieceTypeInt == 0) || (pieceTypeInt == 1) || (pieceTypeInt == 2)) {
                            rData.setGuiEvent("PEND");
							//rData.setGuiEvent( "PIDLE" );
                        } else {
                            rData.setGuiEvent("IEND");
                            count = intervalRepeat;
                            $('#strokeElement').hide();
                            $('#timeElement').show();
                        }
                        statusItem["pieceState"] = "STOP";
                        //doReady(); pieceStrokeCount()
                        var t = setTimeout(function () {
                            rData.setGuiEvent("PSTR");
							//rData.setGuiEvent("PRUN");
                            statusItem["pieceState"] = "RUNNING";
                            pieceTypeInt = 6;
                            showDialog({heading: "Piece Start in 5", mode: "go"});
                            // sets buttons to pause
                            doPause(pieceDiveq);
                        }, 200);*/
                    } else {
						
						cData.setPieceDiveq(pieceDiveq);
						$('#distanceTarget').text("");
						$('#timeTarget').text("");
						dataItem["paID"]=txData.generateUUID();
						dataItem["type"]="PS";
						rData.setPAID(dataItem["paID"]);
						rData.setTYPE(dataItem["type"]);
						rData.setIDX(0);
                        // piece not running
                        statusItem["pieceState"] = "RUNNING";
                        pieceTypeInt = 6;
                        targetStroke = pieceData.PT_Stroke;
                        showDialog({heading: "Piece Start in 5", mode: "go"});
                        // sets buttons to pause
                        doPause(pieceDiveq);
                    }
                });
                $('.cbpause', btnStroke).on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    rData.setGuiEvent("PAUSE");
                    var pieceDiveq = $(this).parent().parent().index() + 1;
                    // sets buttons to allow resume
                    doResume(pieceDiveq);
                });
                $('.cbcont', btnStroke).on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    rData.setGuiEvent("CONT");
                    var pieceDiveq = $(this).parent().parent().index() + 1;
                    // sets buttons to proceeed
                    doContinue(pieceDiveq);
                });
                $('.cbstop', btnStroke).on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    // allows other pieces to stop intervals
                    statusItem["pieceState"] = "STOP";
                    rData.setGuiEvent("PEND");
                    dataItem["paID"]=0;
                    dataItem["type"]="";
                    rData.setPAID(dataItem["paID"]);
                    rData.setTYPE(dataItem["type"]);
                    rData.setIDX(0);
					//rData.setGuiEvent( "PIDLE" );
                    var pieceDiveq = $(this).parent().parent().index() + 1;
                    // sets buttons to allow restart
                    doCancel(pieceDiveq);
                });
            } else if ((pieceData.PieceType	 == "INTERVAL SET") && (pieceData.IntervalType == "Time")) {

                //var myPIT = pieceData;
                var btnIntervalTime = $.tmpl('btnList', dataItem)
                    .appendTo('#controlBtns')
                    .on("click", function iTimeBtnCtl(e) {
                        e.stopPropagation();
                        e.preventDefault();
                        var self = $(this);
                    });
                $('.cbplay', btnIntervalTime).on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    
                    // check to see if piece already runnins stop if it is
                    if (statusItem["pieceState"] == "RUNNING") {
						changePiece();
                        /*if ((pieceTypeInt == 0) ||
                            (pieceTypeInt == 1) ||
                            (pieceTypeInt == 2)) {
                            rData.setGuiEvent("PEND");
							//rData.setGuiEvent( "PIDLE" );
                        } else {
                            rData.setGuiEvent("IEND");
                            count = intervalRepeat;
                            $('#strokeElement').hide();
                            $('#timeElement').show();
                        }
                        statusItem["pieceState"] = "STOP";
                        //doReady();
                        var t = setTimeout(function () {
                            //rData.setGuiEvent("ISTR");
                            statusItem["pieceState"] = "RUNNING";
                            pieceTypeInt = 3;
                            //distance=0;
                            intervalSetUp(pieceData);
                            showDialog({heading: "Piece Start in 5", mode: "go"});
                            //distanceType=true;
                            // set buttons to allow pause
                            doPause(pieceDiveq);

                        }, 200);*/


                    } else {
						
						dataItem["Piece_Id"] = pieceData._id;
						dataItem["Session_Id"] = pieceData.Session_ID;
						rData.setTrainingPlanID(dataItem["TP_Id"]);
						rData.setPieceID(pieceData._id);
						rData.setSessionID(pieceData.Session_ID);
						dataItem["paID"]=txData.generateUUID();
						dataItem["type"]="IT";
						rData.setPAID(dataItem["paID"]);
						rData.setTYPE(dataItem["type"]);
						rData.setIDX(0);
	
						$('#timeLegent').text("Time");
						$('#distanceLegent').text("Distance");
						$('#intervalContainer').show();
						var pieceDiveq = $(this).parent().parent().index() + 1;
						cData.setPieceDiveq(pieceDiveq);
						$('#distanceTarget').text("");
                        // piece not running
                        statusItem["pieceState"] = "RUNNING";
                        //rData.setGuiEvent("ISTR");
                        pieceTypeInt = 3;
                        intervalSetUp(pieceData);
                        setTimeout(function () {
                            showDialog(
                                {heading: "Piece Start in 5", content: "", mode: "go"});
                        }, 200);
                        // set buttons to allow pause
                        doPause(pieceDiveq);
                    }
                });
                $('.cbpause', btnIntervalTime).on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    rData.setGuiEvent("PAUSE");
                    var pieceDiveq = $(this).parent().parent().index() + 1;
                    // set buttons to resume or cancel
                    doResume(pieceDiveq);
                });
                $('.cbcont', btnIntervalTime).on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    rData.setGuiEvent("CONT");
                    var pieceDiveq = $(this).parent().parent().index() + 1;
                    // set buttons to start again
                    doContinue(pieceDiveq);
                });
                $('.cbstop', btnIntervalTime).on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    // allows othere functions to know a stop occured
                    statusItem["pieceState"] = "STOP";
                    rData.setGuiEvent("IEND");
                    dataItem["paID"]=0;
                    dataItem["type"]="";
                    rData.setPAID(dataItem["paID"]);
                    rData.setTYPE(dataItem["type"]);
                    rData.setIDX(0);
                    var pieceDiveq = $(this).parent().parent().index() + 1;
                    count = intervalRepeat;
                    $('#strokeElement').hide();
                    $('#timeElement').show();
                    // sets buttons to restart
                    doCancel(pieceDiveq);
                });
            } else if ((pieceData.PieceType	 == "INTERVAL SET") && (pieceData.IntervalType == "Distance")) {
                //var myPID = pieceData;
                var btnIntervalDist = $.tmpl('btnList', dataItem)
                    .appendTo('#controlBtns')
                    .on("click", function iDistBtnCtl(e) {
                        e.stopPropagation();
                        e.preventDefault();
                        var self = $(this);
                    });
                $('.cbplay', btnIntervalDist).on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    
                    // check to see if piece already runnins stop if it is
                    if (statusItem["pieceState"] == "RUNNING") {
						changePiece();

                        /*if ((pieceTypeInt == 0) ||
                            (pieceTypeInt == 1) ||
                            (pieceTypeInt == 2)) {
                            rData.setGuiEvent("PEND");
							//rData.setGuiEvent( "PIDLE" );
                        } else {
                            rData.setGuiEvent("IEND");
                            count = intervalRepeat;
                            $('#strokeElement').hide();
                            $('#timeElement').show();
                        }
                        statusItem["pieceState"] = "STOP";
                        //doReady();
                        setTimeout(function () {
                            //rData.setGuiEvent("ISTR");
                            statusItem["pieceState"] = "RUNNING";
                            pieceTypeInt = 4;
                            intervalSetUp(pieceData);
                            showDialog({heading: "Piece Start in 5", mode: "go"});
                            // set buttons to allow pause
                            doPause(pieceDiveq);

                        }, 200);*/
                    } else {
                        // piece not running
						
						$('#timeLegent').text("Time");
						$('#distanceLegent').text("Distance");
						$('#intervalContainer').show();
						rData.setTrainingPlanID(dataItem["TP_Id"]);
						rData.setPieceID(pieceData._id);
						rData.setSessionID(pieceData.Session_ID);
						dataItem["Piece_Id"] = pieceData._id;
						dataItem["Session_Id"] = pieceData.Session_ID;
						dataItem["paID"]=txData.generateUUID();
						dataItem["type"]="ID";
						rData.setPAID(dataItem["paID"]);
						rData.setTYPE(dataItem["type"]);
						rData.setIDX(0);
						var pieceDiveq = $(this).parent().parent().index() + 1;
						cData.setPieceDiveq(pieceDiveq);
                        statusItem["pieceState"] = "RUNNING";
                        //rData.setGuiEvent("ISTR");
                        pieceTypeInt = 4;
                        intervalSetUp(pieceData);
                        setTimeout(function () {
                            showDialog(
                                {heading: "Piece Start in 5", mode: "go"});
                        }, 200);
                        // set buttons to allow pause
                        doPause(pieceDiveq);
                    }
                });
                $('.cbpause', btnIntervalDist).on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    rData.setGuiEvent("PAUSE");
                    var pieceDiveq = $(this).parent().parent().index() + 1;
                    // set buttons to resume or cancel
                    doResume(pieceDiveq);
                });
                $('.cbcont', btnIntervalDist).on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    rData.setGuiEvent("CONT");
                    var pieceDiveq = $(this).parent().parent().index() + 1;
                    // set buttons to start again
                    doContinue(pieceDiveq);
                });
                $('.cbstop', btnIntervalDist).on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    // allows othere functions to know a stop occured
                    statusItem["pieceState"] = "STOP";
                    rData.setGuiEvent("IEND");
                    dataItem["paID"]=0;
                    dataItem["type"]="";
                    rData.setPAID(dataItem["paID"]);
                    rData.setTYPE(dataItem["type"]);
                    rData.setIDX(0);
                    var x = $(this).parent().parent().index() + 1;
                    count = intervalRepeat;
                    $('#strokeElement').hide();
                    $('#timeElement').show();
                    // sets buttons to restart
                    doCancel(pieceDiveq);
                });
            } else if ((pieceData.PieceType	 == "INTERVAL SET") && (pieceData.IntervalType == "Stroke")) {
                //var myPIS = pieceData;
                var btnIntervalStroke = $.tmpl('btnList', dataItem)
                    .appendTo('#controlBtns')
                    .on("click", function iStrokeBtnCtl(e) {
                        e.stopPropagation();
                        e.preventDefault();
                        var self = $(this);
                    });
                $('.cbplay', btnIntervalStroke).on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
					var pieceDiveq = $(this).parent().parent().index() + 1;
                    
                    // check to see if piece already runnins stop if it is
                    if (statusItem["pieceState"] == "RUNNING") {
						changePiece();
                        /*if ((pieceTypeInt == 0) ||
                            (pieceTypeInt == 1) ||
                            (pieceTypeInt == 2)) {
                            rData.setGuiEvent("PEND");
                        } else {
                            rData.setGuiEvent("IEND");
                            count = intervalRepeat;
                            $('#strokeElement').hide();
                            $('#timeElement').show();
                        }
                        statusItem["pieceState"] = "STOP";
                        //doReady();
                        setTimeout(function () {
                            //rData.setGuiEvent("ISTR");
                            statusItem["pieceState"] = "RUNNING";
                            pieceTypeInt = 5;
                            intervalSetUp(pieceData);
                            showDialog({heading: "Piece Start in 5", mode: "go"});
                            // set buttons to allow pause
                            doPause(pieceDiveq);
                        }, 200);*/
                    } else {
                        // piece not running
						$('#timeLegent').text("Time");
						$('#distanceLegent').text("Distance");
						$('#intervalContainer').show();
						$('#distanceTarget').text("");
						//intervalSetUp(pieceData);
						rData.setTrainingPlanID(dataItem["TP_Id"]);
						rData.setPieceID(pieceData._id);
						rData.setSessionID(pieceData.Session_ID);
						dataItem["Piece_Id"] = pieceData._id;
						dataItem["Session_Id"] = pieceData.Session_ID;
						dataItem["paID"]=txData.generateUUID();
						dataItem["type"]="IS";
						rData.setPAID(dataItem["paID"]);
						rData.setTYPE(dataItem["type"]);
						rData.setIDX(0);
					   
						cData.setPieceDiveq(pieceDiveq);
						
                        statusItem["pieceState"] = "RUNNING";
                        pieceTypeInt = 5;
                        intervalSetUp(pieceData);
                        setTimeout(function () {
                            showDialog(
                                {heading: "Piece Start in 5", mode: "go"});
                        }, 200);
                        doPause(pieceDiveq);
                    }
                });
                $('.cbpause', btnIntervalStroke).on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    rData.setGuiEvent("PAUSE");
                    var pieceDiveq = $(this).parent().parent().index() + 1;
                    // set buttons to resume or cancel
                    doResume(pieceDiveq);
                });
                $('.cbcont', btnIntervalStroke).on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    rData.setGuiEvent("CONT");
                    var pieceDiveq = $(this).parent().parent().index() + 1;
                    // set buttons to start again
                    doContinue(pieceDiveq);
                });
                $('.cbstop', btnIntervalStroke).on("click", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    // allows othere functions to know a stop occured
                    statusItem["pieceState"] = "STOP";
                    rData.setGuiEvent("IEND");
                    dataItem["paID"]=0;
                    dataItem["type"]="";
                    rData.setPAID(dataItem["paID"]);
                    rData.setTYPE(dataItem["type"]);
                    rData.setIDX(0);
                    var pieceDiveq = $(this).parent().parent().index() + 1;
                    count = intervalRepeat;
                    $('#strokeElement').hide();
                    $('#timeElement').show();
                    // sets buttons to restart
                    doCancel(pieceDiveq);
                });
            }

        });
		ctlBtnsDefault(); // buttons created default shows only one button play displayed
	}
	
	function checkPiece(data,i,j,k) {
		var Piece = data[i].PlannedSession[j].Piece[k];
		var pieceType = Piece.PieceType	;
		if (pieceType == "DISTANCE"){
			dataItem["pieceTypeInt"]=1;
			dataItem["pieceType"] = "Distance Piece";
			dataItem["pieceDes"] = Piece.Distance+" m";
		}else if (pieceType == "TIME"){
			dataItem["pieceTypeInt"]=2;
			dataItem["pieceType"] = "Timed Piece";
			dataItem["pieceDes"] = millisecondsToString(Piece.PieceTime	);
		}else if (pieceType == "INTERVAL SET"){
			dataItem["pieceType"] = "Interval Set";
			if (Piece.IntervalType =="Distance") {
				dataItem["pieceTypeInt"]=3;
				dataItem["pieceDes"] =Piece.IS_Repeat+" X "+Piece.IS_Interval+" m ";
			}else if (Piece.IntervalType =="Time") {
				dataItem["pieceTypeInt"]=4;
				dataItem["pieceDes"] = Piece.IS_Repeat+" X "+millisecondsToString(Piece.IS_Interval);
			}else if (Piece.IntervalType =="Stroke") {
				dataItem["pieceTypeInt"]=5;
				dataItem["pieceDes"] =Piece.IS_Repeat+" X "+Piece.IS_Interval+" strokes";
			}else{
				dataItem["pieceTypeInt"]=0;
				
				dataItem["pieceDes"] =Piece.IS_Repeat+" X "+Piece.IS_Interval;
			}
		}else{
			dataItem["pieceTypeInt"]=0;
			dataItem["pieceType"] = "not defined";
		}
		results.resultsDisply();
	}

	function intervalSetUp(data){
		  // sets up app for interval set
		iType= data.IntervalType;
		rType = data.RestType;

		if( iType === "Time") {
			intervalTime=(parseInt(data.IS_Interval));
			$('#timeTarget').text(millisecondsToString(parseInt(data.IS_Interval)));
			$('#time').text(millisecondsToString(parseInt(data.IS_Interval)));
		  }
		  else if( iType === "Distance") {
			  intervalDistance =parseInt(data.IS_Interval);
			  $('#distanceTarget').text(data.IS_Interval+"m");
			  $('#timeTarget').text("");
		  }
		  else if( iType === "Stroke") {
			ScType=true;
			intervalSCount = parseInt(data.IS_Interval);
			$('#timeTarget').text("");
		  }
			else{
		  }
		  if( rType === "Time") {
			intervalRestTime=(parseInt(data.IS_Rest));
  
		  }
		  else if( rType === "Distance") {
			intervalRestDistance=(parseInt(data.IS_Rest));
  
		  }
		  else if( rType === "Stroke") {
			intervalRestSCount   = parseInt(data.IS_Rest);
		  }
			else{
		  }
		  intervalRepeat = (parseInt(data.IS_Repeat));
		  count = intervalRepeat;
		  showInfo();
	}

	function clearTargetData() {
		$('#distanceTarget').text("");
		$('#strokeTarget').text("");
		$('#timeTarget').text("");
		$('#heartTarget').text("");
		$('#splitTarget').text("");
	}
	function clearData() {
		$('#time').text("0:00:00");
		$('#distanceTraveled').text("0");
		$('#heartRate').text("--");
		$('#strokeCount').text("");
		$('#split').text("--");
	}
	function paddleMode () {
	}

	function showDialog(options, function1, function2) {
		var dialog = $("#dialog");
		// Set defaults.
		var settings = $.extend({
			heading		: "",
			content		: "",
			btnOptions  : "none",
			mode		: "go",
			restTime	: 10000,
			intervalTime: 20000
			
			}, options);
		// Set the text
		dialog.find(".heading").text(settings.heading);
		dialog.find(".content").text(settings.content);
		
		$("#dialog,#mask").fadeIn();

		if(options.mode === "go"){
			if((pieceTypeInt===1)||(pieceTypeInt===2)||(pieceTypeInt===6)) {
				document.getElementById('time').innerHTML =  millisecondsToString(targetTime);
				setTimeout(function(){
					rData.setGuiEvent("PSTR");
				},4000);
				
			}else{
			}
			setTimeout(function(){dialog.find(".heading").text("Piece Start in 4")},1000);
			setTimeout(function(){dialog.find(".heading").text("Piece Start in 3")},2000);
			setTimeout(function(){dialog.find(".heading").text("Piece Start in 2")},3000);
			setTimeout(function(){dialog.find(".heading").text("Piece Start in 1")},4000);
			setTimeout(function(){
			$("#dialog ,#mask").fadeOut();
				pieceStart(pieceTypeInt);
			},4000);
		}
		if(options.mode === "cancel"){
			setTimeout(function() {
				$("#dialog ,#mask").fadeOut();
			},2000 );
		}
		if(options.mode === "quota"){
			setTimeout(function() {
				$("#dialog ,#mask").fadeOut();
			},10000 );
		}
		if(options.mode === "ISTime"){
				$('#progressbar').progressbar("option","disabled",false);
				stateRest = true;
				clearInterval(interval);
				interval = setInterval( function() {
					var intActTime = rData.getRestTimeTotal();
					var pcent = intActTime / intervalRestTime;
					$('#progressbar').progressbar({ value: pcent*100});
					var timeRemaining =Math.round((intervalRestTime-intActTime)/1000);
					if((pcent >= 0.5)&& (timeRemaining >= 2 )){
						dialog.find(".heading").text("ReStart in "+timeRemaining+" sec")
					}
					if((pcent >= 0.95) && (timeRemaining < 2 )) {
						// display fades out 2 secons before rest complete
						$("#dialog ,#mask").fadeOut();
					}
					if(intervalRestTime <= intActTime) {
						stateRest = false;
						clearInterval( interval );
						$("#dialog ,#mask").fadeOut();
						$('#progressbar').progressbar({ value: 0});
						rData.setGuiEvent( "ISTP");
						pieceStart(pieceTypeInt);
						dataItem["paID"]=txData.generateUUID();
						rData.setPAID(dataItem["paID"]);
					}
					if(statusItem["pieceState"] == "STOP"){
						stateRest = false;
						rData.setGuiEvent( "IEND");
						dataItem['pieceState']="READY";
						dataItem["paID"]=0;
                        rData.setPAID(dataItem["paID"]);
						//count = intervalReapeat;
						clearInterval( interval );
						$("#dialog ,#mask").fadeOut();
						$('#progressbar').progressbar({ value: 0});
						doReady();
					}
				},100);
		}
		
		if(options.mode === "ISDistance"){
			$('#progressbar').progressbar("option","disabled",false);
			stateRest = true;
			clearInterval(interval);
			interval = setInterval( function() {
				var intActDist = rData.getRestDistanceTotal();
				var pcent = intActDist / intervalRestDistance;
				var distanceRemaining =Math.round( intervalRestDistance - intActDist);
				$('#progressbar').progressbar({ value: pcent*100});
				if((pcent >= 0.5)&& (distanceRemaining >= 10 )){
					dialog.find(".heading").text("ReStart in "+distanceRemaining+" m")
				}
				if((pcent >= 0.95) && (distanceRemaining < 10 )) {
					//Display fades out 30 m before rest complete
					$("#dialog ,#mask").fadeOut();
				}
				if(intervalRestDistance <= intActDist) {
					clearInterval( interval );
					stateRest = false;
					$("#dialog ,#mask").fadeOut();
					$('#progressbar').progressbar({ value: 0});
					rData.setGuiEvent( "ISTP");
					pieceStart(pieceTypeInt);
					dataItem["paID"]=txData.generateUUID();
					rData.setPAID(dataItem["paID"]);
				}
				if(statusItem["pieceState"]=="STOP"){
						stateRest = false;
						rData.setGuiEvent( "IEND");
						dataItem['pieceState']="READY";
						dataItem["paID"]=0;
						rData.setPAID(dataItem["paID"]);
						//count = intervalReapeat;
						clearInterval( interval );
						$("#dialog ,#mask").fadeOut();
						$('#progressbar').progressbar({ value: 0});
						doReady();
						
					}
			},100);
		}
		if(options.mode === "ISCount"){

			$('#progressbar').progressbar("option","disabled",false);
			stateRest = true;
			clearInterval(interval);
			interval = setInterval( function() {
				var intActSCount = rData.getRestStrokeCountTotal();
				var pcent = intActSCount / intervalRestSCount;
				var strokeCountRemaining =Math.round( intervalRestSCount - intActSCount);
				$('#progressbar').progressbar({ value: pcent*100});
				if((pcent >= 0.5)&& (strokeCountRemaining >= 1 )){
					dialog.find(".heading").text("ReStart in "+strokeCountRemaining+" stks");
				}
				if((pcent >= 0.95) && (strokeCountRemaining < 1 )) {
					//Display fades out 30 m before rest complete
					$("#dialog ,#mask").fadeOut();
				}
				if(intervalRestSCount <= intActSCount){
					clearInterval( interval );
					stateRest = false;
					$("#dialog ,#mask").fadeOut();
					$('#progressbar').progressbar({ value: 0});
					rData.setGuiEvent( "ISTP");
					pieceStart(pieceTypeInt);
					dataItem["paID"]=txData.generateUUID();
					rData.setPAID(dataItem["paID"]);
				}
				if(statusItem["pieceState"] == "STOP"){
						clearInterval( interval );
						stateRest = false;
						rData.setGuiEvent( "IEND");
						$("#dialog ,#mask").fadeOut();
						$('#progressbar').progressbar({ value: 0});
						dataItem['pieceState']="READY";
						dataItem["paID"]=0;
						rData.setPAID(dataItem["paID"]);
						//count = intervalReapeat;
						doReady();
					}
			},100);
		}
	// btn options
		if(options.btnOptions === "none") {
			dialog.find("#pauseDefault").hide();
			dialog.find("#pauseOption").hide();
		}
		else if (options.btnOptions === "default") {
			dialog.find("#pauseDefault").hide();
			dialog.find("#pauseOption").show();
		}
		else {
			dialog.find("#pauseOption").hide();
			dialog.find("#pauseDefault").show();
		}
		dialog.find("#pausedP").on("click", function(e) {
			e.stopPropagation();
			e.preventDefault();
			dialog.find(".heading").text("Pause");
			dialog.find("#pauseOption").show();
			dialog.find("#pauseDefault").hide();
			rData.setGuiEvent( "PAUS" );
		});
		dialog.find("#resumeP").on("click", function(e) {
			e.stopPropagation();
			e.preventDefault();
			if (stateRest) {
				dialog.find(".heading").text("REST");
				dialog.find("#pauseOption").hide();
				dialog.find("#pauseDefault").show();
				rData.setGuiEvent( "CONT" );
			}else {
				$("#dialog,#mask").fadeOut();
				rData.setGuiEvent( "CONT" );
			}
		});
		dialog.find("#cancelP").on("click", function(e) {
			e.stopPropagation();
			e.preventDefault();
			$("#dialog,#mask").fadeOut();
			if((pieceTypeInt == 1)||(pieceTypeInt == 2)){
				rData.setGuiEvent( "PEND" );
				$('#pause').hide();
				$('#go').show();
				$('#mySession').removeClass('ui-disabled');
			}else{
				rData.setGuiEvent( "IEND" );
				count = intervalRepeat;
				$('#strokeElement').hide();
				$('#timeElement').show();
				$('#pause').hide();
				$('#go').show();
				$('#mySession').removeClass('ui-disabled');
			}
		});
	}//show dialog
	
	function clearDialog () {
		$("#dialog ,#mask").fadeOut();
	}
	function resumedPause() {
		$('#pause').show();
		$('#go').hide();
	}
	function canceledPause() {
		$('#pause').hide();
		$('#go').show();
		$('#mySession').removeClass('ui-disabled');
	}
	function cancelStrokeDisplay() {
	}
	//both show dialog
	function clickedOk() {
		//pauseGUI ();
		$('#id').hide();
	}
	function clickedCancel() {
		//alert("Clicked Cancel!");
	}
	// clearDialog is the trigger for start piece
	
	function pieceStart(pieceTypeInt){
		/*
		* PiectTypeInt 0 warm up Distance starts at 0m increases Time Starts at 0 increases
		* pieceTypeInt 1 TIME	 starts at Target decreases Distance starts at 0 increases
		* pieceTypeInt 2 DISTANCE Time starts at 0 increases target distance decreases
		* pieceTypeInt 3 IntervalSet Time 
		* pieceTypeInt 4 IntervalSet Distance
		* pieceTypeInt 5 IntervalSet Stroke  
		*/	
		
		//dataItem["uuid"] = dataItem["base_uuid"]+new Date();
		//rData.setSavingUUID(dataItem["uuid"]);
		//var an = rData.getSavingUUID();
		cData.setPieceTypeInt(pieceTypeInt);
		var datetimeStamp;
		// warmup
		if(pieceTypeInt === 0) {
			datetimeStamp = new Date();
			statusItem["keyID"] = dataItem["Piece_Id"]+"%"+datetimeStamp+"£";
			warmup();
		}
		//single piece time
		else if( pieceTypeInt === 1) {
			dDistance.text(0);
			datetimeStamp = new Date();
			statusItem["keyID"] = dataItem["Piece_Id"]+"%"+datetimeStamp+"£";
			dataItem["type"]="PT";
			rData.setTYPE(dataItem["type"]);
			rData.setIDX(0);
			pieceTime(targetTime);
		}
		
		//single piece distance
		else if( pieceTypeInt === 2) {
			dTime.text("0:00:00");
			datetimeStamp = new Date();
			statusItem["keyID"] = dataItem["Piece_Id"]+"%"+datetimeStamp+"£";
			dataItem["type"]="PD";
			rData.setTYPE(dataItem["type"]);
			rData.setIDX(0);
			pieceDistance(targetDistance);
		}
		// Interval Set Time
		else if( pieceTypeInt === 3) {
			dataItem["type"]="IT";
			rData.setTYPE(dataItem["type"]);
			rData.setIDX(0);
			ISet("Time");
		}
		// Interval Set Distance
		else if( pieceTypeInt === 4) {
			dataItem["type"]="ID";
			rData.setTYPE(dataItem["type"]);
			rData.setIDX(0);
			ISet("Distance");
		}
		// Interval Set StrokeCount
		else if( pieceTypeInt === 5) {
			dataItem["type"]="IS";
			rData.setTYPE(dataItem["type"]);
			rData.setIDX(0);
			ISet("StrokeCount");
		}
		else{
			//tbd
		}
	}
	// warmup
	function warmup() {
		clearInterval(interval);
		var distanceInit = rData.getPieceDistanceTotal();
		var checkTime = rData.getPieceTimeTotal();
		interval = setInterval( function() {
			
			dTime.text(millisecondsToString(rData.getPieceTimeTotal()));
			dDistance.text(Math.abs(Math.round(distanceInit-rData.getPieceDistanceTotal())));
			var strokerate = rData.getStrokeRate();
			if(strokerate >= 0){
				dStrokeRate.text(Math.round(strokerate));
			}else{
				dStrokeRate.text("--");
			}
			
			dStrokeCount.text(rData.getPieceStrokeCountTotal());
			var locAccuracy = rData.getAccuracy();
			if(locAccuracy < geolocAccuracy){
				dLocAccuracy.text(Math.round(rData.getAccuracy()));
			}else{
				dLocAccuracy.text("--");
			}
			
			dHeartRate.text(rData.getHeartRate());
			var velocity = rData.getSplitTime();
			if(velocity) {
				velocity = velocity.toFixed(3);
			}else{
				velocity = 0;
			}
			
			if(rData.getSpeed()!= "--"){
				splitTime = rData.getSpeed().toFixed(2)*1000;
				
				splitTime= millisecondsToString(splitTime);
			}else {
				splitTime="--";
			}
			dSplit.text(splitTime);
			
			if(rData.getGuiEvent() == "PEND") {
				clearInterval(interval);
				statusItem["pieceState"] = "READY";
				//rData.setGuiEvent( "PIDLE" );
				doReady();
			}else if(statusItem["pieceState"] == "STOP"){
				clearInterval(interval);
				statusItem["pieceState"] = "READY";
				doReady();
			}
			if(rData.getPieceTimeTotal() > statusItem["paddleTimeLimit"] ){
				if(navigator.notification){
					navigator.notification.alert(
						'Your paddle session taken too Long',
						paddleMsgDismissed,
						'Message',
						'Ok'
					);
				}else{
					alert("Your Paddle Session Taken too Long");
				}
				clearInterval(interval);
				rData.setGuiEvent( "PEND");
				dataItem['pieceState']="READY";
				dataItem["paID"]=0;
                rData.setPAID(dataItem["paID"]);
				doReady();
			}
		},100);
	}
	function paddleMsgDismissed(){
		$.mobile.changePage( "#controlPage",{
			transition: "none",
			reverse: true,
			changeHash: true
		});
		
	}
	
	function pieceTime(dTimeTarget) {
		clearInterval(interval);
		var distanceInit = rData.getPieceDistanceTotal();
		interval = setInterval( function() {
			
			var dTimeRData = rData.getPieceTimeTotal();
			var displayT = parseInt( dTimeTarget - dTimeRData );
			// Display Data
			dTime.text( millisecondsToString(displayT) );
			dDistance.text(Math.abs(Math.round(distanceInit - rData.getPieceDistanceTotal())));
			
			var strokerate = rData.getStrokeRate();
			if(strokerate >= 0){
				dStrokeRate.text(Math.round(strokerate));
			}else{
				dStrokeRate.text("--");
			}
			//dStrokeRate.text(Math.round( rData.getStrokeRate()) );
			dStrokeCount.text( rData.getPieceStrokeCountTotal() );
			var locAccuracy = rData.getAccuracy();
			if(locAccuracy < geolocAccuracy){
				dLocAccuracy.text(Math.round(rData.getAccuracy()));
			}else{
				dLocAccuracy.text("--");
			}
			dHeartRate.text(rData.getHeartRate());
			if(rData.getSpeed()!= "--"){
				splitTime = rData.getSpeed().toFixed(2)*1000;
				
				splitTime= millisecondsToString(splitTime);
			}else {
				splitTime="--";
			}
			dSplit.text(splitTime);
			//dHeartRate.text( rData.getHeartRate() );
			
			if(displayT <= 0) {
				rData.setGuiEvent( "PEND");
				//rData.setGuiEvent( "PIDLE" );
				dataItem["paID"]=0;
				dataItem["type"]="";
				rData.setPAID(dataItem["paID"]);
				rData.setTYPE(dataItem["type"]);
				rData.setIDX(0);
				showDialog( {heading: "Complete", mode: "cancel"});
				clearInterval(interval);
				statusItem["pieceState"] = "READY";
				doReady();

			}else if(statusItem["pieceState"]=="STOP"){
				clearInterval(interval);
				statusItem["pieceState"] = "READY";
				doReady();
			}
		},100);
	}
	function pieceDistance(dDistanceTarget) {
		clearInterval(interval);
		var distanceInit = rData.getPieceDistanceTotal();
		interval = setInterval( function() {
			
			var dDistanceRData = Math.abs(distanceInit-rData.getPieceDistanceTotal());
			var displayD = parseInt( dDistanceTarget - dDistanceRData );
			dTime.text( millisecondsToString( rData.getPieceTimeTotal() ) );
			dDistance.text( Math.round(displayD) );
			var strokerate = rData.getStrokeRate();
			if(strokerate >= 0){
				dStrokeRate.text(Math.round(strokerate));
			}else{
				dStrokeRate.text("--");
			}
			
			//dStrokeRate.text( Math.round(rData.getStrokeRate()) );
			dStrokeCount.text( rData.getPieceStrokeCountTotal() );
			var locAccuracy = rData.getAccuracy();
			if(locAccuracy < geolocAccuracy){
				dLocAccuracy.text(Math.round(rData.getAccuracy()));
			}else{
				dLocAccuracy.text("--");
			}
			
			dHeartRate.text(rData.getHeartRate());
			if(rData.getSpeed()!= "--"){
				splitTime = rData.getSpeed().toFixed(2)*1000;
				
				splitTime= millisecondsToString(splitTime);
			}else {
				splitTime="--";
			}
			dSplit.text(splitTime);
			
			//dHeartRate.text( rData.getHeartRate() );
			
			if( displayD <= 0 ) {
				rData.setGuiEvent( "PEND" );
				//rData.setGuiEvent( "PIDLE" );
				dataItem["paID"]=0;
				dataItem["type"]="";
				rData.setPAID(dataItem["paID"]);
				rData.setTYPE(dataItem["type"]);
				rData.setIDX(0);
				showDialog( {heading: "Complete", mode: "cancel"});
				clearInterval(interval);
				statusItem["pieceState"] = "READY";
				doReady();
			}else if(statusItem["pieceState"] == "STOP"){
				clearInterval(interval);
				statusItem["pieceState"] = "READY";
				doReady();
			}
			
		},100);
	}
	// for future use
	function pieceStrokeCount( dSCountTarget ) {
		rData.setGuiEvent( GUIEvent );
		clearInterval(interval);
		var distanceInit = rData.getPieceDistanceTotal();
		interval = setInterval( function() {
			
			var dSCountRData = rData.getPieceStrokeCountTotal();
			var displaySCount = parseInt( dSCountTarget - dSCountRData );
			dTime.text(millisecondsToString( rData.getPieceTimeTotal() ));
			dDistance.text( Math.round(rData.getPieceDistanceTotal()) );
			var strokerate = rData.getStrokeRate();
			if(strokerate >= 0){
				dStrokeRate.text(Math.round(strokerate));
			}else{
				dStrokeRate.text("--");
			}
			
			//dStrokeRate.text( Math.round( rData.getStrokeRate() ) );
			dStrokeCount.text( rData.getPieceStrokeCountTotal() );
			dStroke.text( displaySCount );
			var locAccuracy = rData.getAccuracy();
			if(locAccuracy < geolocAccuracy){
				dLocAccuracy.text(Math.round(rData.getAccuracy()));
			}else{
				dLocAccuracy.text("--");
			}
			dHeartRate.text(rData.getHeartRate());
			if(rData.getSpeed()!= "--"){
				splitTime = rData.getSpeed().toFixed(2)*1000;
				
				splitTime= millisecondsToString(splitTime);
			}else {
				splitTime="--";
			}
			dSplit.text(splitTime);
			if(statusItem["pieceState"] == "STOP"){
				clearInterval(interval);
				statusItem["pieceState"] = "READY";
				//statusitem["keyID"] = "recovery";
				doReady();
			}else if(displaySCount <= 0) {
				rData.setGuiEvent( "ISTP" );
				dataItem["paID"]=txData.generateUUID();
				dataItem["type"]="";
				rData.setPAID(dataItem["paID"]);
				rData.setTYPE(dataItem["type"]);
				rData.setIDX(0);
				showDialog( {heading: "Complete", mode: "cancel"} );
				clearInterval(interval);
				statusItem["pieceState"] = "READY";
				//statusitem["keyID"] = "recovery";
				doReady();
			}

		},100);
	}
	// Interval Set
	function ISet( dType ) {
		var datetimeStamp = new Date();
		statusItem["keyID"] = dataItem["Piece_Id"]+"%"+datetimeStamp+"£";
		if(dType === "Time") {
			rData.setGuiEvent( "ISTR",count);
			count --;
			clearInterval(interval);
			var distanceInit = rData.getPieceDistanceTotal();
			interval = setInterval( function() {
				var dTimeRData=rData.getIntervalTimeTotal();
				var displayT =parseInt( intervalTime - dTimeRData );
				dTime.text( millisecondsToString( displayT ) );
				dDistance.text(Math.abs(Math.round(distanceInit - rData.getPieceDistanceTotal())));
				
				var strokerate = rData.getStrokeRate();
				if(strokerate >= 0){
					dStrokeRate.text(Math.round(strokerate));
				}else{
					dStrokeRate.text("--");
				}
				//dStrokeRate.text( Math.round ( rData.getStrokeRate() ) );
				dStrokeCount.text( rData.getIntervalStrokeCountTotal() );
				var locAccuracy = rData.getAccuracy();
				if(locAccuracy < geolocAccuracy){
					dLocAccuracy.text(Math.round(rData.getAccuracy()));
				}else{
					dLocAccuracy.text("--");
				}
				dHeartRate.text(rData.getHeartRate());
				if(rData.getSpeed()!= "--"){
					splitTime = rData.getSpeed().toFixed(2)*1000;
				
					splitTime= millisecondsToString(splitTime);
				}else {
					splitTime="--";
				}
				dSplit.text(splitTime);
				if(statusItem["pieceState"] == "STOP"){
					clearInterval(interval);
					rData.setGuiEvent( "IEND");
					dataItem["paID"]=0;
					dataItem["type"]="";
					rData.setPAID(dataItem["paID"]);
					rData.setTYPE(dataItem["type"]);
					rData.setIDX(0);
					count = intervalRepeat;
					statusItem["pieceState"] = "READY";
					//statusItem["keyID"] = "recovery";
					doReady();

				}else if(displayT <= 0) {
					rData.setGuiEvent( "ISTP" );
					clearInterval( interval );
					dataItem["paID"]=txData.generateUUID();
					rData.setPAID(dataItem["paID"]);
					if ((count >= 1)&&(rType == "Time")){
						dataItem["type"]="RT";
						rData.setTYPE(dataItem["type"]);
						rData.setIDX(0);
						showDialog( {heading: "Rest",
								content: "",
								mode: "ISTime",
								restTime:intervalRestTime
								});
						showInfo();
					}else if ((count >= 1)&&(rType == "Distance")){
						dataItem["type"]="RD";
						rData.setTYPE(dataItem["type"]);
						rData.setIDX(0);
						showDialog( {heading: "Rest",
								content: "",
								mode: "ISDistance",
								restTime:intervalRestDistance
								});
						showInfo();
					}else if ((count >= 1)&&(rType == "Stroke")){
						dataItem["type"]="RS";
						rData.setTYPE(dataItem["type"]);
						rData.setIDX(0);
						showDialog( {heading: "Rest",
									content: "",
									mode: "ISCount",
									restTime:intervalRestSCount
									});
						showInfo();
					}else{
						rData.setGuiEvent( "IEND");
						dataItem["paID"]=0;
						dataItem["type"]="";
						rData.setPAID(dataItem["paID"]);
						rData.setTYPE(dataItem["type"]);
						rData.setIDX(0);
						count = intervalRepeat;
						showDialog( {heading: "Complete", mode: "cancel"}, clickedOk);
						statusItem["pieceState"] = "READY";
						//statusItem["keyID"] = "recovery";
						doReady();
					}
				}
			},100);
		
		}else if(dType === "Distance") {
			rData.setGuiEvent( "ISTR",count);
			count --;
			clearInterval(interval);
			interval = setInterval( function() {
				var dDistanceRData=rData.getIntervalDistanceTotal();
				var displayD =parseInt(intervalDistance - dDistanceRData);
				dTime.text(millisecondsToString(rData.getIntervalTimeTotal()));
				dDistance.text(Math.round(displayD));
				var strokerate = rData.getStrokeRate();
				if(strokerate >= 0){
					dStrokeRate.text(Math.round(strokerate));
				}else{
					dStrokeRate.text("--");
				}
				
				//dStrokeRate.text( Math.round (rData.getStrokeRate() ));
				dStrokeCount.text(rData.getIntervalStrokeCountTotal());
				var locAccuracy = rData.getAccuracy();
				if(locAccuracy < geolocAccuracy){
					dLocAccuracy.text(Math.round(rData.getAccuracy()));
				}else{
					dLocAccuracy.text("--");
				}
				dHeartRate.text(rData.getHeartRate());
				if(rData.getSpeed()!= "--"){
					splitTime = rData.getSpeed().toFixed(2)*1000;
				
					splitTime= millisecondsToString(splitTime);
				}else {
					splitTime="--";
				}
				dSplit.text(splitTime);
				
				//dHeartRate.text(rData.getHeartRate());
				
				if(statusItem["pieceState"] == "STOP"){
					clearInterval(interval);
					rData.setGuiEvent( "IEND");
					dataItem["paID"]=0;
					dataItem["type"]="";
					rData.setPAID(dataItem["paID"]);
					rData.setTYPE(dataItem["type"]);
					rData.setIDX(0);
					count = intervalRepeat;
					statusItem["pieceState"] = "READY";
					//statusitem["keyID"] = "recovery";
					doReady();
				}else if( displayD <= 0 ) {
					rData.setGuiEvent( "ISTP");
					dataItem["paID"]=txData.generateUUID();
                    rData.setPAID(dataItem["paID"]);
					clearInterval(interval);
					if ((count >= 1)&&(rType == "Time")){
						dataItem["type"]="RT";
						rData.setTYPE(dataItem["type"]);
						rData.setIDX(0);
						showDialog( {heading: "Rest",
								content: "",
								mode: "ISTime",
								restTime:intervalRestTime
								});
						showInfo();
					}else if ((count >= 1)&&(rType == "Distance")){
						dataItem["type"]="RD";
						rData.setTYPE(dataItem["type"]);
						rData.setIDX(0);
						showDialog( {heading: "Rest",
								content: "",
								mode: "ISDistance",
								restTime:intervalRestDistance
								});
						showInfo();
					}else if ((count >= 1)&&(rType == "Stroke")){
						dataItem["type"]="RS";
						rData.setTYPE(dataItem["type"]);
						rData.setIDX(0);
						showDialog( {heading: "Rest",
									content: "",
									mode: "ISCount",
									restTime:intervalRestSCount
									});
						showInfo();
					}else{
						rData.setGuiEvent( "IEND");
						dataItem["paID"]=0;
						dataItem["type"]="";
						rData.setPAID(dataItem["paID"]);
						rData.setTYPE(dataItem["type"]);
						rData.setIDX(0);
						canceledPause();
						count = intervalRepeat;
						showDialog( {heading: "Complete", mode: "cancel"}, clickedOk);
						statusItem["pieceState"] = "READY";
						//statusItem["keyID"] = "recovery";
						doReady();
					}
				}
			},100);
			
		}else if(dType === "StrokeCount") {
			rData.setGuiEvent( "ISTR",count);
			$('#timeElement').hide();
			$('#strokeElement').show();
			count --;
			var distanceInit = rData.getPieceDistanceTotal();
			
			clearInterval(interval);
			interval = setInterval( function() {
				var dSCountRData = rData.getIntervalStrokeCountTotal();
				var displaySC = parseInt(intervalSCount - dSCountRData);
				dTime.text(millisecondsToString(rData.getIntervalTimeTotal()));
				dDistance.text(Math.abs(Math.round(distanceInit - rData.getPieceDistanceTotal())));
				//dDistance.text( Math.round(rData.getPieceDistanceTotal()));
				
				var strokerate = rData.getStrokeRate();
				if(strokerate >= 0){
					dStrokeRate.text(Math.round(strokerate));
				}else{
					dStrokeRate.text("--");
				}
				//dStrokeRate.text(Math.round ( rData.getStrokeRate() ));
				dStrokeCount.text(rData.getIntervalStrokeCountTotal());
				var locAccuracy = rData.getAccuracy();
				if(locAccuracy < geolocAccuracy){
					dLocAccuracy.text(Math.round(rData.getAccuracy()));
				}else{
					dLocAccuracy.text("--");
				}
				dHeartRate.text(rData.getHeartRate());
				dStroke.text(displaySC);
				
				if(rData.getSpeed()!= "--"){
					splitTime = rData.getSpeed().toFixed(2)*1000;
				
					splitTime= millisecondsToString(splitTime);
				}else {
					splitTime="--";
				}
				dSplit.text(splitTime);
				if(statusItem["pieceState"] == "STOP"){
					clearInterval(interval);
					rData.setGuiEvent( "IEND");
					dataItem["paID"]=0;
					dataItem["type"]="";
					rData.setPAID(dataItem["paID"]);
					rData.setTYPE(dataItem["type"]);
					rData.setIDX(0);
					count = intervalRepeat;
					statusItem["pieceState"] = "READY";
					doReady();
				}else if(displaySC <= 0) {
					rData.setGuiEvent( "ISTP");
					dataItem["paID"]=txData.generateUUID();
					rData.setPAID(dataItem["paID"]);
					clearInterval(interval);
					//interval=0;
					if ((count >= 1)&&(rType == "Time")){
						dataItem["type"]="RT";
						rData.setTYPE(dataItem["type"]);
						rData.setIDX(0);
						showDialog( {heading: "Rest",
								content: "",
								mode: "ISTime",
								restTime:intervalRestTime
								});
						showInfo();
					}else if ((count >= 1)&&(rType == "Distance")){
						dataItem["type"]="RD";
						rData.setTYPE(dataItem["type"]);
						rData.setIDX(0);
						showDialog( {heading: "Rest",
								content: "",
								mode: "ISDistance",
								restTime:intervalRestDistance
								});
						showInfo();
					}else if ((count >= 1)&&(rType == "Stroke")){
						dataItem["type"]="RS";
						rData.setTYPE(dataItem["type"]);
						rData.setIDX(0);
						showDialog( {heading: "Rest",
								content: "",
								mode: "ISCount",
								restTime:intervalRestSCount
								});
						showInfo();
					}else{
						rData.setGuiEvent( "IEND");
						dataItem["paID"]=0;
						dataItem["type"]="";
						rData.setPAID(dataItem["paID"]);
						rData.setTYPE(dataItem["type"]);
						rData.setIDX(0);
						canceledPause();
						count = intervalRepeat;
						$('#timeElement').show();
						$('#strokeElement').hide();
						showDialog( {heading: "Complete", mode: "cancel"}, clickedOk);
						statusItem["pieceState"] = "READY";
						//statusItem["keyID"] = "recovery";
						doReady();
					}
				}
			},100);
		}
	}
	
	
	
	// display of interval data
	function showInfo(){
		var countNo =(intervalRepeat-count+1);	
		$('#intervalContainer').show();
		if(iType == "Time") {
			intervalData = millisecondsToString(intervalTime);
		}else if(iType == "Distance") {
			intervalData = intervalDistance+" m";
		}else if(iType == "Stroke") {
			intervalData = intervalSCount+" stks";
		}
		if(rType == "Time") {
			restData = millisecondsToString(intervalRestTime);
		}else if(rType == "Distance") {
			restData = intervalRestDistance+" m";
		}else if(rType == "Stroke") {
			restData = intervalRestSCount+" stks";
		}
		
		$('#intervalLegent').text(countNo+" of "+
		intervalRepeat+
		"  -On- "+
		intervalData+
		"  -Rest- "+
		restData);

	}
	
	function SHA256(s){
    var chrsz   = 8;
    var hexcase = 0;
    function safe_add (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
    function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
    function R (X, n) { return ( X >>> n ); }
    function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
    function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
    function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
    function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
    function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
    function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
 
    function core_sha256 (m, l) {
        var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
        var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
        var W = new Array(64);
        var a, b, c, d, e, f, g, h, i, j;
        var T1, T2;
 
        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >> 9) << 4) + 15] = l;
 
        for ( var i = 0; i<m.length; i+=16 ) {
            a = HASH[0];
            b = HASH[1];
            c = HASH[2];
            d = HASH[3];
            e = HASH[4];
            f = HASH[5];
            g = HASH[6];
            h = HASH[7];
            for ( var j = 0; j<64; j++) {
                if (j < 16) W[j] = m[j + i];
                else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
                T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                T2 = safe_add(Sigma0256(a), Maj(a, b, c));
                h = g;
                g = f;
                f = e;
                e = safe_add(d, T1);
                d = c;
                c = b;
                b = a;
                a = safe_add(T1, T2);
            }
 
            HASH[0] = safe_add(a, HASH[0]);
            HASH[1] = safe_add(b, HASH[1]);
            HASH[2] = safe_add(c, HASH[2]);
            HASH[3] = safe_add(d, HASH[3]);
            HASH[4] = safe_add(e, HASH[4]);
            HASH[5] = safe_add(f, HASH[5]);
            HASH[6] = safe_add(g, HASH[6]);
            HASH[7] = safe_add(h, HASH[7]);
        }
        return HASH;
    }
 
    function str2binb (str) {
        var bin = new Array();
        var mask = (1 << chrsz) - 1;
        for(var i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
        }
        return bin;
    }
 
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    }
 
    function binb2hex (binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for(var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
            hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
        }
        return str;
    }
 
    s = Utf8Encode(s);
    return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
 
}
	// Utility functions
	// used to co-ordiunate date format to web rest call
	function formattedDate(date) {
		  var d = new Date(date || Date.now()),
			  month = '' + (d.getMonth() + 1),
			  day = '' + d.getDate(),
			  year = d.getFullYear();
		  if (month.length < 2) month = '0' + month;
		  if (day.length < 2) day = '0' + day;		
		  return [year, month, day].join('-');
	}

	// to convert milliseconds to string for display 
	// fractions section currently disabled

	function millisecondsToString(milliseconds) {
		var oneHour = 3600000;
		var oneMinute = 60000;
		var oneSecond = 1000;
		var seconds = 0;
		var minutes = 0;
		var hours = 0;
		var result;
	
		if (milliseconds >= oneHour) {
			hours = Math.floor(milliseconds / oneHour);
		}
	
		milliseconds = hours > 0 ? (milliseconds - hours * oneHour) : milliseconds;
	
		if (milliseconds >= oneMinute) {
			minutes = Math.floor(milliseconds / oneMinute);
		}
	
		milliseconds = minutes > 0 ? (milliseconds - minutes * oneMinute) : milliseconds;
	
		if (milliseconds >= oneSecond) {
			seconds = Math.floor(milliseconds / oneSecond);
		}
	
		milliseconds = seconds > 0 ? (milliseconds - seconds * oneSecond) : milliseconds;
	
		if (hours > 0) {
			result = (hours > 9 ? hours : "0" + hours) + ":";
		} else {
			result = "0:";
		}
	
		if (minutes > 0) {
			result += (minutes > 9 ? minutes : "0" + minutes) + ":";
		} else {
			result += "00:";
		}

		if (seconds > 0) {
			result += (seconds > 9 ? seconds : "0" + seconds);
		} else {
			result += "00";
		}
	
		/*if (milliseconds > 0) {
			result += (milliseconds > 9 ? milliseconds : "0" + milliseconds);
		} else {
			result += "00";
		}*/
	
		return result;
	}

	// used to display rData GUI Event test purpose
	(function displayUpdate() {
		var trigger;
		var rD = setInterval(function() {
			var rdDis= rData.getGuiEvent();
			//$('#messageDis').text(rdDis+" : "+statusItem["pieceState"]);
			if(rdDis == "PSTR"){
				$('#stateDashboard').text("App : Piece Started");//Running
				$('#stateDash').text("Running");
			}else if(rdDis == "PEND"){
				$('#stateDashboard').text("App : Piece Finished");
				trigger = $('#stateDash').text();
				if(trigger !="Done"){
					if(silentmode == "false"){
						navigator.notification.beep(1);
					}
				}
				$('#stateDash').text("Done");
			}else if(rdDis == "ISTR"){
				$('#stateDashboard').text("App : Interval Started");//Running
				$('#stateDash').text("Running");
			}else if(rdDis == "ISTP"){
				$('#stateDashboard').text("App : Interval Rest");//Rest
				$('#stateDash').text("Rest");
			}else if(rdDis == "IEND"){
				$('#stateDashboard').text("App : Interval Finished");//Done
				trigger = $('#stateDash').text();
				if(trigger != "Done"){
					if(silentmode == "false"){
						navigator.notification.beep(1);
					}
				}
				$('#stateDash').text("Done");
			}else if(rdDis == "PAUSE"){
				$('#stateDashboard').text("App : Paused");//Paused
				$('#stateDash').text("Paused");
			}else if(rdDis == "CONT"){
				$('#stateDashboard').text("App : Continue After Pause");//Running
				$('#stateDash').text("Running");
			}
	
			},500);
	})(); 
})(jQuery);//self invoking function 
