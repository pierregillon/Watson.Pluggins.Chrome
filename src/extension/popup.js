import HttpClient from '../domain/HttpClient'
import AuthenticationService from '../domain/AuthenticationService'
import RenewTokenHttpClient from '../domain/RenewTokenHttpClient'
import FactRepository from '../domain/FactRepository'
import PopupView from './PopupView'
import PopupController from './PopupController'
import extend from '../domain/stringExtensions'

extend();

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