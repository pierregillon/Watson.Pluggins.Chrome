(function () {
    'use strict';

    var repository = new FalseInformationRepository(new HttpClient("http://localhost:5000"));

    chrome.runtime.onMessage.addListener(function (msg, _, sendResponse) {
        if (msg == "getSelectedText") {
            var selectedText = getSelectedText();
            sendResponse(selectedText);
        }
        else if (msg == "highlightText") {
            hightlightExistingFalseInformation();
        }
    });

    // ----- Initialize

    repository.getAllFalseInformation(document.URL, function (falseInformation) {
        falseInformation.forEach(data => {
            var range = createRange(
                data.firstTextNodeXPath,
                data.lastTextNodeXPath,
                data.offsetStart,
                data.offsetEnd);

            if (range) {
                highlight(range, "red");
            }
        });
    });

    // ----- Functions

    function getSelectedText() {
        var selection = document.getSelection();
        if (selection) {
            var range = selection.getRangeAt(0);
            if (range) {
                return range
                    .cloneContents()
                    .textContent
                    .split(/\r\n|\r|\n/g)
                    .filter(function (str) { return str.length != 0; })
                    .join(" ")
            }
        }
        return null;
    }

    function hightlightExistingFalseInformation() {
        var selection = document.getSelection();
        if (selection) {
            var range = selection.getRangeAt(0);
            if (range) {
                repository.report(document.URL, new FalseInformation(range), function () {
                    highlight(range, "orange");
                });
            }
        }
    }

    function FalseInformation(range) {
        var self = this;

        self.firstTextNodeXPath = Xpath.getElementXPath(range.startContainer);
        self.lastTextNodeXPath = Xpath.getElementXPath(range.endContainer);
        self.offsetStart = range.startOffset;
        self.offsetEnd = range.endOffset;
        self.text = range.cloneContents().textContent;
    }

    function FalseInformationRepository(httpClient) {
        var self = this;

        self.getAllFalseInformation = function (pageUrl, callback) {
            httpClient.GET("/api/fact?url=" + pageUrl, function (data) {
                callback(data);
            });
        }

        self.report = function (pageUrl, falseInformation, callback) {
            httpClient.POST("/api/fact?url=" + pageUrl, falseInformation, function (data) {
                callback(data);
            });
        }
    }

    function HttpClient(server) {
        var self = this;

        self.GET = function (url, callback) {
            var client = new XMLHttpRequest();
            client.open("GET", server + url);
            client.setRequestHeader("Content-Type", "text/json");
            client.send();
            client.onload = function () {
                if (client.status == 200) {
                    callback(JSON.parse(client.responseText));
                }
            }
        }

        self.POST = function (url, body, callback) {
            var data = new FormData();
            for (var key in body) {
                data.append(key, body[key]);
            }

            var client = new XMLHttpRequest();
            client.open("POST", server + url);
            client.send(data);
            client.onload = function () {
                if (client.status == 200) {
                    callback();
                }
            }
        }
    }

    function createRange(firstTextNodeXPath, lastTextNodeXPath, offsetStart, offsetEnd) {
        var textNodeStart = document.evaluate(firstTextNodeXPath, document, null, XPathResult.ANY_TYPE, null).iterateNext();
        var textNodeEnd = document.evaluate(lastTextNodeXPath, document, null, XPathResult.ANY_TYPE, null).iterateNext()
        var range = new Range();
        range.setStart(textNodeStart, offsetStart);
        range.setEnd(textNodeEnd, offsetEnd);
        return range;
    }
})();