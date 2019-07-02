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

	chrome.storage.local.get('playlist', (result) => {
		console.log(result)
    });

	$("#_add").on('click', event=>{
		let urlVal = $("#url_input").val();
		// var regexp = /https:\/\/www.youtube.com\/watch\?v=[A-Z,a-z,0-9]+/g;
		if(isValid(urlVal)){
			console.log(urlVal);
			addToPlayList(urlVal);
		}
	});

	$("#url_input").on('click', event =>{
		setTextValueFromCleapboard();
	});

	$("#_clear_all").on('click', event =>{
		clearPlaylist();
	});

	$("#_previous").on('click', event =>{
		console.log("clicked prev");
		window.history.back();
	})
});

function isValid(url){
	var regexp = /https:\/\/www.youtube.com\/watch\?v=[A-Z,a-z,0-9]+/g;
	if(regexp.test(url)){
		return true;
	}
	return false;
}

function setTextValueFromCleapboard() {
	console.log('getClipboard()');
	var result = null;
	
	var textarea = $('#url_input');
	var prevText = textarea.val();

    textarea.val('');
    textarea.select();

    if (document.execCommand('paste')) {
		result = textarea.val();
		if(!isValid(result)){
			textarea.val(prevText);
			return;
		}
    } else {
        console.error('failed to get clipboard content');
    }
    return result;
}

function addToPlayList(urlVal,prior=false) {
	console.log("addToPlayList()");
	if (!urlVal) {
		console.log('Error: No value specified');
	  	return;
	}
	if(isValid)
	chrome.storage.local.get('playlist', (result) => {
		if(result.playlist){
			var dataArr = JSON.parse(result.playlist);
			dataArr.push(urlVal)
			save(JSON.stringify(dataArr));
		}else{
			console.log("storage empty");
			var dataArr = [urlVal];
			save(JSON.stringify(dataArr));
		}

		if (chrome.runtime.lastError) {
			console.log('Get Error');
		}
    });
  }
function save(dataSerialized){
	chrome.storage.local.set({'playlist': dataSerialized}, () => {
		// Notify that we saved.
		console.log('data saved');
		console.log(dataSerialized);
	});

	if (chrome.runtime.lastError) {
		console.log('Save Error');
	}
}

function clearPlaylist(){
	console.log("clearPlaylist");
	try{
		chrome.storage.local.clear(()=>{
			console.log("cleared")
		});
	}catch(err){
		console.log(err);
	}
}