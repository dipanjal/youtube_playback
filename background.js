var tabs=[];

chrome.webNavigation.onCompleted.addListener( function(details) {
	console.log("webNavigation--background.js");


	chrome.tabs.onCreated.addListener( tab => {
		console.log(tab);
		// tabs.push(tab);
	});

	chrome.tabs.onUpdated.addListener( (tabId, changeInfo, tab) => {
		console.log(window);
	});

	chrome.windows.onRemoved.addListener(function (windowId){
		console.log(windowId+" closed");
	})

   	// chrome.tabs.executeScript(null, {file: "playlist_service.js"}, function() {
    // 	if (chrome.runtime.lastError) {
	// 		console.log("error");
    //  	}
   	// });
}, {url: [{hostContains: '.youtube.'}],});


