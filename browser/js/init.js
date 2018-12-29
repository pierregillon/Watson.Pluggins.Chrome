(function(){
    'use strict';

    chrome.runtime.onMessage.addListener(function(msg, _, sendResponse) {
		if(msg == "getSelectedText") {
			var selection = document.getSelection();
			if(selection) {
				var range = selection.getRangeAt(0);
				if (range) {
                    var text = range
                        .cloneContents()
                        .textContent
                        .split(/\r\n|\r|\n/g)
                        .filter(function(str) {return str.length != 0; })
                        .join(" ")
                        
					sendResponse(text);
				}
			}		
		}
	});

    var repository = new FalseInformationRepository();
    var falseInformation = repository.getAllFalseInformation();
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

    function createRange(firstTextNodeXPath, lastTextNodeXPath, offsetStart, offsetEnd) {
        var textNodeStart = document.evaluate(firstTextNodeXPath, document, null, XPathResult.ANY_TYPE, null).iterateNext();
        var textNodeEnd = document.evaluate(lastTextNodeXPath, document, null, XPathResult.ANY_TYPE, null).iterateNext()
        var range = new Range();
        range.setStart(textNodeStart, offsetStart);
        range.setEnd(textNodeEnd, offsetEnd);
        return range;
    }
    
    function FalseInformationRepository(){
        var self = this;

        self.getAllFalseInformation = function(pageUrl) {
            return JSON.parse(localStorage.getItem('ranges') || '[]');
        }

        self.report = function(pageUrl, falseInformation) {
            var reportedSentences = JSON.parse(localStorage.getItem('ranges') || '[]');
            reportedSentences.push(falseInformation);
            localStorage.setItem('ranges', JSON.stringify(reportedSentences));
        }
    }
})();