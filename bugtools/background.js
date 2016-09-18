var baseUrl = "http://guard.pt.miui.com/battery-historian/";
var browser_tab;
// var toolPageWinId = -1;

function fileDownloadComplete(filename){
  var hostName = "com.miui.bugtools";
  // console.log("message: complete.");
  // console.log(filename);
  chrome.runtime.sendNativeMessage(hostName,
    {'filename':filename,'state':"complete"},
    function(response) {
      // console.log(chrome.runtime.lastError);
      console.log(response);
    });  
}

var downId;
function openTo (url){
	chrome.downloads.download(
		{url:url, saveAs:false, conflictAction:"overwrite"},
		function(downloadId){
			if (downloadId === undefined) {
				return;
			}
			downId = downloadId;
		}
	);
}

chrome.contextMenus.create({
	title: chrome.i18n.getMessage('menuTitle'),
	contexts: ['link'],
	onclick: function(clickInfo){
		openTo(clickInfo.linkUrl);//download link
	}
})

function init(){
  chrome.downloads.onChanged.addListener(function(downloadDelta){
    if(downloadDelta.id !== downId){
      return;
    }
    chrome.downloads.search({id:downId},function(obj){
      if(obj[0].state === "complete"){
        fileDownloadComplete(obj[0].filename);
      }
    });
  });
}
init();