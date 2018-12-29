(function(){
	'use strict';
	
	var Xpath = {};
	
	Xpath.getElementXPath = function(element) 	{
		if (element && element.id)
			return '//*[@id="' + element.id + '"]';
		else
			return Xpath.getElementTreeXPath(element);
	};

	Xpath.getElementTreeXPath = function(element) 	{
		var paths = [];
		for (; element && element.nodeType == Node.ELEMENT_NODE || element.nodeType == Node.TEXT_NODE; 
			element = element.parentNode)
		{
			var index = 0;
			var hasFollowingSiblings = false;
			for (var sibling = element.previousSibling; sibling; 
				sibling = sibling.previousSibling)
			{
				// Ignore document type declaration.
				if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
					continue;

				if (sibling.nodeName == element.nodeName)
					++index;
			}

			for (var sibling = element.nextSibling; 
				sibling && !hasFollowingSiblings;
				sibling = sibling.nextSibling)
			{
				if (sibling.nodeName == element.nodeName)
					hasFollowingSiblings = true;
			}

			var tagName = '';
			if(element.nodeType == Node.TEXT_NODE) {
				tagName = "text()";
			}
			else if(element.prefix) {
				tagName = element.prefix + ":" + element.localName;
			} 
			else {
				tagName = element.localName;
			}
			var pathIndex = (index || hasFollowingSiblings ? "[" + (index + 1) + "]" : "");
			paths.splice(0, 0, tagName + pathIndex);
		}

		return paths.length ? "/" + paths.join("/") : null;
	};

    var repository = new FalseInformationRepository();
    var selection = document.getSelection();
    if(selection) {
        var range = selection.getRangeAt(0);
        if (range) {
            repository.report(document.URL, new FalseInformation(range));
            highlight(range, "orange");
        }
    }
    
    function highlight(range, color) {
        var span = document.createElement('SPAN');
        span.appendChild(range.extractContents());
        span.style.background = color;
        range.insertNode(span);
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
            return JSON.parse(localStorage.getItem('ranges') || '[]');
        }

        self.report = function(pageUrl, falseInformation) {
            var reportedSentences = JSON.parse(localStorage.getItem('ranges') || '[]');
            reportedSentences.push(falseInformation);
            localStorage.setItem('ranges', JSON.stringify(reportedSentences));
        }
	}

	
})();