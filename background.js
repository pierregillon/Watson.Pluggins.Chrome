var repository = new FactRepository(new HttpClient("http://localhost:5000"));

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == "loading") {
        if (isUrlAccepted(tab.url) == false) {
            disableExtension(tabId);
        }
        else {
            enableExtension(tabId);
        }
    }
    else if (changeInfo.status == "complete") {
        if (isUrlAccepted(tab.url)) {
            repository.getSuspiciousFacts(tab.url)
                .then(suspiciousFacts => {
                    updateBadge(tabId, suspiciousFacts.length);
                    chrome.tabs.sendMessage(tabId, {
                        type: "suspiciousFactsLoaded",
                        suspiciousFacts: suspiciousFacts
                    });
                }).catch(err => {
                    disableExtension(tabId);
                });
        }
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

function enableExtension(tabId) {
    chrome.browserAction.enable(tabId);
    chrome.browserAction.setIcon({tabId: tabId, path: "extension/images/icon-detective16.png"});
}

function disableExtension(tabId) {
    chrome.browserAction.setIcon({tabId: tabId, path: "extension/images/icon-detective16-disabled.png"});
    chrome.browserAction.disable(tabId);
}

function isUrlAccepted(url) {
    var domain = getDomain(url);
    switch (domain) {
        case undefined:
        case "google":
        case "facebook":
        case "booking":
        case "airbnb":
        case "twitter":
        case "instagram":
            return false;
        default:
            return true;
    }
}

function getDomain(url) {
    var url = new URL(url);
    var hostParts = url.hostname.split(".");
    if (url.hostname.startsWith("www")) {
        return hostParts[1].toLowerCase();
    }
    else {
        return hostParts[0].toLowerCase();
    }
}