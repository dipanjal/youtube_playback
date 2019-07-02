
// function DOMtoString(document_root) { 
// }


// chrome.runtime.sendMessage({
//    action: "countTime",
//    source: DOMtoString(document)
// });

/**
 * A dedicated service for playlist crud operation
 */

if (chrome.runtime.lastError) {
	console.log("playlist service error");
}

function isValidUrl(url){
	let regexp = /https:\/\/www.youtube.com\/watch\?v=[A-Z,a-z,0-9]+/g;
	if(regexp.test(url)){
		return true;
	}
	return false;
}

/**
 *
 * @returns {Promise<array,err>}
 */
function getPlaylistData(){
	return new Promise((resolve, reject) => {
		chrome.storage.local.get('playlist', (result) => {
			if(result.playlist){
				let dataArr = JSON.parse(result.playlist);
				if(dataArr && dataArr.length>0){
					resolve(dataArr);
				}else{
					resolve(null);
				}
			}else{
				resolve(null);
			}
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
			}
		});
	});
}

/**
 *
 * @param urlVal
 * @returns {Promise<err,currentPlaylistArr>}
 */
function addToPlayList(urlVal) {
	return new Promise((resolve, reject) => {
		console.log("addToPlayList()");
		if (!urlVal) {
			reject('Error: No value specified');
		}
		else if(isValidUrl(urlVal)){
			getPlaylistData().then(data=>{
				data?data.push(urlVal):data = [urlVal];
				return save(JSON.stringify(data));
			}).then(currentPlaylistArr => {
				console.log(currentPlaylistArr);
				resolve(currentPlaylistArr)
			}).catch(err=>console.log(err));
		}else{
			reject("invalid url: "+urlVal);
		}
	});

}

 /**
  * SERVICES FOR PLAYLIST
  */

/**
 * SAVE
 * @param dataSerialized ==> Serialized DataArray
 */
function save(dataSerialized){
	return new Promise((resolve, reject) => {
		chrome.storage.local.set({'playlist': dataSerialized}, () => {
			console.log('Playlist Updated');
			resolve(JSON.parse(dataSerialized));
		});
		if (chrome.runtime.lastError) {
			console.log('Save Error');
			reject(chrome.runtime.lastError);
		}
	});

}

/**
 *
 * @returns {Promise<boolean,error>}
 */
function clearPlaylist(){
	return new Promise((resolve,reject)=>{
		try{
			chrome.storage.local.clear(()=>{
				console.log("playlist cleared")
				resolve(true);
			});
		}catch(err){
			console.log(err);
			reject(err);
		}
		if (chrome.runtime.lastError) {
			reject(chrome.runtime.lastError)
		}
	});
}

