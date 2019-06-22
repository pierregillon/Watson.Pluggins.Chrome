import HttpClient from '../network/httpClient'
import RenewTokenHttpClient from '../network/renewTokenHttpClient'
import AuthenticationService from '../api/authenticationService'
import FactRepository from '../api/factRepository'
import PopupView from './popupView'
import PopupController from './popupController'
import '../utils/stringExtensions'

var client = new HttpClient(WATSON_API_URL, chrome.storage.sync);
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