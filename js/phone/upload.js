document.addEventListener("deviceready",onReady,false);
	var popupDialog = $('#popupDialog');
	var popupReview = $('#popupReview');
	function onReady() {
		var devName = null;
		var devUuid = null;
		if(device){
		var devName =device.model;
		var devUuid = device.uuid;
		}
		if(devUuid === null) {
			// not a mobile device use browser type for device uuid
			devUuid = navigator.appName;
			statusItem["blockUUID"]=devUuid;
		}else {
			statusItem["blockUUID"]=devUuid;
		}
			txData.connectionState();
	}
var tableCheck = null;
var intervalTableCheck = 3000;
var nameregister = $("#nameregister");
var emailregister = $("#emailregister");
var passwordregister1 = $("#passwordregister1");
var passwordregister2 = $("#passwordregister2");
var tcregister = $("#tcregister");


$(document).delegate('#results','pageshow', function() {
	if(tableCheck){
		clearInterval(tableCheck);
		tableCheck = null;
	}
	
	
	tableCheck = setInterval( function(){
		txData.displayLocalStorage();
		if(statusItem["pieceFinishedDataSend"] == true){
			statusItem["pieceFinishedDataSend"] = false;
			$('#popupDialog').popup();
			$('#popupDialog').popup('open');
	}
	},intervalTableCheck);
	

});
$(document).delegate('#results','pagehide', function() {
	if(tableCheck){
		clearInterval(tableCheck);
		tableCheck = null;
	}

});

$("#tcconditions").on("click", function(e){
	e.stopPropagation();
	e.preventDefault();
	var url = statusItem["baseURL"] + "/TermAndCondition.html";
	var connStatus = txData.connectionState();
	if(connStatus){
	$("#tcdisplay").popup();
	$("#tcdisplay").popup("open",{x:20,y:20});
	$("#tcdisplayframe").attr('src',url).attr('height','500px').attr('width','600px');
	}else{
		OfflineMessage ();
	}
	
});
$("#btntoregister").on("click", function(e){
	e.stopPropagation();
	e.preventDefault();
	goToResisterPage ();
});
$("#regbenefits").on("click", function(e){
	e.stopPropagation();
	e.preventDefault();
	goToResisterPage ();
});
$("#initialprofile").on("click", function(e){
	e.stopPropagation();
	e.preventDefault();
	goToResisterPage ();
});
$("#constraintdemo").on("click", function(e){
	e.stopPropagation();
	e.preventDefault();
	goToResisterPage ();
});
$("#constrainupdate").on("click",function(){
	
	if(navigator.notification){
		navigator.notification.alert(
				'To Upgrade Subscription go to\n rowcatcher.com',
				alertDismissedUpgrade,
				'Notice',
				'Ok'
			);
	}else{
		alert("To Upgrade Subscription go to\n rowcatcher.com");
	}
	function alertDismissedUpgrade(){
		// tbd
		
	}
	
});
function goToResisterPage (){
	var connStatus = txData.connectionState();
	if(connStatus){
		$.mobile.changePage( "#shortregisterpage",{
			transition: "slideup",
			reverse: true,
			changeHash: true
		});
		
	}else{
		OfflineMessage ();
	}
};
$("#submitregister").on("click", function(e){
	e.stopPropagation();
	e.preventDefault();
	var connStatus = txData.connectionState();
	if(!connStatus){
		OfflineMessage ();
	}else{
		var tcchecked = tcregister.is(':checked');
		var emailformcorrect = validateEmail(emailregister.val());
		if(nameregister.val() == ""){
			alertMsg ("Name Cant Be Blank");
		}else if(emailregister.val() == ""){
			alertMsg ("E-Mail Cant Be Blank");
		}else if(!emailformcorrect){
			alertMsg ("E-Mail Format Incorrect\n name@domain.com");
		}else if(passwordregister1.val() == ""){
			alertMsg ("Password Cant Be Blank");
		}else if(passwordregister2.val() == ""){
			alertMsg ("Confirm password Cant Be Blank");
		}else if(passwordregister1.val() != passwordregister2.val()){
			alertMsg ("Confirm Password is not the same");
		}else if(!tcchecked){
			alertMsg ("Please Accept Terms and Conditions to proceed");
		}else{
			var connStatus = txData.connectionState();
			if(connStatus){
				sendRegistrationDetails();
			}else{
				OfflineMessage ();
			}
		}
		
		
	}
	
});
$("#cancelregister").on("click", function(e){
	e.stopPropagation();
	e.preventDefault();
	clearTCForm ();
	 $.mobile.changePage( "#startpage",{
		transition: "slideup",
		reverse: true,
		changeHash: true
	});
	
});
function OfflineMessage (){
	if(navigator.notification){
		navigator.notification.alert(
				'Please Try again later',
				alertDismissedOFFLine,
				'Offline',
				'Ok'
			);
	}else{
		alert("Please Try again later");
	}
	function alertDismissedOFFLine(){
		// tbd
		
	}
};
function alertMsg (msg){
	if(navigator.notification){
		navigator.notification.alert(
				msg,
				alertDismissedCorrect,
				'Notice',
				'Ok'
			);
	}else{
		alert(msg);
	}
	function alertDismissedCorrect(){
		// tbd
		
	}
};
function clearTCForm (){
	nameregister.val("");
	emailregister.val("");
	passwordregister1.val("");
	passwordregister2.val("");
	tcregister.prop("checked",false).checkboxradio("refresh");
	
};
function validateEmail(email) {
  
  var emailReg =  /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  //var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  if( !emailReg.test( email ) ) {
    return false;
  } else {
    return true;
  }
};
function sendRegistrationDetails(){
	
	var details = {
		'Name':nameregister.val(),
		'Email':emailregister.val().toLowerCase(),
		'Password':passwordregister1.val(),
		'TandCAgreeded':true
	}
	var url = statusItem["baseURL"] + "/ShortRegisterScript";
	$.ajax({
		type:'POST',
		url:url,
		data:details,
		dataType:"json",
		success: onSuccessRegistration
	}).fail(function(){
			alertMsg ("Try again Later");
	}).done(function(){
			
	});
	function onSuccessRegistration(data){
		if(data.msg == "Success"){
			alertMsg ("To Proceed please check your email\nand follow the instructions");
			details = null;
			clearTCForm ();
			$.mobile.changePage("#startpage",{
				transition: "none",
				reverse: true,
				changeHash: true
			});
			
		}
		else{
			alertMsg (data.msg);
		}
		
	};
};
	
var txData = {
    maxLength: 500,
    connectionState: function () {
		var networkState;
		if(navigator.connection){
			networkState = navigator.connection.type;			
			var states = {};
			states[Connection.UNKNOWN] = 'Unknown connection';
			states[Connection.ETHERNET] = 'Ethernet connection';
			states[Connection.WIFI] = 'WiFi connection';
			states[Connection.CELL_2G] = 'Cell 2G connection';
			states[Connection.CELL_3G] = 'Cell 3G connection';
			states[Connection.CELL_4G] = 'Cell 4G connection';
			states[Connection.CELL] = 'Cell generic connection';
			states[Connection.NONE] = 'No network connection';
			stateConnection = states[networkState] != "No network connection";
			if (states[networkState] == "No network connection") {
				stateConnection = false;
			} else {
				stateConnection = true;
			}			
		}else{
			stateConnection = true;
		}
        //var networkState = navigator.connection.type;
       
		return stateConnection;
    },
	syncToWeb: function() {
		var dataToCheck = txData.checkForStatus();
		for (var i=0; i<dataToCheck.length; i++) {
			if(dataToCheck[i].Save !== true) {
				//console.log("Resending data"+dataToCheck[i].name);
				txData.sendOfflineData(dataToCheck[i].keyToSend);
			}else {
			}
		}
		//txData.displayLocalStorage();
	},
	syncFromWeb: function(data) {
		var lastDownLoad = {};
		var currentDate = new Date();
		var day = currentDate.getDate();
		var month = currentDate.getMonth();
		month +=1;
		var today = day+"/"+month;
		lastDownLoad.Today = today;
		lastDownLoad.Data = data;
		var value = lastDownLoad;
		$.jStorage.set("DownLoadData",value);
	},

    dataArray: rdLog.returnDataLogArray(),
    generateUUID: function () {
        var uuid = "", i, random;
        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;

            if (i == 8 || i == 12 || i == 16 || i == 20) {
                uuid += "-";
            }
            uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
        }
        return uuid;
    },
    convertToJsonObj: function (dataElement) {
        var jsonObj = {
            // UUID if necessary
            "guiE": dataElement.guiEvent,
            "guiT": dataElement.guiEventTime,
            "logT": dataElement.logTime,
            "usID": dataElement.userID,
            "usEM": dataElement.userEM,
            "plID": dataElement.trainingPlanID,
            "seID": dataElement.sessionID,
            "piID": dataElement.pieceID,
            "type": dataElement.type,
            "idX" : dataElement.idX,
            "paID": dataElement.paID,
            "stRt": dataElement.strokeRate,
            "stCt": dataElement.strokeCount,
            "htRt": dataElement.heartRate,
            "dist": dataElement.distance,
            "spd": dataElement.speed,
            "lat": dataElement.lat,
            "lon": dataElement.lon,
            "acc": dataElement.accuracy,
            "head": dataElement.heading,
            "upLoadID": dataElement.upLoadId
        };
        return jsonObj;
    },
    initialTxData: function (dataArray, BlockUUID) {
        var i = 0;
        var j = 0;
        var txArray = [];
        while (i < dataArray.length && j <= txData.maxLength) {
            if ((dataArray[i].upLoadId == "resend") || (typeof dataArray[i].upLoadId == "undefined")) {
                dataArray[i].upLoadId = BlockUUID;
                txArray.push(txData.convertToJsonObj(dataArray[i]));
                j++;
            }
            i++;
        }
        return txArray;
    },
	blocksToResend: function (keyToSend) {
		
		var blArray = [];
		dataToCheck = $.jStorage.get(keyToSend);
		//dataToCheck = dataToCheck.savingStatus;
		
		for(var i=0; i<dataToCheck.savingStatus.length; i++) {
		
			if(dataToCheck.savingStatus[i].sendingState === false) {
				blArray.push(dataToCheck.savingStatus[i].blockUUID);
			}
		}
		return blArray;
	},
    failedTxData: function (keyToSend, BlockUUID) {
        var txArray = [];
		dataToSend = $.jStorage.get(keyToSend);
		for(var i=0; i<  dataToSend.rowDataArray.length; i++) 
		{
			if( dataToSend.rowDataArray[i].upLoadId == BlockUUID)
			{
				txArray.push(txData.convertToJsonObj(dataToSend.rowDataArray[i]));
			}
		}
		return txArray;
    },
	 repeatTxDataOld: function (newDataArray, BlockUUID) {
        var i = 0;
        var j = 0;
        var txArray = [];
        while (i < newDataArray.length && j <= txData.maxLength) {
            if ((newDataArray[i].upLoadId == "resend") || (newDataArray[i].upLoadId === null)) {
                newDataArray[i].upLoadId = BlockUUID;
                txArray.push(txData.convertToJsonObj(newDataArray[i]));
                j++;
            }
            i++;
        }
        return txArray;
    },
    resendRepeatData: function (dataToSend, keyToSave,Block) {
        var connStatus = txData.connectionState();
		
        var newBlockData;
        if (connStatus == "online") {
            newBlockData = txData.repeatTxDataOLD(dataToSend,Block);
            while (newBlockData.length !== 0) {
                txData.txToMongoDB(dataToSend, newBlockData, statusItem["blockUUID"], keyToSave);
                newBlockData = txdata.repeatTxDataOLD(dataToSend);
            }
        } else {
            // send message no connection try later
        }
        var delay = setTimeout(function () {
            txData.checkSendingStatus(keyToSave);
            var newSave = lastPieceData;
            $.jStorage.set(keyToSave, newSave);
        }, 2000);
    },
	sendOfflineData: function (keyToSend) {
		var DataToSend = $.jStorage.get(keyToSend);
		var newA = [];
		var newB = [];	//reset savingStatus for resend
		newA = DataToSend.rowDataArray;
		var newc = DataToSend.athleteId;
		$.each(newA, function (index, value) {
			newA[index].upLoadId = "resend";
		});
		var savingStatsArray = [];
		var newArrayToSend = {
			"rowDataArray": newA,
			"savingStatus": newB,
			"savedToWeb": false,
			"athleteId":newc
		};
		$.jStorage.set(keyToSend, newArrayToSend);
		sendToMongoDB(keyToSend);
	},
	repeatSendToWeb: function(keyToSend){
			var sendok = false;
			var check = $.jStorage.get(keyToSend);
			//txData.displayLocalStorage();
			Block = txData.blocksToResend(keyToSend);
			
			if(Block.length >=1){
				for (var i=0; i<Block.length; i++) {
					blockData = txData.failedTxData(keyToSend, Block[i]);
					txData.txToMongoDB(check,blockData,Block[i],keyToSend);
					var delay = setTimeout(function () {
						newPieceData = txData.checkSendingStatus(keyToSend);
						//txData.displayLocalStorage();
						$.jStorage.set(keyToSend, newPieceData);
					}, 2000);
				}
				sendok = false;
				
			}else{
				sendok = true;
			}
			return sendok;
	},
    setSavingStatus: function (dataArray, BlockUUID, state) {
        var newValue = {};
        newValue.blockUUID = BlockUUID;
        newValue.sendingState = state;
        newValue.attempts = 0;
        newValue.dataLastSent = new Date();
        dataArray.push(newValue);
    },
	upDateSavingStatus: function (keyToUpdate,BlockUUID,state) {
		var dataArray = $.jStorage.get(keyToUpdate);
		$.each(dataArray.savingStatus, function (index, value) {
			if(value.blockUUID == BlockUUID) {
				value.sendingState = state;
				value.attempts = this.attempts+1;
				value.dataLastSent = new Date();
     		}
     	});
	 	$.jStorage.set(keyToUpdate,dataArray);
      	return dataArray;
     },
    checkSendingStatus: function(dataKey) {
		var data;
		 if(dataKey !== null) {
			data = $.jStorage.get(dataKey);
			if(data.savingStatus){
				var dataSavingStatus = data.savingStatus;
				data.savedToWeb = false;
				for(var i=0;i<dataSavingStatus.length;i++)
				{
					if(dataSavingStatus[i].sendingState === false)
					{
						data.savedToWeb = false;
						break;
					} 
					
					if( i==dataSavingStatus.length-1) {
						data.savedToWeb = true;
					}
				}
			}
		 }
		return data;
     },
	 checkUserStatus: function(dataKey) {
		var data;
		 if(dataKey !== null) {
			data = $.jStorage.get(dataKey);
			if(data.savingStatus){
				var dataSavingStatus = data.savingStatus;
				data.savedToWeb = false;
				for(var i=0;i<dataSavingStatus.length;i++)
				{
					if(dataSavingStatus[i].sendingState === false)
					{
						data.savedToWeb = false;
						break;
					} 
					
					if( i==dataSavingStatus.length-1) {
						data.savedToWeb = true;
					}
				}
			}
		 }
		return data;
     },
	 checkForStatus: function() {
		 var dataStorageArray = $.jStorage.index();
		 var storageKeys      = new Array();
		 var dataArray        = new Array();
		 // create array of localstorage keys for piece data
		 $.map(dataStorageArray, function (value,index) {
			 if(value.match('%')) {
				 storageKeys.push(value);
			 }
			 return storageKeys;
		 });
		 // filter content 
		 $.each(storageKeys, function(index,value) {
			
			var startIndex = value.indexOf("%") + 1;
            var endIndex   = value.indexOf("£");
            if (startIndex !== 0) {
                var DataToCheck = $.jStorage.get(value);
                var saveStatus = DataToCheck.savedToWeb;
                var val = value.substring(startIndex, endIndex);
				//var datetime = new Date(val).getDate();
				var keyToSend = value;
                dataArray.push({"name": index, "value": val, "keyToSend": keyToSend, "Save": saveStatus});
            }
			 
		 }); 
		 return dataArray;
	 },
     deleteOldEntries: function(){
        var userLogged = rData.getUserID();
        var dataStorageKeys = $.jStorage.index();
        var LocalStorageKeys = new Array();
        var UserLstDelete = new Array();
        var LSKeysIndex = $.map(dataStorageKeys, function (value, index) {
            if (value.match('%')) {
                LocalStorageKeys.push(value);
            }
            return LocalStorageKeys;
        });
       var LSKeysModified = $.map(LocalStorageKeys, function (value, index) {
            var LSKeyDataModified = $.jStorage.get(value);
            var userIndex = LSKeyDataModified.athleteId;
            if (userIndex == userLogged) {
                UserLstDelete.push(value);
            }
            return UserLstDelete;
        });
        $.each(UserLstDelete, function (index, value) {
            var indexID = value;
            var start = value.indexOf("%") + 1;
            var end = value.indexOf("£");
            var dtk = parseInt(statusItem["daysToKeep"]);
            if (start !== 0) {
                var LSData = $.jStorage.get(value);
                var val = value.substring(start, end);
				var dateDone = new Date(val);
				var dateRef = new Date();
				dateRef.setDate(dateRef.getDate() - dtk);
				var delta = dateRef-dateDone;
				if(delta < 0){
				}else{
					$.jStorage.deleteKey(indexID);
            		$.jStorage.reInit();
				}
            }
        });
	 },
	 findUniquePaIDs: function(arr){
		 if(arr.length >0){
		 	if(!!arr[0].nodeType){
				 return _old.apply(this.arguments);
		 	}else{
				 return $.grep(arr,function(v,k){
					 return $.inArray(v,arr) ===k;
			 	});
		 	}
		 }else{
			 return "";
		 }
	 },
	 askForAggregation: function(id){
		var resultToAgragate =  $.jStorage.get(id);
		var userID = resultToAgragate.athleteId;
		var paIds=[];
		$.map(resultToAgragate.rowDataArray, function(i){
			if(i.paID !== 0){
				paIds.push(i.paID);
			}
		});
		var PAIDS = txData.findUniquePaIDs(paIds);
		var url = statusItem["baseURL"]+"/KickOffAggOnAtlPaid/?id="+userID+"&paid="+PAIDS;
		$.ajax({
			url:url,
			success:onSuccessAggragation
			
		}).fail(function(jqXHR,textStatus){
			//alert("Error  agrigation"+textStatus);
		}).done(function(){
			//alert("finished agrigation"+userID);
			popupDialog.popup();
			popupDialog.popup('close');
			
		});
		function onSuccessAggragation(){
			//alert("Success aggrigation"+PAIDS);
		};
		 
	 },
	 displayResultsFromWeb: function(id){
		var resultToCheck =  $.jStorage.get(id);
		var userID = resultToCheck.athleteId;
		var paIds=[];
		$.map(resultToCheck.rowDataArray, function(i){
			if(i.paID !== 0){
				paIds.push(i.paID);
			}
		});
		var PAIDS = txData.findUniquePaIDs(paIds);
		var urlWeb = statusItem["baseURL"]+"/PieceDetailChartMob.html?athID="+userID+"&paID="+PAIDS;
		var url = statusItem["baseURL"]+"/pdc/?id="+userID+"&paid="+PAIDS;
		rData.setUrlWebResult(urlWeb);
		rData.setUrlResult(url);
		$.ajax({
			url:url,
			success:onSuccess
			
		}).fail(function(){
			//alert("Error Retrieving Results");
		}).done(function(){
			$('#loading-msgreview').hide();
			$.mobile.hidePageLoadingMsg();
		});
		function alertDismissedWait(){
			//tbd
		};
		function onSuccess(data) {
			$("#graphresult").empty();
			if(data.length >0){
				var series1 = new Array();
				var series2 = new Array();
				var series3 = new Array();
				var item1 = new Array();
				var item2 = new Array();
				var item3 = new Array();
				var dataarray1 = $.map(data, function (value, index) {
					var t = new Date(value.logT);
					item1 = [t,10*value.stRt];
					if(value.spd >= 0){
						item2 = [t,100*value.spd];
					}else{
						item2 = [t,0];
					}
					if(value.htRt >1){
						item3 = [t,5*value.htRt];
					}else{
						item3 = [t,0];
					}
					series1.push(item1);
					series2.push(item2);
					series3.push(item3);
				});
				var dataplot = [ series1,series2,series3 ];
				
				var options1 = {
					 colors: ["#f7f32e", "#0A820A", "#f90909"],
					grid:{
						show:true,
						labelMargin:0,
						backgroundColor:{
								colors:["#58FAF4","#7A7A7A"]
						}
					},
					xaxis:{
						show:false
					},
					yaxis:{
						show:false
					}
						
				};
				
				if(navigator.notification){
					
					navigator.notification.alert(
						'For a more detailed Chart. Please visit rowcatcher.com',
						alertDismissedWait,
						'Information',
						'Ok'
					);
				}else{
					alert("For a more detailed Chart. Please visit rowcatcher.com");
				}
			var myPlot = $.plot($("#graphresult"), dataplot,options1);
			var myImg = myPlot.getCanvas();
			var chartimg = myImg.toDataURL("image/png");
			rData.setUrlResult(chartimg);
			}else{
				if(navigator.notification){
					navigator.notification.alert(
						'Processing Results',
						alertDismissedWait,
						'Please Wait',
						'Ok'
						);
				}else{
					alert("Processing Results");
				}
				popupReview.popup();
				popupReview.popup('close');
				
			}
		}
		popupReview.popup();
		popupReview.popup('open');
		popupReview.css({
			'top':'20px',
			'left':'30px',
			'display':'block'
		});
	 },
     displayLocalStorage: function () {
        $('#storageList').empty();
		var userLogged = rData.getUserID();
        var dataStorageKeys = $.jStorage.index();
        $('#dialogMessage').html("<h1></h1>");
        var LSTemp;
        LSTemp = new Array();
        var Lst,UserLst;
        Lst = new Array();
		UserLst = new Array();
        var saveColor;
        saveColor = new Array();
		var count = 0;
		var LSIndex = $.map(dataStorageKeys, function (value, index) {
            if (value.match('%')) {
                Lst.push(value);
            }
            return Lst;
        });
		var LSIndexModified = $.map(Lst, function (value, index) {
			var LSDataModified = $.jStorage.get(value);
			var userIndex = LSDataModified.athleteId;
			var key = "userid"+rData.getUserEM();
			var localStorageUser =$.jStorage.get(key);
			if(localStorageUser){
				if (userIndex == userLogged) {
					UserLst.push(value);
				}
			}
            return UserLst;
        });
		
		 $.each(UserLst, function (index, value) {
           	var indexID = value;
            var start = value.indexOf("%") + 1;
            var end = value.indexOf("£");
			
            if (start !== 0) {
                var LSData = $.jStorage.get(value);
                var saveStatus = LSData.savedToWeb;
				var val = value.substring(start, end);
                LSTemp.push({"name": index, "value": val, "Save": saveStatus, "id": indexID});
            }
        });	
		var SavedToWebArray = $.map(Lst, function (value, index) {
            var LSData = $.jStorage.get(value);
			var userLoggedin = rData.getUserID();
            var saveStatus = LSData.savedToWeb;
            if (saveStatus) {
                saveColor.push({"name": index});
            }
            return saveColor;
        });
        $('#localStorageTmpl').tmpl(LSTemp).appendTo('#storageList');
		$('.ToReview').on('click', function() {
			var connstate = txData.connectionState();
			if(connstate){
				$.mobile.showPageLoadingMsg("b","Loading ...");
				popupReview.popup();
				popupReview.popup('open',{x:0,y:50});
				var idLSRV = $(this).index('.ToReview');
				txData.displayResultsFromWeb(LSTemp[idLSRV].id);
				var start = LSTemp[idLSRV].id.indexOf("%") + 1;
            	var end = LSTemp[idLSRV].id.indexOf("£");
				var doneDate = LSTemp[idLSRV].id.substring(start, end);
				rData.setWebResultsDate(doneDate);
			}else{
				if(navigator.notification){
					navigator.notification.alert(
						'Please Try Again Later',
						alertDismissedul,
						'Offline',
						'Ok'
					);
				}else{
					alert("Please Try Again Later");
				}
			}
		});
		function alertDismissedul(){
			//console.log("alert dismissed ");
		};
		$('#closepopupreview').on('click',function(){
			popupReview.popup();
			popupReview.popup('close');
		});
		$('#closepopupdialog').on('click',function(){
			popupDialog.popup();
			popupDialog.popup('close');
		});
        $('.ToResend').on('click', function () {
			var connectionStatus = txData.connectionState();
			if(connectionStatus == false){
				if(navigator.notification){
					navigator.notification.alert(
						'Offline Cant Complete Request',
						alertDismissedul,
						'Information',
						'Ok'
					);
				}else{
					alert("Offline Cant Complete Request");
				}
				//txData.displayLocalStorage();
				return;
			}
			popupDialog.popup('open');
            var idLSRS = $(this).index('.ToResend');
            $('.ToWeb[data-id="'+idLSRS+'"]').css("background-color", "LightCoral");
			
			var delayResend1 = setTimeout(function() {
				txData.sendOfflineData(LSTemp[idLSRS].id);
			},1000);
			
			// move to timer on history pageshow
           /* var delayResend2 = setTimeout(function () {
                popupDialog.popup('close');
            }, 2000);*/
            //$.jStorage.reInit();
			//txData.displayLocalStorage();
        });
        $('.ToClear').on('click', function () {
			var idLSCL = $(this).index('.ToClear');
			if(navigator.notification){
				navigator.notification.confirm(
					'Are you sure you want to Delete ?',
					onConfirmDelete,
					'Notice',
					['Cancel','Ok']
				);
			}else{
				var ans = confirm("Are you sure you want to Delete ?");
				if (ans){
					
					$('#popupDialog').popup('open');
					$.jStorage.deleteKey(LSTemp[idLSCL].id);
					var to = setTimeout(function () {
						$('#popupDialog').popup('close');
					}, 2000);
				}
			}
			
			function onConfirmDelete(btn){
				if(btn == 2){
					$('#popupDialog').popup('open');
					$.jStorage.deleteKey(LSTemp[idLSCL].id);
					var to = setTimeout(function () {
						$('#popupDialog').popup();
						$('#popupDialog').popup('close');
					}, 2000);
				
				}
			};
			
			function alertDismissedDelete(){
				//to be done
			};
        });
		
		// set color on table to indicate status
		$('.ToWeb[data-status="false"]').css("background-color", "LightCoral");
		$('.ToWeb[data-status="true"]').css("background-color", "DarkSeaGreen");
    },

    txToMongoDB: function (dataRaw, dataIn, BlockUUID, keyTosend) {
        var upData = {};
		var devPG = null;
		var devName = null;
		var devUuid = null;
		var devPlat = null;
		var devVers = null;
		
		if(typeof device != "undefined"){
        	devPG = device.phonegap;
			devName = device.model;
			devUuid = device.uuid;
			devPlat = device.platform;
			devVers = device.version;
		}
		$.mobile.showPageLoadingMsg("b","Uploading Data ...");
		//var devPG = device.cordova;
        if (devPG === null) {
            //devPG = "No";
            devPgD = new Date();
            devPG = devPgD.getHours() + ":" + devPgD.getMinutes() + ":" + devPgD.getSeconds();

        }
        
        if (devName === null) {
            devName = "Web";
        }
        
        if (devUuid === null) {
            devUuid = "unknown";
        }
       
        if (devPlat === null) {
            devPlat = "Chrome";
        }
       
        if (devVers === null) {
            devVers = "unknown";
        }
        var appVers = dataItem["appVers"];

        var keyId = keyTosend;//statusItem["keyToSend"];
        var url = statusItem["baseURL"] + "/SessionMobileData";

        var DataBlock = {    //"clubID" : rData.getClubID(),  // Club Reg ID
            "athID": dataIn[0].usID,     // Registration ID of the athlete
            "devUUID": "UUID Issue",//devUuid,			// Unique ID of the device if possible
            "devName": devName,
            "devPhoneGap": devPG,
            "devPlatform": devPlat,
            "devVersion":devVers,
			"appVersion":appVers,
            "upLoadID": dataIn[0].upLoadID,
            "keyID": keyId,
            "updTime": new Date(),
            "rowDataArr": dataIn    // Array of RowData elements
            //"piecesDone":piecesDoneArr    // Array of Pieces Done elements
        };
        var count1 = Object.keys(txData).length;
		var sendTimeout = statusItem["sendTimeout"];
        jQuery.ajax({
			url: url,
			dataType: "json",
			jsonpCallback: "_rowsage",
			cache: false,
			timeout: sendTimeout,
			type: "POST",
			crossDomain:true,
            async: true,
            data: DataBlock,
            success: function (data, textStatus, jqXHR) {
                var BlockID;
                if (data.writeResult == "Success") {
                    BlockID = data.upLoadId;
                    keyToUpdate = data.keyID;
                    txData.upDateSavingStatus(keyToUpdate, BlockID, true);
                } else {
                    BlockID = data.upLoadId;
                    keyToUpdate = data.keyID;
                    txData.upDateSavingStatus(keyToUpdate, BlockID, false);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                txData.upDateSavingStatus(keyId, BlockUUID, false);
            },
            complete: function () {
				$.mobile.hidePageLoadingMsg();
            }
        });
    }

};