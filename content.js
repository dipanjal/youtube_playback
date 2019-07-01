var isPlaying = true;
// var wait = false;
// console.log('content script')
window.addEventListener('load',event=>{
	// console.log('windown loaded')
    chrome.storage.onChanged.addListener(function(changes, namespace) {
		var key = 'playlist';
		var storageChange = changes[key];
		if(storageChange){

			// if(storageChange.newValue && storageChange.newValue.length>0){
			// 	// wait=false;
			// 	isPlaying = true;
			// }
			
			console.log('Storage key "%s" in namespace "%s" changed. ' +
                        'Old value was "%s", new value is "%s".',
                        key,
                        namespace,
                        storageChange.oldValue,
                        storageChange.newValue);
		}

	});
	
	// monitorYTPlayer(document);

	var videoTag = document.querySelector('video');
	if(videoTag){
		console.log('video player found');
		videoTag.addEventListener('ended',function(){
			// console.log('ended')
			try{
				chrome.storage.sync.get('playlist', (result) => {
					if(result.playlist){
						var playListArr = JSON.parse(result.playlist);
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

});

// function monitorYTPlayer(document_root) {
// 	console.log('Monitor YTPlayer')
// 	var totalTimeTag = document_root.getElementsByClassName("ytp-time-duration")[0];
// 	if(totalTimeTag){
// 		var totalTime = totalTimeTag.innerHTML;
// 		setInterval(function(){
// 			console.log("isPlaying... "+isPlaying);
// 			if(isPlaying){
// 				var playPauseButton = document_root.querySelector(".ytp-play-button.ytp-button");
// 				var playerState =  playPauseButton.getAttribute("aria-label");
// 				var watchTime = document_root.getElementsByClassName("ytp-time-current")[0].innerHTML
// 				if(watchTime===totalTime){
// 					// wait=true;
// 					isPlaying = false;
// 					try{
// 						chrome.storage.sync.get('playlist', (result) => {
// 							if(result.playlist){
// 								var playListArr = JSON.parse(result.playlist);
// 								if(playListArr.length>0){
// 									// console.log("Travars Next Track");
// 									changeTrack(playListArr);
// 								}else{
// 									// wait = false;
// 								}
// 							}
// 						});	
// 					}catch(err){
// 						console.log(err);
// 					}
					
// 				}
// 			}
			
// 		},1000);
// 	}
// }



function changeTrack(playListArr){
    var nextTrack = playListArr.shift();
    console.log(nextTrack);
	var dataSerialized = JSON.stringify(playListArr);
	chrome.storage.sync.set({'playlist': dataSerialized}, () => {
		console.log('playlist updated');
		console.log(dataSerialized);
		// wait = false;
		// isPlaying = true;
		// Simulate a mouse click:
		window.location.href = nextTrack;
	});
}

function injectHTML(document){
    var tags = document.getElementsByTagName("ytd-compact-video-renderer");
    var oldCount = tags.length;
    
    setInterval(function(){
        tags = document.getElementsByTagName("ytd-compact-video-renderer");
        var newCount = tags.length;
        if(oldCount!=newCount){
            oldCount = newCount;
            for(var i=0; i<newCount; i++){
                var tag = tags[i];
                if(!tag.getElementsByClassName("add_to_play_list")[0]){
                    var node="<div class='add_to_play_list'>Add to playlist</div>";
                    tag.innerHTML+=node;
                    console.log(tag);
                }
            }
        }
	},1000);
}
