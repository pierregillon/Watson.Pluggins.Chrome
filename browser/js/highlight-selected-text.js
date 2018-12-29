(function(){
    'use strict';

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

        self.paragraphSelector = getQuerySelector(range.commonAncestorContainer.parentElement);
        self.textNodeStartIndex = getChildNodeIndex(range.commonAncestorContainer.parentElement, range.startContainer);
        self.textNodeEndIndex= getChildNodeIndex(range.commonAncestorContainer.parentElement, range.endContainer);
        self.offsetStart = range.startOffset;
        self.offsetEnd = range.endOffset;
        self.text = range.cloneContents().textContent;

        function getChildNodeIndex(container, node) {
            for(var i=0; i < container.childNodes.length; i++) {
                if(container.childNodes[i] == node) {
                    return i;
                }
            }
            return -1;
        }
    
        function getQuerySelector(element) {
            if(!element || !element.tagName || element.tagName === "HTML") {
                return undefined;
            }
            var parentQuerySelector = getQuerySelector(element.parentElement);
            if(parentQuerySelector) {
                return parentQuerySelector + " > " + element.tagName.toLowerCase();
            }
            return element.tagName.toLowerCase();
        }
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