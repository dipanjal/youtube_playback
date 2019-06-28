function DOMtoString(document_root) { 
	var totalTime = document_root.getElementsByClassName("ytp-time-duration")[0].innerHTML
	setInterval(function(){
		var watchTime = document_root.getElementsByClassName("ytp-time-current")[0].innerHTML
		// console.log(watchTime)
		if(watchTime===totalTime){
			console.log("TRACK FINISHED")
		}
	},1000);
	// var tags = document_root.getElementsByTagName('ytd-compact-video-renderer')
    // console.log(tags);
    // for (var x=0;x<tags.length;x++) { 
	// 	var tag="<div>Add to playlist</div>"+tags[x].innerHTML;  
	// 	console.log(tag); 
	// }

	
}
chrome.runtime.sendMessage({
   action: "countTime",
   source: DOMtoString(document)
});