(function () {
    'use strict';

    chrome.runtime.onMessage.addListener(function (msg, _, sendResponse) {
        if(msg.type == "suspiciousFactsLoaded") {
            msg.suspiciousFacts.forEach(fact => {
                var textRange = createTextRange(fact);
                if (textRange) {
                    highlight(textRange, "red");
                }
            });
            sendResponse();
        }
        else if (msg.type == "getNewSuspiciousFact") {
            var selection = document.getSelection();
            if (selection) {
                var range = selection.getRangeAt(0);
                if (range) {
                    sendResponse(new Fact(range));
                    return;
                }
            }
            sendResponse(undefined);
        }
    });

    // ----- Functions

    function createTextRange(fact) {
        try {
            var textNodeStart = document.getElementByXPath(fact.startNodeXPath);
            var textNodeEnd = document.getElementByXPath(fact.endNodeXPath);
            var range = new Range();
            range.setStart(textNodeStart, fact.startOffset);
            range.setEnd(textNodeEnd, fact.endOffset);
            return range;
        }
        catch (error) {
            console.error(error);
        }
    }

    function highlight(range, color) {
        var span = document.createElement('SPAN');
        span.appendChild(range.extractContents());
        span.style.background = color;
        range.insertNode(span);
    }
})();