var repository = new FactRepository(new HttpClient("http://localhost:5000"));

let reportFactButton = document.getElementById('saveFakeNews');
let noTextSelected = document.getElementById('noTextSelected');
let selectedText = document.getElementById('selectedText');
let fact = document.getElementById('fact');
let source = document.getElementById('source');

let reportButtonOriginalText = reportFactButton.textContent;

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "getNewSuspiciousFact"}, function(newSuspiciousFact) {
        if (newSuspiciousFact && newSuspiciousFact.wording && newSuspiciousFact.wording.length > 1) {
            showSuspiciousFact(newSuspiciousFact.wording, tabs[0].url);
            subscribeToClick(tabs[0], newSuspiciousFact);
        }
        else {
            showNoSelectionInformation();
        }
    });
});

// ----- Utils
function showSuspiciousFact(wording, url) {
    selectedText.innerText = wording;
    fact.style.display = "visible";
    noTextSelected.style.display = 'none';
    source.innerText = "Source : " + url.middleTrim(40);
    reportFactButton.disabled = false;
}

function showNoSelectionInformation() {
    fact.style.display = "none";
    noTextSelected.style.display = 'visible';
    reportFactButton.disabled = true;
}

function subscribeToClick(tab, newSuspiciousFact) {
    reportFactButton.onclick = () => {
        disableReportButton();
        repository.report(tab.url, newSuspiciousFact)
            .then(() => {
                chrome.tabs.sendMessage(tab.id, {
                    type: "suspiciousFactsLoaded",
                    suspiciousFacts: [toReadModel(newSuspiciousFact)]
                });
                chrome.browserAction.getBadgeText({tabId: tab.id}, text => {
                    chrome.browserAction.setBadgeText({
                        text: (parseInt(text) + 1).toString(),
                        tabId: tab.id
                    });
                });
                let sucessElement = document.getElementById('success');
                sucessElement.innerText = "The suspicious fact has correctly been reported to the community.";
                reportFactButton.textContent = reportButtonOriginalText;
                reportFactButton.disabled = true;
            }).catch(function(error) {
                let errorElement = document.getElementById('error');
                errorElement.innerText = error.message;
                enableReportButton();
            });
    };
}

function disableReportButton() {
    reportFactButton.textContent = "...";
    reportFactButton.disabled = true;
}

function enableReportButton() {
    reportFactButton.textContent = reportButtonOriginalText;
    reportFactButton.disabled = false;
}

function toReadModel(self) {
    return {
        wording: self.wording,
        startNodeXPath: self.startNodeXPath,
        endNodeXPath: self.endNodeXPath,
        startOffset: self.startOffset,
        endOffset: self.endOffset
    };
}

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

