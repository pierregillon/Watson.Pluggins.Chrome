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

    repository.getAllFalseInformation(document.URL).then(function (falseInformation) {
        falseInformation.forEach(data => {
            var range = createRange(
                data.firstTextNodeXPath,
                data.lastTextNodeXPath,
                data.startOffset,
                data.endOffset);

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
                repository.report(document.URL, new FalseInformation(range)).then(function () {
                    highlight(range, "orange");
                });
            }
        }
    }

    function FalseInformation(range) {
        var self = this;

        self.FirstSelectedHtmlNodeXPath = Xpath.getElementXPath(range.startContainer);
        self.LastSelectedHtmlNodeXPath = Xpath.getElementXPath(range.endContainer);
        self.SelectedTextStartOffset = range.startOffset;
        self.SelectedTextEndOffset = range.endOffset;
        self.Wording = range.cloneContents().textContent;
    }

    function FalseInformationRepository(httpClient) {
        var self = this;

        self.getAllFalseInformation = function (pageUrl) {
            return httpClient.GET("/api/fact?url=" + btoa(pageUrl));
        }

        self.report = function (pageUrl, falseInformation) {
            return httpClient.POST("/api/fact?url=" + btoa(pageUrl), falseInformation);
        }
    }

    function HttpClient(server) {
        var self = this;

        self.GET = function (url) {
            return new Promise(function(resolve, reject) {
                var client = new XMLHttpRequest();
                client.open("GET", server + url);
                client.setRequestHeader("Content-Type", "text/json");
                client.send();
                client.onload = function () {
                    if (client.status == 200) {
                        resolve(JSON.parse(client.responseText));
                    }
                    else {
                        reject(client.status + " : " + client.responseText);
                    }
                }
              });
        }

        self.POST = function (url, body) {
            return new Promise(function(resolve, reject) {
                var data = new FormData();
                for (var key in body) {
                    data.append(key, body[key]);
                }

                var client = new XMLHttpRequest();
                client.open("POST", server + url);
                client.send(data);
                client.onload = function () {
                    if (client.status == 200) {
                        resolve();
                    }
                    else {
                        reject(client.status + " : " + client.responseText);
                    }
                }
            });
        }
    }

    function createRange(firstTextNodeXPath, lastTextNodeXPath, startOffset, endOffset) {
        var textNodeStart = document.evaluate(firstTextNodeXPath, document, null, XPathResult.ANY_TYPE, null).iterateNext();
        var textNodeEnd = document.evaluate(lastTextNodeXPath, document, null, XPathResult.ANY_TYPE, null).iterateNext()
        var range = new Range();
        range.setStart(textNodeStart, startOffset);
        range.setEnd(textNodeEnd, endOffset);
        return range;
    }
})();