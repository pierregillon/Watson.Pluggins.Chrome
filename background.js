var repository = new FactRepository(new HttpClient("http://localhost:5000"));

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(changeInfo.status == "complete") {
        repository.getSuspiciousFacts(tab.url).then(function (suspiciousFacts) {
            chrome.tabs.sendMessage(tabId, {
                type: "suspiciousFactsLoaded",
                suspiciousFacts: suspiciousFacts
            });
        });
    }
});

chrome.runtime.onMessage.addListener(function(message, sender, reply) {
    if(message.type == "reportNewSuspiciousFact") {
        chrome.tabs.query({active: true}, function(tabs) {
            repository.report(tabs[0].url, message.newSuspiciousFact).then(function () {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: "suspiciousFactsLoaded",
                    suspiciousFacts: [toReadModel(message.newSuspiciousFact)]
                });
            });
        });
    }
    reply();
});

function toReadModel(fact) {
    return {
        wording: fact.Wording,
        firstTextNodeXPath: fact.FirstSelectedHtmlNodeXPath,
        lastTextNodeXPath:fact.LastSelectedHtmlNodeXPath,
        startOffset: fact.SelectedTextStartOffset,
        endOffset: fact.SelectedTextEndOffset
    };
}