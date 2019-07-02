

chrome.webNavigation.onCompleted.addListener( function(details) {
	console.log("webNavigation--background.js");

	chrome.windows.onRemoved.addListener(function (windowId){
		console.log(windowId+" closed");
		// alert("closing");
		// clearPlaylist()
		// 	.then(flag=>console.log("playlist cleared: "+flag))
		// 	.catch(err=>console.log(err));
	});
	
	if (chrome.runtime.lastError) {
		console.log("error");
	}

	/**
	 * fires on tab selection change
	 */



   	// chrome.tabs.executeScript(null, {file: "playlist_service.js"}, function() {
    // 	if (chrome.runtime.lastError) {
	// 		console.log("error");
    //  	}
   	// });
}, {url: [{hostContains: '.youtube.'}],});



// let port = chrome.runtime.connect({name: "tabChange"});

/**
 * when new tab creates
 */
chrome.tabs.onCreated.addListener( tab => {
	console.log('new tab created');
	console.log(tab);

});

function isValidTab(tab){
	if(tab.audible && isValidUrl(tab.url))
		return true;
	return false;
}

chrome.tabs.onUpdated.addListener( (tabId, changeInfo, tab) => {

	if(changeInfo.status === "complete"){
		if(isValidTab(tab)){
			console.log("tab updated");
			let requestBody={
				event: "tab_updated",
				data:tab,
			};
			chrome.tabs.sendMessage(tabId, requestBody, function(response) {
				console.log(response);
			});
		}
	}
});

chrome.tabs.onSelectionChanged.addListener(function(tabId,selectInfo){

	chrome.tabs.query({active: true}, function(tabs){
		let tab = tabs[0];

		if(isValidTab(tab)){
			console.log("tab selection changed");
			console.log(tab);
			let requestBody={
				event: "selection-changed",
				data:tab
			};

			chrome.tabs.sendMessage(tabId, requestBody, function(response) {
				console.log(response);
			});

		}else{
			console.log("Not audible tab");
		}

	});
});



/**
 * Listening Message From popup script or content script
 */
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "message from a content script:" + sender.tab.url :
            "message from the extension");
        if (request.action === "addToPlaylist"){
			addToPlayList(request.data).then(playlistUpdated=>{
				sendResponse({data: playlistUpdated});
			}).catch(err=>{
				sendResponse({err: err});
			});
		}
        if(request.action === "clearPlaylist"){
			clearPlaylist().then(isCleared=>{
				sendResponse({status: isCleared});
			}).catch(err=> sendResponse({err: err}));
		}
    });







