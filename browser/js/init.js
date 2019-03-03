(function () {
    'use strict';

    const overlay = new Overlay();
    const suspiciousFactClassNames = "watson fact suspicious";
    const suspiciousFactOverlayClassNames = "watson fact overlay";

    chrome.runtime.onMessage.addListener(function (msg, _, sendResponse) {
        if (msg.type == "suspiciousFactsLoaded") {
            highlightFacts(msg.suspiciousFacts);
            sendResponse();
        }
        else if (msg.type == "getNewSuspiciousFact") {
            sendResponse(createNewFactFromSelectedTextRange());
        }
    });

    // ----- Functions

    function createNewFactFromSelectedTextRange() {
        var textRange = getSelectedTextRange();
        if (!textRange) {
            return undefined;
        }
        else {
            return {
                fact: new Fact(textRange),
                conflict: isTextRangeIntersectingExistingFact(textRange)
            };
        }
    }

    function getSelectedTextRange() {
        var selection = document.getSelection();
        if (selection && selection.rangeCount > 0) {
            return selection.getRangeAt(0);
        }
        return undefined;
    }

    function isTextRangeIntersectingExistingFact(range) {
        var elements = document.getElementsByClassName(suspiciousFactClassNames);
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (range.intersectsNode(element)) {
                return true;;
            }
        }
        return false;
    }

    function highlightFacts(facts) {
        var ranges = [];
        facts.forEach(fact => {
            var textRange = createTextRange(fact);
            if (textRange) {
                var nodeClone = textRange.cloneContents();
                var currentWording = nodeClone.textContent
                    .split(/\r\n|\r|\n|\ /g)
                    .filter(function (str) { return str.length != 0; })
                    .join(" ");

                if (fact.wording === currentWording) {
                    ranges.push(textRange);
                }
                else {
                    console.warn("Suspicious fact wording changed. Ignored.")
                }
            }
        });
        ranges.forEach(range => {
            highlightTextRange(range);
        });
    }

    function createTextRange(fact) {
        return createTextRangeFromXPath(fact) || createTextRangeFromTextSearch(fact);
    }

    function createTextRangeFromXPath(fact) {
        try {
            var textNodeStart = document.getElementByXPath(fact.startNodeXPath);
            var textNodeEnd = document.getElementByXPath(fact.endNodeXPath);
            var range = new Range();
            range.setStart(textNodeStart, fact.startOffset);
            range.setEnd(textNodeEnd, fact.endOffset);
            return range;
        }
        catch (error) {
            if (error && (error.name === "TypeError" || error.name == "IndexSizeError")) {
                console.warn("Failed to display suspicious fact text range from xpath.");
            }
            else {
                console.warn("Failed to display suspicious fact text range from xpath. " + error);
            }
            return undefined;
        }
    }

    function createTextRangeFromTextSearch(fact) {
        if (window.find(fact.wording)) {
            var textRange = document.getSelection().getRangeAt(0).cloneRange();
            document.getSelection().removeAllRanges();
            return textRange;
        }
        else {
            console.warn("Failed to display suspicious fact text range from wording search :  " + fact.wording);
            return undefined;
        }
    }

    function highlightTextRange(range) {
        try {
            var element = createHighlightElement();
            var extract = range.extractContents();
            element.appendChild(extract);
            range.insertNode(element);
        }
        catch (error) {
            console.error(error);
        }
    }

    function createHighlightElement() {
        var element = document.createElement('SPAN');
        element.className = suspiciousFactClassNames;
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
            overlay.className = suspiciousFactOverlayClassNames;
            return overlay;        
        }
    }

})();