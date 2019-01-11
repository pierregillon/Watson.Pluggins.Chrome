let saveFakeNews = document.getElementById('saveFakeNews');
let noTextSelected = document.getElementById('noTextSelected');
let selectedText = document.getElementById('selectedText');
let fact = document.getElementById('fact');
let source = document.getElementById('source');

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var message = {type: "getNewSuspiciousFact"};
    chrome.tabs.sendMessage(tabs[0].id, message, function(selectedSuspiciousFact) {
        if(selectedSuspiciousFact && selectedSuspiciousFact.wording && selectedSuspiciousFact.wording.length > 1) {
            selectedText.innerText = selectedSuspiciousFact.wording;
            fact.style.display = "visible";
            noTextSelected.style.display = 'none';
            source.innerText = "Source : " + tabs[0].url.middleTrim(40);
            
            saveFakeNews.disabled = false;
            saveFakeNews.onclick = function() {
                chrome.runtime.sendMessage({
                    type: "reportNewSuspiciousFact",
                    newSuspiciousFact: selectedSuspiciousFact
                });
            };
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

