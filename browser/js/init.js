(function () {
    'use strict';

    chrome.runtime.onMessage.addListener(function (msg, _, sendResponse) {
        if(msg.type == "suspiciousFactsLoaded") {
            msg.suspiciousFacts.forEach(fact => {
                var textRange = createTextRange(
                    fact.firstTextNodeXPath,
                    fact.lastTextNodeXPath,
                    fact.startOffset,
                    fact.endOffset);
    
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

    function createTextRange(firstTextNodeXPath, lastTextNodeXPath, startOffset, endOffset) {
        try {
            var textNodeStart = document.getElementByXPath(firstTextNodeXPath);
            var textNodeEnd = document.getElementByXPath(lastTextNodeXPath);
            var range = new Range();
            range.setStart(textNodeStart, startOffset);
            range.setEnd(textNodeEnd, endOffset);
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