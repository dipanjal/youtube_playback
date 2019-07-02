// window.load=onLoad();
//
// function onLoad(){
// // 	chrome.tabs.executeScript(null, {file: "playlist_service.js"}, function() {
// //     	if (chrome.runtime.lastError) {
// // 			console.log('popup script error');
// //      	}
// //    });
// }

$(function(){
	console.log('jquery-working');


	getPlaylistData().then(data=>{
		console.log(data)
		// if(data)
		// $("#_label").text()
		// console.log(data)
	}).catch(err=>console.log(err));

	$("#_add").on('click', event=>{
		let urlVal = $("#url_input").val();
		if(isValidUrl(urlVal)){
			addToPlayList(urlVal)
				.then(currentPlaylist=>{
					console.log(currentPlaylist);
					alert("video added to playlist");
				})
				.catch(err=>console.log(err));

			// let requestBody = {
			// 	action:"addToPlaylist",
			// 	data: urlVal
			// };
			// /**
			//  * Requesting Background Script To addToPlaylist()
			//  */
			// chrome.runtime.sendMessage(requestBody, function(response) {
			// 	console.log(response);
			// });

		}

	});

	$("#url_input").on('click', event =>{
		setTextValueFromCleapboard();
	});

	$("#_clear_all").on('click', event =>{
		clearPlaylist().then(isCleared=> console.log("playlist cleared "+isCleared))
			.catch(err=> console.log(err));
	});

	$(document).on('click',"#_resume", event =>{
		console.log("resume playlist");
		// window.history.back();
	});


});


function setTextValueFromCleapboard() {
	console.log('getClipboard()');
	let result = null;

	let textarea = $('#url_input');
	let prevText = textarea.val();

    textarea.val('');
    textarea.select();

    if (document.execCommand('paste')) {
		result = textarea.val();
		if(!isValidUrl(result)){
			textarea.val(prevText);
			return;
		}
    } else {
        console.error('failed to get clipboard content');
    }
    return result;
}

function isValidUrl(url){
	let regexp = /https:\/\/www.youtube.com\/watch\?v=[A-Z,a-z,0-9]+/g;
	if(regexp.test(url)){
		return true;
	}
	return false;
}
