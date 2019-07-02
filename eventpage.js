let addToPlayListContextMenuItem = {
    "id": "add_to_playlist",
    "title": "Add To Playlist",
    "contexts": ["video","image","frame"]
};



chrome.webNavigation.onCompleted.addListener( function(details) {

}, {url: [{hostContains: '.youtube.'}],});

chrome.contextMenus.create(addToPlayListContextMenuItem, function(){
    console.log("context created");
    if (chrome.runtime.lastError) {
        console.log("error in context menu creation");
    }
});


chrome.contextMenus.onClicked.addListener(function(data){

    if(data.menuItemId===addToPlayListContextMenuItem.id){
        // console.log(data);
        addToPlayList(data.linkUrl).then(playlistUpdated=>{
            alert("Video added to playlist");
            console.log(playlistUpdated);
        }).catch(err=>console.log(err));
    }
});

