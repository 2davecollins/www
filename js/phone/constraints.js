 function Constraints(){
	var constraint = {};
	var dataPrevious = {};
	dataPrevious.time=0;
	dataPrevious.meters=0;
	dataPrevious.strokes=0;
	
	var timeTotalP,meterTotalP,strokeTotalP;
	var timeTotalD,meterTotalD,strokeTotalD;

	var limitReachedP = false;
	var limitReachedD = false;

	var pieceDiveq,pieceTypeInt;

	this.getAtlConstraint = function(){
		return constraint;
	};
	this.getPieceDiveq = function(){
		return pieceDiveq;
	};
	this.getPieceType = function(){
		return pieceTypeInt;
	};
	this.getDemoHtml = function() {
		var html = "<h4>Please Register</h4>";
		
		return html;
	};
	this.getSubscriptionHtml = function() {
		var html = "<p>Thank You For Using RowCatcher</p>"+
				   "<p>You have Exceeded a limit on your Subscription</p>"+
				   "<p>To Continue Please Update your Subscription</p>";
		return html;
	};
	
	
	this.setDailyTotal = function(){
		var balNow = $.jStorage.get("constraint");
		if(balNow){
			timeTotalD   = balNow.time+timeTotalP;
			meterTotalD  = balNow.meters+meterTotalP;
			strokeTotalD = balNow.strokes+strokeTotalP;
		}else{
		}
		this.setNewDailyDate();
	};
	this.setNewDailyDate = function(){
		var bal = {
				"time":timeTotalD,
				"meters":meterTotalD,
				"strokes":strokeTotalD,
				"date":new Date()
			};
		
		$.jStorage.set("constraint",bal);
		
	};
	this.setNewBalance = function(){
		var balNow = $.jStorage.get("constraint");
		var balance = null;
		if(balNow){
			balance = {
				"time":balNow.timeTotalD,
				"meters":balNow.meterTotalD,
				"strokes":balNow.strokeTotalD,
				"date":balNow.date
			};
		}else{
			balance = {
				"time":0,
				"meters":0,
				"strokes":0,
				"date":new Date()
			};
		}
		
		
		$.jStorage.set("constraint",balance);
	};
	
	this.getDefaultQuota = function(){
		var quota = {
			"dailyLimit": {
				"meters": 2000,
				"seconds": 480,
				"strokes": 200
			},
			"pieceLimit": {
				"meters": 400,
				"seconds": 90,
				"strokes": 40
			}
		};
		return quota;
		
	};
	this.isPieceLimitReached = function(data) {
		limitReachedP = false;
		var timeP,meterP,strokeP,timeD,meterD,strokeD;
		if(typeof data.pieceLimit !== "undefined"){
			timeP = data.pieceLimit.seconds;
			meterP = data.pieceLimit.meters;
			strokeP = data.pieceLimit.strokes;
			timeD = data.dailyLimit.seconds;
			meterD = data.dailyLimit.meters;
			strokeD = data.dailyLimit.strokes;
		}else{
			data = this.getDefaultQuota();
			timeP = data.pieceLimit.seconds;
			meterP = data.pieceLimit.meters;
			strokeP = data.pieceLimit.strokes;
			timeD = data.dailyLimit.seconds;
			meterD = data.dailyLimit.meters;
			strokeD = data.dailyLimit.strokes;
		}
		
		var timeLeft = timeP-timeTotalP;
		var meterLeft = meterP-meterTotalP;
		var strokLeft = strokeP-strokeTotalP;
		
		var Now = $.jStorage.get("constraint");
		var timeTotalDBal = parseInt(timeD-Now.time);
		var meterTotalDBal = parseInt(meterD -Now.meters);
		var strokeTotalDBal = parseInt(strokeD - Now.strokes);
		
		if(timeLeft <= 0){
			limitReachedP = true;
			//this.setDailyTotal();
			timeTotalP = meterTotalP = strokeTotalP = 0;
		}
		if(meterLeft <= 0){
			limitReachedP = true;
			//this.setDailyTotal();
			timeTotalP = meterTotalP = strokeTotalP = 0;
		}
		if(strokLeft <= 0){
			limitReachedP = true;
			//this.setDailyTotal();
			timeTotalP = meterTotalP = strokeTotalP = 0;
		}
		
		return limitReachedP;
 	};
	
	this.isDailyLimitReached = function(data) {
		var timeD,meterD,strokeD;
		if(typeof data.dailyLimit != "undefined"){
			timeD = data.dailyLimit.seconds;
			meterD = data.dailyLimit.meters;
			strokeD = data.dailyLimit.strokes;
		}else{
			data = this.getDefaultQuota();
			timeD = data.dailyLimit.seconds;
			meterD = data.dailyLimit.meters;
			strokeD = data.dailyLimit.strokes;
		}
		limitReachedD = false;
		var Now = $.jStorage.get("constraint");
		var timeTotalDBal = parseInt(timeD-Now.time);
		var meterTotalDBal = parseInt(meterD -Now.meters);
		var strokeTotalDBal = parseInt(strokeD - Now.strokes);
		
		if(timeTotalDBal <= 0){
			limitReachedD = true;
		}
		if(meterTotalDBal <= 0){
			limitReachedD = true;
		}
		if(strokeTotalDBal <= 0){
			limitReachedD = true;
		}
		
		return limitReachedD;
 	};
	
	this.setAtlConstraint = function(c){
		constraint = c;
	};
	this.setPieceDiveq = function(pDiveq){
		pieceDiveq = pDiveq;
	};
	this.setPieceTypeInt = function(pType){
		pieceTypeInt = pType;
	};
	
	this.setDataNow = function(dataNow){
		
		if(dataNow){
			timeTotalP  = parseInt(dataNow.time);
			meterTotalP = parseInt(dataNow.meters);
			strokeTotalP = parseInt(dataNow.strokes);
			var balance = $.jStorage.get("constraint");
			if(balance){
				if(dataNow.time <dataPrevious.time ){
					dataPrevious.time =0;
				}
				
				if(dataNow.meters <dataPrevious.meters ){
					dataPrevious.meters =0;
				}
				if(dataNow.strokes <dataPrevious.strokes ){
					dataPrevious.strokes =0;
				}
				timeTotalD   = balance.time   +parseInt(dataNow.time) - dataPrevious.time;
				meterTotalD  = balance.meters +parseInt(dataNow.meters)- dataPrevious.meters;
				strokeTotalD = balance.strokes+parseInt(dataNow.strokes)- dataPrevious.strokes;
				
			}else{
				timeTotalD  = 0;
				meterTotalD = 0;
				strokeTotalD = 0;
			}

			dataPrevious = dataNow;
			this.setNewDailyDate();
			
		}
	};
	this.checklastDownLoad = function(date){
		date = new Date(date);
		var dateNow = new Date();
		var dateDownRef = new Date(dateNow.getFullYear(),dateNow.getMonth(),dateNow.getDate()-21);
		var lastCheck = false;
		if(date < dateDownRef){
			lastCheck = false;
		}else{
			lastCheck = true;
		}
		return lastCheck;
	};
	this.checkSameDay = function(){
		
		var actualDate = new Date().toDateString();
		var balance = $.jStorage.get("constraint");
		var balDate;
		if(balance){
			balDate = balance.date;
			balDate = new Date(balDate);
		}else{
			balDate = new Date();
		}
		 
		var checkDate = balDate.toDateString();
		if(actualDate === checkDate){
			// nothing to do yet
		}else{
			$.jStorage.deleteKey("constraint");
			this.setNewBalance();
		}
	};
}


