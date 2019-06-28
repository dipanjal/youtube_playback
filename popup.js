window.load=onLoad();

function onLoad(){
	chrome.tabs.executeScript(null, {file: "playlist_service.js"}, function() {
    	if (chrome.runtime.lastError) {
			console.log('popup script error');
     	}
   });
}