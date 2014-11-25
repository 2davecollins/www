(function () {
	
	
	
	/*var stttingLive = localStorage.getItem("live");
	if (settingLive == null){
		cblive = $('#').is(':checked',true);
		localStorage.setItem("live",cbLive);	
	}else {
		cblive = $('#').is(!':checked');
		localStorage.setItem("live",false);
	}*/
	
	
	
	function onLoad(){
		document.addEventListener("deviceready", OnDeviceReady, false);
	}

	function onDeviceReady() {
		//console.log("File Reading API");
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    }

    function gotFS(fileSystem) {
		//console.log("File reading readme.txt");
        fileSystem.root.getFile("readme.txt", null, gotFileEntry, fail);
    }

    function gotFileEntry(fileEntry) {
		//console.log("gotFileEntry");
        fileEntry.file(gotFile, fail);
    }

    function gotFile(file){
		//console.log("gotFile");
        readDataUrl(file);
        readAsText(file);
    }

    function readDataUrl(file) {
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            //console.log("Read as data URL");
            //console.log(evt.target.result);
        };
        reader.readAsDataURL(file);
    }

    function readAsText(file) {
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            //console.log("Read as text");
            //console.log(evt.target.result);
        };
        reader.readAsText(file);
    }

    function fail(evt) {
		//console.log("File Read Error");
        //console.log(evt.target.error.code);
    }
	
})();