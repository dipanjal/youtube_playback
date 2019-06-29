
window.addEventListener('load',event=>{

    chrome.storage.onChanged.addListener(function(changes, namespace) {
        for (var key in changes) {
            var storageChange = changes[key];
            console.log('Storage key "%s" in namespace "%s" changed. ' +
                        'Old value was "%s", new value is "%s".',
                        key,
                        namespace,
                        storageChange.oldValue,
                        storageChange.newValue);
        }
    });

    // var tags = document.getElementsByTagName("ytd-compact-video-renderer");
    // var oldCount = tags.length;
    
    // setInterval(function(){
    //     tags = document.getElementsByTagName("ytd-compact-video-renderer");
    //     var newCount = tags.length;
    //     if(oldCount!=newCount){
    //         oldCount = newCount;
    //         for(var i=0; i<newCount; i++){
    //             var tag = tags[i];
    //             if(!tag.getElementsByClassName("add_to_play_list")[0]){
    //                 var node="<div class='add_to_play_list'>Add to playlist</div>";
    //                 tag.innerHTML+=node;
    //                 console.log(tag);
    //             }
    //         }
    //     }
	// },1000);
});
