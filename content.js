let isPlaying = false;
// let wait = false;
// console.log('content script')
window.addEventListener('load',event=>{

	// chrome.runtime.onMessage.addListener( (any,sender,callback) => {
	// 	console.log("received message from background");
	// 	console.log(sender);
	// 	console.log(any);
	// 	callback("ok");
	// })



	chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
		console.log(request.event);
		console.log(request.data);
		sendResponse(request.event+":: ack from content script");
	});



	determinePLayingState(document);
	console.log('isPlaying: '+isPlaying);

	document.addEventListener('yt-navigate-start',function(){
		console.log('navigated');
		window.location.reload();
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
				console.log("isPlaying: "+isPlaying);

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

function isWatchPage(){
	var regexp = /https:\/\/www.youtube.com\/watch\?v=[A-Z,a-z,0-9]+/g;
	let url = document.location.href;
	if(regexp.test(url)){
		return true;
	}
	return false;
}


function determinePLayingState(document){
	try{
		// if(document.querySelector("ytd-app").getAttributeNode("is-watch-page")){
		// 	console.log('watch-page');
		// 	console.log(document.querySelector('video').readyState);
		// 	isPlaying = true;
		// }else{
		// 	console.log('not watch page')
		// 	isPlaying = false;
		// }
		let interval = null;
		if(isWatchPage()){
			console.log("watch page");
			interval = window.setInterval(function(){
				if(document.getElementsByClassName("ytp-play-button")[0].getAttribute("aria-label") === "Pause (k)"){
					isPlaying = true;
					clearInterval(interval);
				}else{
					isPlaying = false;
				}
				console.log("playing: "+isPlaying);
			},1000)
		}else {
			console.log("not a watch page");
			if(interval)
				clearInterval(interval);
		}
	}catch(err){
		console.log(err);
		isPlaying = false;
	}
}

function monitorYTPlayer(document){
	let videoTag = document.querySelector('video');
	if(videoTag){
		console.log('video player found');

        // videoTag.addEventListener('mouseover', function() {
        //     // var selection = videoTag.getSelection().toString().trim();
        //     console.log("mouse hovered on vid-thumb");
        //     chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
        //         console.log(response.farewell);
        //     });
        //     // console.log(selection);
        //     // chrome.runtime.sendMessage({
        //     //     request: 'updateContextMenu',
        //     //     selection: selection
        //     // });
        // });

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
				isPlaying = false;
			}
			
		});
	}
}
function changeTrack(playListArr){
	let nextTrack = playListArr.shift();
	console.log("Now PLaying");
    console.log(nextTrack);
	let dataSerialized = JSON.stringify(playListArr);
	chrome.storage.local.set({'playlist': dataSerialized}, () => {
		console.log('current playlist');
		console.log(dataSerialized);
		isPlaying = true;
		// window.location.replace(nextTrack.toString());
		window.location.href = nextTrack.toString();
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
