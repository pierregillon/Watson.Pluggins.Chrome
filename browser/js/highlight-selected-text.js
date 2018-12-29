(function(){
    'use strict';
    
    var range = document.getSelection().getRangeAt(0);
    if (range) {
        var rangeData = JSON.parse(localStorage.getItem('ranges') || '[]');
        rangeData.push({
            paragraphSelector: getQuerySelector(range.commonAncestorContainer.parentElement), 
            textNodeStartIndex: getChildNodeIndex(range.commonAncestorContainer.parentElement, range.startContainer), 
            textNodeEndIndex: getChildNodeIndex(range.commonAncestorContainer.parentElement, range.endContainer), 
            offsetStart: range.startOffset, 
            offsetEnd: range.endOffset
        });
        localStorage.setItem('ranges', JSON.stringify(rangeData));
        highlight(range, "orange");
    }

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
    
    function highlight(range, color) {
        var span = document.createElement('SPAN');
        span.appendChild(range.extractContents());
        span.style.background = color;
        range.insertNode(span);
    }
})();