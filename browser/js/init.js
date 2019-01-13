(function () {
    'use strict';

    chrome.runtime.onMessage.addListener(function (msg, _, sendResponse) {
        if(msg.type == "suspiciousFactsLoaded") {
            msg.suspiciousFacts.forEach(fact => {
                var textRange = createTextRange(fact);
                if (textRange) {
                    highlight(textRange);
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

    // ----- Overlay

    var overlay = new Overlay();

    function highlight(range) {
        var element = createHighlight();
        element.appendChild(range.extractContents());
        range.insertNode(element);
    }

    function createHighlight() {
        var element = document.createElement('SPAN');
        element.className = "highlight";
        element.onmouseenter = mouseEnterFact;
        element.onmouseleave = mouseLeaveFact;
        element.onmousemove = mouseMoveOnFact;
        return element;

        function mouseEnterFact(event) {
            this.overlaying = true;
            overlay.show(event.pageX, event.pageY);
        }
    
        function mouseLeaveFact() {
            this.overlaying = false;
            overlay.hide();
        }
    
        function mouseMoveOnFact(event) {
            if (this.overlaying) {
                overlay.show(event.pageX, event.pageY);
            }
        }
    }

    function Overlay() {
        var self = this;
        var domElement = null;
    
        self.show = function(x, y) {
            if (!domElement) {
                domElement = createDomElement();
                document.body.append(domElement);
            }
            domElement.style.left = (x + 5) + "px";
            domElement.style.top = (y - 35) + "px";
        }

        self.hide = function() {
            if(domElement) {
                document.body.removeChild(domElement);
                domElement = null;
            }
        }

        function createDomElement() {
            var overlay = document.createElement('SPAN');
            var imageUrl = chrome.runtime.getURL('extension/images/icon-detective16.png');
            overlay.innerHTML = "<img src=\"" + imageUrl + "\"> This fact has been reported as <strong>suspicious</strong> by a user.";
            overlay.className = "info-overlay";
            return overlay;        
        }
    }

})();