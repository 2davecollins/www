var MobilePlatform;

function checkPlatform(){
	if(typeof device != "undefined"){
		MobilePlatform = device.platform;
		if((MobilePlatform == "Win32NT")||(MobilePlatform=="WinCE")){
			MobilePlatform = "Windows8"
		}else{
			MobilePlatform = null;
		}
		
	}else{
		MobilePlatform = null;
	}
	return MobilePlatform;
};


function sendEmail(to,cc,bb,msg,subject){
	//var to_email = ['setup@rowcatcher.com'];
	var to_email = to;
	var cc_email = cc;
	var bb_email = bb;
	window.plugins.socialsharing.shareViaEmail(
		//message
		msg,
		
		//Subject
		subject,
		//to ['email','email'] or null
		to_email, 
		// cc must be null or an array
		cc,
		// bb: must be null or an array
		bb, 
		// url link to attachment null string array
		null,
		//call when sharing worked
		MailSuccess,
		// called when sharing failed
		MailErrorInit 
	);
	
};
$("#sendmail").on("click",function(){
	
	var url = rData.getUrlResult();
	var urlweb = rData.getUrlWebResult();
	var cc_email =null;
	var bb_email = null;
	var to_email = new Array();
	to_email.length = 0;
	var em = rData.getUserEM();
	to_email.push(rData.getUserEM());
	
	var doneOn = rData.getWebResultsDate();
	
	window.plugins.socialsharing.shareViaEmail(
		//message
		'Check This out Results From  '+doneOn+"\n\n"+urlweb+"\n\n"+to_email[0],
		//Subject
		'Rowcatcher Session Result ',
		//to ['email','email'] or null
		to_email, 
		// cc must be null or an array
		cc_email,
		// bb: must be null or an array
		bb_email, 
		// url link to attachment null string array
		url,
		//call when sharing worked
		MailSuccess,
		// called when sharing failed
		MailError 
	);
	
});

$("#feedback").on("click",function(){
	var to_email = ['support@rowcatcher.com'];
	var cc_email =null;
	var bb_email = null;
	var commentfrom = rData.getUserID();
	var appVersion = dataItem["appVers"];
	if(commentfrom == 0){
		commentfrom = ""
	}
	
	var ModelFB = device.model;
	if(ModelFB === null){
		ModelFB = "";
	}
	var CordovaFB = device.cordova;
	if(CordovaFB === null){
		CordovaFB = "";
	}
	var PlatformFB = device.platform;
	if(PlatformFB === null){
		PlatformFB = "";
	}
	var UUIDFB = device.uuid;
	if(UUIDFB === null){
		UUIDFB = "";
	}
	var devVersionFB = device.version;
	if(devVersionFB === null){
		devVersionFB = "";
	}
	
	window.plugins.socialsharing.shareViaEmail(
		//message
		"INFORMATION that will help us interpret your feedback\n==============================\nModel : "+ModelFB+
		"\nCordova : "+	CordovaFB+
		"\nPlatform : "+PlatformFB+
		"\nUUID : "+UUIDFB+
		"\nDevice Version : "+devVersionFB+
		"\nRowcatcher Version : "+appVersion+
		"\nAthleteID :["+commentfrom+"]"+
		"\nYour Comment\n=============================\n\n",
		//Subject
		'Rowcatcher Feedback ',
		//to ['email','email'] or null
		to_email, 
		// cc must be null or an array
		cc_email,
		// bb: must be null or an array
		bb_email, 
		// url link to attachment null string array
		null,
		//call when sharing worked
		MailSuccess,
		// called when sharing failed
		MailError 
	);
	
});


$('#sendTwitter').on("click",function(){
	
	var url = rData.getUrlResult();
	var urlweb = rData.getUrlWebResult();
	var doneOn = rData.getWebResultsDate();
	var msg ="CheckThisOut";
	
	var mobile =  checkPlatform();
	if(mobile == "Windows8"){
		window.plugins.socialsharing.share(msg,'Rowcatcher Result',url,urlweb);
		
	}else{		
		window.plugins.socialsharing.shareViaTwitter(
			// message
			msg,
			url,
			urlweb,
			TwitterSuccess,
			TwitterFail
		);
	}
});
$("#sendFaceBook").on("click",function() {
	var msg ="Facebook";
	var urlweb = rData.getUrlWebResult();
	var url = rData.getUrlResult();
	
	var mobile =  checkPlatform();
	if(mobile == "Windows8"){
		window.plugins.socialsharing.share(msg,'Rowcatcher Result',url,urlweb);
		
	}else{
	
		window.plugins.socialsharing.shareViaFacebook(
			msg,
			null,
			urlweb,
			FaceBookSuccess,
			FaceBookFail
			
		);
	}
	
});

function MailSuccess(){
	navigator.notification.alert(
		'Action Complete',
		alertDismissedSM,
		'Notice',
		'Ok'
	);
}
function MailError() {
		navigator.notification.alert(
		'A Problem Occured trying to send the email. \nPlease ensure you have a valid email app installed on your devise',
		alertDismissedSM,
		'Error !',
		'Ok'
	);
}
function MailErrorInit() {
	var url ="http://rowcatcher.com";
	navigator.notification.alert(
		'Problem sending e-mail \n  go to '+url+ '\nand register' ,
		alertDismissedSM,
		'Error !',
		'Ok'
	);
}
function TwitterSuccess(){
	navigator.notification.alert(
		'Action Complete',
		alertDismissedSM,
		'Notice',
		'Ok'
	);
}
function TwitterFail(){
	navigator.notification.alert(
		'A Problem Occured trying to send the tweet.\nPlease ensure you have a valid twitter app installed on your devise',
		alertDismissedSM,
		'Error !',
		'Ok'
	);
}
function FaceBookSuccess() {
	navigator.notification.alert(
		'Action Complete',
		alertDismissedSM,
		'Notice',
		'Ok'
	);
}
function FaceBookFail(errormsg){
	navigator.notification.alert(
		'A Problem Occured trying to send the post.\nPlease ensure you have a valid Facebook app installed on your devise',
		alertDismissedSM,
		'Error !',
		'Ok'
	);
}

function alertDismissedSM(){
	//tbd
}

//