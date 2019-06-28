
window.addEventListener('load',event=>{
    // console.log('content script');
    // console.log(event);
    // var tags = document.getElementsByTagName('ytd-compact-video-renderer')
    // console.log(tags);
    // for (var x=0;x<tags.length;x++) {
    //     var tag="<div>Add to playlist</div>"//+tags[x].innerHTML;
    //     console.log(tag);
    //     console.log(tag);
    //     //tags[x].innerHTML=tag
        
    //     var node = document.createElement("div");
    //     node.innerHTML = "Add to playlist";
    //     tag.appendChild(node);

    // }
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
    
});