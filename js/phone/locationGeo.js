document.addEventListener("deviceready",onGeoDeviseReady,false);
var platformTypeLocation;
var geoWatch = null;
var geoWatchFirst = null;

function onGeoDeviseReady() {
	document.addEventListener("pause",onGeoPause,false);
	document.addEventListener("resume",onGeoResume,false);
	//platformTypeLocation = device.platform;
  
  }
  function onGeoPause(){
	  gData.clearWatches();
  }
  function onGeoResume(){
	  setTimeout(function() {
		  gData.startGeoRecord();
	  },100);
  }
  $(document).delegate('#startpage','pagehide', function() {
	  if((geoWatchFirst === null)&&(geoWatch === null)){
		  gData.startGeoRecord();
	  }
  });
  function Geoloc() {
	  
	 // var geoWatchId = null;
	  var geoArray = [];
	  var geoIntervalId = null;
	  var geoOptions = { maximumAge: 0, timeout: 1000, enableHighAccuracy: true };
	  var geoOptions1 = { enableHighAccuracy: true };
	 
	 
	  var startPt = {};
	  var endPt = {};
	  var MinimumAccuracyAllowed = 50;
	  //MaxAccuracyAllowed:70,
	  var locationContinue=null;
	  var timerLocation = 1000;
	  
	  //this.getAtlConstraint = function(){
	  
	  this.startGeoRecord = function(){
		  rData.setAccuracy(0);
		  geoWatchFirst = navigator.geolocation.watchPosition(onFirstGeoPoint,onFirstGeoPointFailure,geoOptions);
	  };
	  var onFirstGeoPointFailure = function(error) {
		  $('#geostatus').text("GPS waiting for position ensure location enabled ");
		  $('#gpsState').text("GPS Searching..");
		   
	   };
	var onNewGeoPointFailure = function(error) {
		$('#geostatus').text("GPS waiting for position ensure location enabled ");
		$('#gpsState').text("GPS Searching..");
		  
		  
		  /*if(platformTypeLocation == "iOS"){
		  	//$('#geostatus').text("GPS waiting for position ensure location enabled ");
		  	//$('#gpsState').text("GPS Searching..");
		  }else{
			$('#geostatus').text("GPS waiting for position ensure location enabled ");
			$('#gpsState').text("GPS Searching..");
		  }*/
		   
	  };
	  this.clearWatches = function (){
		  if(geoWatchFirst !== null) {
			navigator.geolocation.clearWatch(geoWatchFirst);
			geoWatchFirst = null;
		  }
		  if(geoWatch !== null) {
			navigator.geolocation.clearWatch(geoWatch);
			geoWatch = null;
		  }
	  };
	  
	  var onFirstGeoPoint = function(position) {
		$('#geostatus').text("");
		$('#gpsState').text("");

		if(position.coords.accuracy < MinimumAccuracyAllowed ){
			
			startPt.lat = position.coords.latitude;
			startPt.lon = position.coords.longitude;
			startPt.acc = position.coords.accuracy;
			startPt.time = position.timestamp;
			startPt.heading = position.coords.heading;
			startPt.spd = position.coords.speed;
			geoArray.push(startPt);
			  
			  //clears initial watch starts monitoring new watch
			navigator.geolocation.clearWatch(geoWatchFirst);
			geoWatchFirst = null;
			geoWatch = navigator.geolocation.watchPosition(onNewGeoPoint,onNewGeoPointFailure,geoOptions);
  
			}else{
				$('#geostatus').text("GPS Initializing..");
				$('#gpsState').text("GPS Initializing..");
				
				/*if(platformTypeLocation != "iOS"){
		  			$('#geostatus').text("GPS Initializing..");
					$('#gpsState').text("GPS Initializing..");
		  		}*/
			  
			  if(position.coords.accuracy !== null){
				  rData.setAccuracy(position.coords.accuracy);
			  }else{
				  rData.setAccuracy(0);
			  }
		  }
	  };
	  var onNewGeoPoint = function(position) {
		  $('#geostatus').text("");
		  $('#gpsState').text("");
		  if(position.coords.accuracy < MinimumAccuracyAllowed){
			  var newPt ={};
			  newPt.lat = position.coords.latitude;
			  newPt.lon = position.coords.longitude;
			  newPt.acc = position.coords.accuracy;
			  newPt.time = position.timestamp;
			  newPt.heading = position.coords.heading;
			  newPt.spd = position.coords.speed;
			  geoArray.push(newPt);
			  geoUpdateRData();
		  }else{
			$('#geostatus').text("GPS Initializing..");
			$('#gpsState').text("GPS Initializing..");
			  
			  /*if(platformTypeLocation != "iOS"){
		  			$('#geostatus').text("GPS Initializing..");
					$('#gpsState').text("GPS Initializing..");
		  		}*/
			  if(position.coords.accuracy !== null){
				  rData.setAccuracy(position.coords.accuracy);
			  }else{
				  rData.setAccuracy(0);
			  }
		  }
		  while(geoArray.length > 4){
				  geoArray.shift();
		  }
	  };
	  
	  var geoUpdateRData = function(){
		  var distanceMoved = calculateDistance(geoArray[geoArray.length -2],
							  geoArray[geoArray.length-1]);
		  var distanceMoved1 = CalDistance(geoArray[geoArray.length-2],
							  geoArray[geoArray.length-1]);
		  
		  var distanceTotal = distanceMoved1 + rData.getDistance();
		  var lat = geoArray[geoArray.length -1].lat;
		  var lon = geoArray[geoArray.length -1].lon;
		  var hdg = geoArray[geoArray.length -1].heading;
		  var acc = geoArray[geoArray.length -1].acc;
		  var tme = geoArray[geoArray.length -1].time;
		  var spd = geoArray[geoArray.length -1].spd;
		  var logTime = new Date();
		  
		  var splitTime = splitTimeCal(spd);
		  
		  rData.setDistance(distanceTotal);
		  rData.setSpeed(splitTime);
		  rData.setSplitTime(spd);
		  rData.setLat(lat);
		  rData.setLon(lon);
		  rData.setHeading(hdg);
		  rData.setAccuracy(acc);
		  rData.setLogTime(logTime);
  
	  };
	  var calculateDistance = function(startPt,endPt) {
  
		  var R = 6371000; // radius of earth in m
		  var dLat = (endPt.lat-startPt.lat)* Math.PI / 180;
		  var dLon = (endPt.lon-startPt.lon)* Math.PI / 180;
		  var lat1 = (startPt.lat)* Math.PI / 180;
		  var lat2 = (endPt.lat)* Math.PI / 180;
	  
		  
		  var dSquared =  dLat  * dLat +  dLon * dLon * Math.cos((lat1+lat2) /2)* Math.cos((lat1+lat2) /2);
		  var d = R * Math.sqrt(dSquared);
  
		  return d;
  
	  };
	  var CalDistance = function(startPt,endPt) {
		  var R = 6371000; // radius of earth in m
		  var dLat = (endPt.lat-startPt.lat)* Math.PI / 180;
		  var dLon = (endPt.lon-startPt.lon)* Math.PI / 180;
		  var lat1 = (startPt.lat)* Math.PI / 180;
		  var lat2 = (endPt.lat)* Math.PI / 180;
		  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		  Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
		  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		  var d = R * c;
  
		  return d;
	  };
	  var splitTimeCal =function(speed) {
		  var splitTime = 0;
		  if (speed !== null) {
			  if(speed > 0.1){
				  splitTime = 500/speed;
			  }else {
				  splitTime = 0;
			  }
		  }else{
			  splitTime = "--";
		  }
		  return splitTime;
		  
	  };
  
  }
