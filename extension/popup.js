let saveFakeNews = document.getElementById('saveFakeNews');
saveFakeNews.onclick = function(element) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, "highlightText");
    });
};

let selectedText = document.getElementById('selectedText');
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, "getSelectedText", function(text){
        selectedText.innerText = text;
    });
});