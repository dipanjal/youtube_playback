
function DOMtoString(document_root) { 
}


chrome.runtime.sendMessage({
   action: "countTime",
   source: DOMtoString(document)
});