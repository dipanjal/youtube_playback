var wait = false;
var nextTrack = false;
function DOMtoString(document_root) { 
	var totalTime = document_root.getElementsByClassName("ytp-time-duration")[0].innerHTML
	
	setInterval(function(){
		if(!wait){
			var playPauseButton = document_root.querySelector(".ytp-play-button.ytp-button");
			var playerState =  playPauseButton.getAttribute("aria-label")
											
			var watchTime = document_root.getElementsByClassName("ytp-time-current")[0].innerHTML
			// console.log(playerState)
			if(watchTime===totalTime){
				
				// console.log("Travars Next Track");
				chrome.storage.sync.get('playlist', (result) => {
					// console.log(JSON.parse(result.playlist))
					if(result.playlist){
						wait=true;
						var playListArr = JSON.parse(result.playlist);
						if(playListArr.length>0){
							console.log("Travars Next Track");
							changeTrack(playListArr);
						}else{
							wait = false;
						}
					}
				});
			}
		}
		
	},1000);
}

function changeTrack(playListArr){
	var nextTrack = playListArr.pop();
	var dataSerialized = JSON.stringify(playListArr);
	chrome.storage.sync.set({'playlist': dataSerialized}, () => {
		console.log('playlist updated');
		console.log(dataSerialized);
		wait = false;
		// Simulate a mouse click:
		window.location.href = nextTrack;
	});
}

chrome.runtime.sendMessage({
   action: "countTime",
   source: DOMtoString(document)
});