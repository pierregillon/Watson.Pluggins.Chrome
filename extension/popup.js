let saveFakeNews = document.getElementById('saveFakeNews');
let noTextSelected = document.getElementById('noTextSelected');
let selectedText = document.getElementById('selectedText');
let fact = document.getElementById('fact');
let source = document.getElementById('source');

saveFakeNews.onclick = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, "highlightText");
    });
};

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, "getSelectedText", function(data) {
        if(data && data.text && data.text.length > 1) {
            selectedText.innerText = data.text;
            fact.style.display = "visible";
            saveFakeNews.disabled = false;
            noTextSelected.style.display = 'none';
            source.innerText = "Source : " + data.url.middleTrim(40);
        }
        else {
            fact.style.display = "none";
            noTextSelected.style.display = 'visible';
            saveFakeNews.disabled = true;
        }
    });
});

// ----- Utils

Object.defineProperty(String.prototype, "middleTrim", {
    value: function middleTrim(maxCharacterCount) {
        if(this.length > maxCharacterCount) {
            var half = maxCharacterCount / 2;
            var start = this.substr(0, half);
            var end = this.substr(this.length - half, half);;
            return start + "..." + end
        }
        return value;
    },
    writable: true,
    configurable: true
});

