import HttpClient from './domain/HttpClient'
import AuthenticationService from './domain/AuthenticationService'
import RenewTokenHttpClient from './domain/RenewTokenHttpClient'
import FactRepository from './domain/FactRepository'

var client = new HttpClient("http://localhost:5000", chrome.storage.sync);
var authenticationService = new AuthenticationService(client, chrome.storage.sync);
var renewClient = new RenewTokenHttpClient(client, chrome.storage.sync, authenticationService);
var factRepository = new FactRepository(renewClient);

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.get(["userId"], function(result) {
        if (!result.userId) {
            authenticationService.register({ userId: uuidv4() })
                .catch(function (error) {
                    console.error(error.message);
                    disableExtension();
                });
        }
    })
});

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
            factRepository.getSuspiciousFacts(tab.url)
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
    chrome.browserAction.setIcon({tabId: tabId, path: "./images/icon-detective16.png"});
}

function disableExtension(tabId) {
    chrome.browserAction.setIcon({tabId: tabId, path: "./images/icon-detective16-disabled.png"});
    chrome.browserAction.disable(tabId);
}

function isUrlAccepted(url) {
    return isHttpRequest(url) && hasValidDomain(url);
}

function isHttpRequest(url) {
    return url.startsWith("http");
}

function hasValidDomain(url) {
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

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}