function targetData(){	
	
	var targetTime=0; 	//single piece time target
	var startTime=0;  	//single piece distance start time	
	var intervalTime=0;	// i9nterval time target
	var restTime=0;		//interval rest time
	var intervalRepeat=0; // interval default
	
	var PieceType=0;
	
	var pauseState;
	var distPause;
	var pause;
	var distanceType;	// true distance false time
	
	
	var q=false;
	
	var targetDistance = 0;
	
	var heartRate = 0;
	var distance = 0;
	var speed = 0;
	var lat = 0;
	var lon = 0;
	var heading = 0;
    var didDataChange = false;
	

	this.getDistanceType = function(){		
		return distanceType;
	};
	this.getPause = function(){		
		return pause;
	};
	this.getTargetTime = function(){		
		return targetTime;
	};
	this.getStartTime = function(){
		return startTime;
	};
	this.getIntervalTime = function(){
		return intervalTime;
	};
	this.getRestTime = function(){
		return intervalTime;
	};
	this.getIntervalRepeat = function(){
		return intervalRepeat;
	};
	this.getTargetDistance = function(){
		return parseInt(targetDistance);
	};
	this.setDistanceType = function(distanceType){
		distanceType = this.distanceType;
	};
	
	this.setPause = function(pauseState){
		pause = pauseState;
	};
	this.setTargetTime = function(time){
		targetTime = parseInt(time);
	};
	this.setStartTime = function(time){
		startTime = time;
        
	};
	this.setIntervalTime = function(time){
		intervalTime = time;
	};
	this.setRestTime = function(time){
		restTime = time;
	};
	this.setIntervalRepeat = function(repeat){
		intervalRepeat = repeat;
	};
	this.setTargetDistance= function(distance){
		targetDistance = distance;
	};
	
	
}

