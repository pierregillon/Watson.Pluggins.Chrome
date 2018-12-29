(function(){
    'use strict';

    var repository = new FalseInformationRepository();

    chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
		if(msg == "getSelectedText") {
            var selectedText = getSelectedText();
            sendResponse(selectedText);
        }
        else if(msg == "highlightText") {
            hightlightExistingFalseInformation();
        }
    });

    // ----- Initialize

    var falseInformation = repository.getAllFalseInformation(document.URL);
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

    // ----- Functions

    function getSelectedText() {
        var selection = document.getSelection();
        if(selection) {
            var range = selection.getRangeAt(0);
            if (range) {
                return range
                    .cloneContents()
                    .textContent
                    .split(/\r\n|\r|\n/g)
                    .filter(function(str) {return str.length != 0; })
                    .join(" ")
            }
        }
        return null;
    }

    function hightlightExistingFalseInformation(){
        var selection = document.getSelection();
        if(selection) {
            var range = selection.getRangeAt(0);
            if (range) {
                repository.report(document.URL, new FalseInformation(range));
                highlight(range, "orange");
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

    function FalseInformationRepository(){
        var self = this;

        self.getAllFalseInformation = function(pageUrl) {
            var dictionary = JSON.parse(localStorage.getItem('false-information') || '{}');
            return dictionary[pageUrl] || [];
        }

        self.report = function(pageUrl, falseInformation) {
            var reportedSentences = JSON.parse(localStorage.getItem('false-information') || '{}');
            if(reportedSentences.hasOwnProperty(pageUrl) == false) {
                reportedSentences[pageUrl] = [];
            }
            reportedSentences[pageUrl].push(falseInformation);
            localStorage.setItem('false-information', JSON.stringify(reportedSentences));
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