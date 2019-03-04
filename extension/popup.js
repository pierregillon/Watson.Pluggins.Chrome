var client = new HttpClient("http://localhost:5000", chrome.storage.sync);
var authenticationService = new AuthenticationService(client, chrome.storage.sync);
var renewClient = new RenewTokenHttpClient(client, chrome.storage.sync, authenticationService);
var factRepository = new FactRepository(renewClient);
var popupView = new PopupView()
var popupController = new PopupController(factRepository, popupView);

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "getNewSuspiciousFact"}, function(response) {
        if (response && response.fact) {
            popupController.displaySuspiciousFact({
                fact: response.fact,
                conflict: response.conflict,
                url: tabs[0].url,
                tabId: tabs[0].id
            });
        }
        else {
            popupView.showNoSelectionInformation();
        }
    });
});

function PopupController(factRepository, popupView) {
    var self = this;

    self.displaySuspiciousFact = function(context) {
        if (context.fact && context.fact.wording && context.fact.wording.length > 1) {
            popupView.showFactContext(context);
            subscribeToClick(context.tabId, context.url, context.fact);
        }
        else {
            popupView.showNoSelectionInformation();
        }
    }
    
    function subscribeToClick(tabId, url, newSuspiciousFact) {
        popupView.onReportButtonClick(() => {
            popupView.loading();
            factRepository.report(url, newSuspiciousFact)
                .then(() => {
                    sendToUserBrowser(tabId, newSuspiciousFact);
                    updateBadge(tabId);
                }).then(function(){
                    popupView.loaded();
                    popupView.showSuccess("The suspicious fact has correctly been reported to the community.");
                    popupView.disableReportButton();
                }).catch(function(error) {
                    popupView.loaded();
                    popupView.showError(error.message);
                });
        });
    }

    function sendToUserBrowser(tabId, newSuspiciousFact) {
        chrome.tabs.sendMessage(tabId, {
            type: "suspiciousFactsLoaded",
            suspiciousFacts: [toReadModel(newSuspiciousFact)]
        });
    }

    function updateBadge(tabId){
        chrome.browserAction.getBadgeText({tabId: tabId}, text => {
            chrome.browserAction.setBadgeText({
                text: (parseInt(text) + 1).toString(),
                tabId: tab.id
            });
        });
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
}

function PopupView() {
    var self = this;

    let reportFactButton = document.getElementById('saveFakeNews');
    let noTextSelected = document.getElementById('noTextSelected');
    let selectedText = document.getElementById('selectedText');
    let fact = document.getElementById('fact');
    let source = document.getElementById('source');
    let reportButtonOriginalText = reportFactButton.textContent;

    self.onReportButtonClick = function(callback) {
        reportFactButton.onclick = callback; 
    };

    self.showFactContext = function(context) {
        selectedText.innerText = context.fact.wording;
        fact.style.display = "visible";
        noTextSelected.style.display = 'none';
        source.innerText = "Source : " + context.url.middleTrim(40);
    
        if (context.conflict) {
            showError("Your selection contains fact already reported. Please adjust you selection to new fact.");
            reportFactButton.disabled = true;
        }
        else {
            reportFactButton.disabled = false;
        }
    }
    
    self.showError = function(error) {
        document.getElementById("error").innerText = error;
    }
    
    self.showSuccess = function(message) {
        document.getElementById("success").innerText = message;
    }
    
    self.showNoSelectionInformation = function() {
        fact.style.display = "none";
        noTextSelected.style.display = 'visible';
        reportFactButton.disabled = true;
    }
    
    self.loading = function() {
        reportFactButton.textContent = "...";
        reportFactButton.disabled = true;
    }
    
    self.loaded = function() {
        reportFactButton.textContent = reportButtonOriginalText;
        reportFactButton.disabled = false;
    }
    
    self.disableReportButton = function() {
        reportFactButton.disabled = true;
    }
}