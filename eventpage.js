let addToPlayListContextMenuItem = {
    "id": "add_to_playlist",
    "title": "Add To Playlist",
    "contexts": ["video","image"]
};

chrome.webNavigation.onCompleted.addListener( function(details) {

    chrome.contextMenus.create(addToPlayListContextMenuItem, function(){
        console.log("context created");
        if (chrome.runtime.lastError) {
            console.log("error in context menu creation");
        }
    });
	
}, {url: [{hostContains: '.youtube.'}],});


chrome.contextMenus.onClicked.addListener(function(data){
    
    if(data.menuItemId===addToPlayListContextMenuItem.id){
        console.log(data)
        addToPlayList(data.linkUrl);
    }
});

