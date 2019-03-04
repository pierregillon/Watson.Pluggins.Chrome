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
                tabId: tabId
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