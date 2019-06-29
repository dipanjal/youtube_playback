window.load=onLoad();

function onLoad(){
// 	chrome.tabs.executeScript(null, {file: "playlist_service.js"}, function() {
//     	if (chrome.runtime.lastError) {
// 			console.log('popup script error');
//      	}
//    });
}

$(function(){
	console.log('jquery-working');
	$("#_add").on('click', event=>{
		let urlVal = $("#url_box").val();
		var regexp = /https:\/\/www.youtube.com\/watch\?v=[A-Z,a-z,0-9]+/g;
		if(regexp.test(urlVal)){
			console.log(urlVal);
			addToPlayList(urlVal);
			// console.log(localStorage.playlist)
		}
	});
});

function addToPlayList(urlVal) {
	console.log("addToPlayList()")
	// Get a value saved in a form.
	var theValue = urlVal;
	// Check that there's some code there.
	if (!theValue) {
		console.log('Error: No value specified');
	  	return;
	}

	chrome.storage.sync.get('playlist', (result) => {
		if(result.playlist){
			var dataArr = JSON.parse(result.playlist);
			dataArr.push(urlVal)
			save(JSON.stringify(dataArr));
		}else{
			console.log("storage empty");
			var dataArr = [urlVal];
			save(JSON.stringify(dataArr));
		}
    });
  }
function save(dataSerialized){
	chrome.storage.sync.set({'playlist': dataSerialized}, () => {
		// Notify that we saved.
		console.log('data saved');
		console.log(dataSerialized);
	});
}