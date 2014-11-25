(function () {
	var diary = $("#diaryentry");
	var user, dateDiary, timeDiary;
	var wellbeingrate, enthusiasm, sleepQuality, hours_sleep, rest_hr, weight_kgs;
	var note, timenow;
	
	function setDiaryEntries() {
		user = rData.getUserID();
		dateDiary = $("#datepicker").val();
		timeDiary = $("#timepicker").val();
		wellbeingrate = $("#wellbeingrate").val();
		enthusiasm = $("#enthusiasm").val();
		hours_sleep = $("#hours_sleep").val();
		sleepQuality = $("#sleepstate").val();
		rest_hr = $("#rest_hr").val();
		weight_kgs = $("#weight_kgs").val();
		note = $("#diarynote").val();
		
	}
	function createDiaryEntry (){
		setDiaryEntries();
		var dateE = new Date(dateDiary+","+timeDiary);
		var dateMs = dateE.getTime();
		var dt = new Date();
		var dm = dt.getTime();
		var dEntry = {
			"AthleteID":user,
			"DateTimeMs":dateMs,
			"DateTime":dateE,
			"RestingHR":rest_hr,
			"WeightinKgs":weight_kgs,
			"HoursSleep":hours_sleep,
			"SleepQuality":sleepQuality,
			"WellBeing":wellbeingrate,
			"Enthusiasm":enthusiasm,
			"Notes":note
			};
		
    	return dEntry;
		
	}
	function displayMessage(msg) {
		if(navigator.notification){
			navigator.notification.alert(
				msg,
				alertDisplayDismissed,
				'Notice',
				'Ok'
			);
		}else{
			alert(msg);
		}
		function alertDisplayDismissed(){
		}
	}
	function uploadDiaryEntry() {
		var data = createDiaryEntry();
		var url = statusItem["baseURL"] + "/DiaryMobile";
		 jQuery.ajax({
			url: url,
			dataType: "json",
			jsonpCallback: "_rowsage",
			cache: false,
			timeout: 6000,
			type: "POST",
			crossDomain:true,
            async: true,
            data: data,
            success: function (data, textStatus, jqXHR) {
				if(data.msg == "OK"){
					displayMessage("Diary Entry Added");
				}else{
					displayMessage("Saving Diary entry failed ");
				}
				
            },
            error: function (jqXHR, textStatus, errorThrown) {
				displayMessage("Failed to upload Try again later");
            },
            complete: function () {
				//tbd
            }
        });
	}
	function checkMinDiaryValues(data,minValue){
		if(data <minValue){
			data = minValue;
		}
		return data;
	}
	//$(document).bind('pageinit', function() {
	$(document).ready(function() {
		
		diary.on("click",function(){
			$("#diarymessage").text("");
			$.mobile.changePage("#diarypage",{
					transition: "none",
					reverse: true,
					changeHash: true
			});
			var d = new Date();
			var hh = d.getHours();
			var mm = d.getMinutes();
			mm<10 ? mm="0"+mm : mm = mm;
			hh<10 ? hh="0"+hh : hh = hh;
			timenow = hh+":"+mm;
			// set up initial values when Diary Entry button pressed
			$('#datepicker').datepicker();
			$('#datepicker').datepicker('setDate','today');
			$('#timepicker').val(timenow);
			$('#hours_sleep').val(8);
			$('#rest_hr').val(70);
			$('#weight_kgs').val(80);
		});
		$("#diarynote").on("change", function() {
			//tbd
		});
		$("#hours_sleep").on("change", function() {
			hours_sleep = $("#hours_sleep").val();
			var displayData = checkMinDiaryValues(hours_sleep,0);
			$("#hours_sleep").val(displayData);
			
		});
		$("#rest_hr").on("change", function() {
			rest_hr = $("#rest_hr").val();
			var displayData = checkMinDiaryValues(rest_hr,10);
			$("#rest_hr").val(displayData);
			
		});
		$("#weight_kgs").on("change", function() {
			weight_kgs = $("#weight_kgs").val();
			var displayData = checkMinDiaryValues(weight_kgs,10);
			$("#weight_kgs").val(displayData);
			
		});
		$("#noteclear").on("click",function() {
			$("#diarynote").val("");
			
		});
		$("#diaryadd").on("click", function() {
			user = rData.getUserID();
			if(user === 0){
				displayMessage("Please Log on to use Diary");
				var delaydiary = setTimeout(function () {
					$.mobile.navigate( "#startpage");
				},1000);
			}else{
				var connect = txData.connectionState();
				$.mobile.navigate( "#mySession");
				if(connect){
					uploadDiaryEntry();
				}else{
					displayMessage("To Save Diary entry you need to be Online");
				}
			}
			
		});
	});
	
})();