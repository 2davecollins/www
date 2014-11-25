var pieceNo = 0;
var results = {
	resultsDisply: function() {
		$('#tpId').text(dataItem["TP_Name"]);
		$('#tpDes').text(dataItem["TP_Description"]);
		$('#sesId').text(dataItem["S_Name"]);
		$('#sesDes').text(dataItem["S_Description"]);
		$('#SDate').text("Date : "+dataItem["S_Date"]);
		$('#SMode').text("Mode : "+dataItem["S_Mode"]);
		$('#STZone').text(dataItem["S_TrainingZone"]);
		$('#ModeBName').text(dataItem["S_ModeBName"]);
		$('#ModeBType').text(dataItem["S_ModeBType"]);
	},
	getPieceData: function() {
		ResultArray = new Array();
		
		dataItem["dist"]  = $("#distanceTarget").text();
		dataItem["time"]  = $("#timeTarget").text();
		dataItem["stkTGT"]= $("#strokeTarget").text();
		dataItem["stkAvg"]= 97;//"stkavg";//$("#strokeTarget").text();
		dataItem["hrtTGT"]= $("#heartTarget").text();
		dataItem["hrkAvg"]= 96;//"hrtAvg";//$("#strokeTarget").text();
		pieceNo++;
		ResultArray.push({
			"No": pieceNo,
			"Dist": dataItem["dist"],
			"Time": dataItem["time"],
			"StkTarget":dataItem["stkTGT"],
			"StkAverage":dataItem["stkAvg"],
			"HrtTarget": dataItem["hrtTGT"],
			"HrtAverage": dataItem["hrtTGT"]
		});	
		$('#pieceResultTmpl').tmpl(ResultArray).appendTo('#pieceResultList');
	}
};