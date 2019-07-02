var tabs=[];

chrome.webNavigation.onCompleted.addListener( function(details) {
	console.log("webNavigation--background.js");



	chrome.windows.onRemoved.addListener(function (windowId){
		console.log(windowId+" closed");
	})
	
	if (chrome.runtime.lastError) {
		console.log("error");
	}

   	// chrome.tabs.executeScript(null, {file: "playlist_service.js"}, function() {
    // 	if (chrome.runtime.lastError) {
	// 		console.log("error");
    //  	}
   	// });
}, {url: [{hostContains: '.youtube.'}],});

chrome.tabs.onCreated.addListener( tab => {
	console.log(tab);
	getAll((err,data)=>{
		console.log("getAll");
		if(err)
			console.log(err);
		else
			console.log(data);
	});
});

chrome.tabs.onSelectionChanged.addListener(function(tabId,selectInfo){
	chrome.tabs.query({active: true}, function(tabs){
		console.log(tabs);
	});
});

chrome.tabs.onUpdated.addListener( (tabId, changeInfo, tab) => {
	console.log("tab updated");
	// chrome.tabs.sendMessage(tabId, {action: "tab_updated"}, function(response) {
	// 	console.log("msg response");
	// 	console.log(response);
	// });

	// getAll((err,data)=>{
	// 	console.log("getAll");
	// 	if(err)
	// 		console.log(err);
	// 	else
	// 		console.log(data);
	// });
});


