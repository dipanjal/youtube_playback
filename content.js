let isPlaying = true;
// let wait = false;
// console.log('content script')
window.addEventListener('load',event=>{
	console.log('windown loaded')

	document.addEventListener('yt-navigate-start',function(){
		console.log('navigated');
		monitorYTPlayer(document);
	});

    chrome.storage.onChanged.addListener(function(changes, namespace) {
    	console.log('storage change called');
		let key = 'playlist';
		let storageChange = changes[key];
		// console.log(storageChange);
		if(storageChange){

			console.log('Storage key "%s" in namespace "%s" changed. ' +
                        'Old value was "%s", new value is "%s"."',
                        key,
                        namespace,
                        storageChange.oldValue,
						storageChange.newValue);

			if(storageChange.newValue){
				let newValueArr = JSON.parse(storageChange.newValue);
				// console.log('new value length '+newValueArr.length);
				console.log("isplaying.."+isPlaying);

				/**
				 * when no video is playing and 
				 * the playlist is empty
				 * ------------------------
				 * just add a song into playlist and 
				 * browser will redirect to the video
				 */
				if(!isPlaying){
					if(!storageChange.oldValue || JSON.parse(storageChange.oldValue).length==0){
						console.log('go to final next track');
						changeTrack(newValueArr);
					}
					// if(newValueArr.length==1)
				}
			}
		}
	});
	
	monitorYTPlayer(document);
});

function monitorYTPlayer(document){
	let videoTag = document.querySelector('video');
	if(videoTag){
		console.log('video player found');
		videoTag.addEventListener('ended',function(){
			console.log("video ended");
			isPlaying = false;
			try{
				chrome.storage.local.get('playlist', (result) => {
					// console.log("fetch playlist")
					if(result.playlist){
						let playListArr = JSON.parse(result.playlist);
						if(playListArr.length>0){
							changeTrack(playListArr);
						}
					}
				});	
			}catch(err){
				console.log(err);
			}
			
		});
	}
}
function changeTrack(playListArr){
	console.log("next track");
	let nextTrack = playListArr.shift();
	console.log("Now PLaying");
    console.log(nextTrack);
	let dataSerialized = JSON.stringify(playListArr);
	chrome.storage.local.set({'playlist': dataSerialized}, () => {
		console.log('current playlist');
		console.log(dataSerialized);
		// wait = false;
		isPlaying = true;
		// setTimeout(function(){
		// 	console.log('delayed')
		// },5000);
		// Simulate a mouse click:
		// window.location.href = nextTrack;
		window.location.replace(nextTrack.toString());
	});
}

function injectHTML(document){
    let tags = document.getElementsByTagName("ytd-compact-video-renderer");
    let oldCount = tags.length;
    
    setInterval(function(){
        tags = document.getElementsByTagName("ytd-compact-video-renderer");
        let newCount = tags.length;
        if(oldCount!=newCount){
            oldCount = newCount;
            for(let i=0; i<newCount; i++){
                let tag = tags[i];
                if(!tag.getElementsByClassName("add_to_play_list")[0]){
                    let node="<div class='add_to_play_list'>Add to playlist</div>";
                    tag.innerHTML+=node;
                    console.log(tag);
                }
            }
        }
	},1000);
}
