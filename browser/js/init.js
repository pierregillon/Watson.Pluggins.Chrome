(function () {
    'use strict';

    var repository = new FactRepository(new HttpClient("http://localhost:5000"));

    chrome.runtime.onMessage.addListener(function (msg, _, sendResponse) {
        if (msg == "getSelectedText") {
            var selectedText = getUserSelectedText();
            sendResponse({
                url: document.URL,
                text: selectedText
            });
        }
        else if (msg == "highlightText") {
            createSuspiciousFactFromSelectedText();
        }
    });

    // ----- Initialize

    repository.getAllFalseInformation(document.URL).then(function (factList) {
        factList.forEach(data => {
            var textRange = createTextRange(
                data.firstTextNodeXPath,
                data.lastTextNodeXPath,
                data.startOffset,
                data.endOffset);

            if (textRange) {
                highlight(textRange, "red");
            }
        });
    });

    // ----- Functions

    function getUserSelectedText() {
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

    function createSuspiciousFactFromSelectedText() {
        var selection = document.getSelection();
        if (selection) {
            var range = selection.getRangeAt(0);
            if (range) {
                repository.report(document.URL, new Fact(range)).then(function () {
                    highlight(range, "orange");
                });
            }
        }
    }

    function createTextRange(firstTextNodeXPath, lastTextNodeXPath, startOffset, endOffset) {
        var textNodeStart = document.evaluate(firstTextNodeXPath, document, null, XPathResult.ANY_TYPE, null).iterateNext();
        var textNodeEnd = document.evaluate(lastTextNodeXPath, document, null, XPathResult.ANY_TYPE, null).iterateNext()
        var range = new Range();
        range.setStart(textNodeStart, startOffset);
        range.setEnd(textNodeEnd, endOffset);
        return range;
    }
})();