var repository = new FactRepository(new HttpClient("http://localhost:5000"));

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(changeInfo.status == "complete") {
        repository.getSuspiciousFacts(tab.url)
            .then(suspiciousFacts => {
                updateBadge(tabId, suspiciousFacts.length);
                chrome.tabs.sendMessage(tabId, {
                    type: "suspiciousFactsLoaded",
                    suspiciousFacts: suspiciousFacts
                });
            }).catch(err => {
                chrome.browserAction.setIcon({tabId: tabId, path: "extension/images/icon-detective16-disabled.png"});
                chrome.browserAction.disable(tabId);
            });
    }
});

chrome.runtime.onMessage.addListener(function(message, sender, reply) {
    chrome.tabs.query({active: true}, tabs => {
        if(message.type == "reportNewSuspiciousFact") {
            repository.report(tabs[0].url, message.newSuspiciousFact).then(() => {
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: "suspiciousFactsLoaded",
                    suspiciousFacts: [toReadModel(message.newSuspiciousFact)]
                });
            });
        }
        reply();
    });
});

function updateBadge(tabId, count) {
    chrome.browserAction.setBadgeText({
        text: count.toString(),
        tabId: tabId
    });
    chrome.browserAction.setBadgeBackgroundColor({
        color: 'red',
        tabId: tabId
    });
}