
// function DOMtoString(document_root) { 
// }


// chrome.runtime.sendMessage({
//    action: "countTime",
//    source: DOMtoString(document)
// });


if (chrome.runtime.lastError) {
	console.log("playlist service error");
}

function addToPlayList(urlVal,prior=false) {
	console.log("addToPlayList() called")
	var theValue = urlVal;
	if (!theValue) {
		console.log('Error: No value specified');
	  	return;
	}

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

 /**
  * SERVICES FOR PLAYLIST
  */

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

function getAll(callback){
	chrome.storage.local.get('playlist', (result) => {
		if(result.playlist){
			var dataArr = JSON.parse(result.playlist);
			callback(null,dataArr);
			
		}else{
			callback(null,null);
		}
		if (chrome.runtime.lastError) {
			callback(chrome.runtime.lastError,null);
		}
    });
}