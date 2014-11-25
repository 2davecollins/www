(function () {
	
		
	function checkMinDiaryValues(data,minValue){
		if(data <minValue){
			data = minValue;
		}
		return data;
	}
	//$(document).bind('pageinit', function() {
	$(document).ready(function() {		
		
		var d = new Date();
		var hh = d.getHours();
		var mm = d.getMinutes();
		mm<10 ? mm="0"+mm : mm = mm;
		hh<10 ? hh="0"+hh : hh = hh;
		var timenow = hh+":"+mm;
		// set up initial values when Diary Entry button pressed
		$('#manentrydate').datepicker();
		$('#manentrydate').datepicker('setDate','today');
		$('#manentertime').timepicker();
		$('#manentertime').timepicker({"disableTouchKeyboard":"true"});		
		$('#manentertime').timepicker('setTime',new Date());
		
	});
		
		
	
	
})();