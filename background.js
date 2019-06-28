chrome.webNavigation.onCompleted.addListener( function(details) {
	console.log("webNavigation");
   	chrome.tabs.executeScript(null, {file: "playlist_service.js"}, function() {
    	if (chrome.runtime.lastError) {
			console.log("error");
     	}
   	});
}, {url: [{hostContains: '.youtube.'}],});