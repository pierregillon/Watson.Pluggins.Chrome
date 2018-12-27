(function(){
    'use strict';

    var range = document.getSelection().getRangeAt(0);
    if (range && range.startOffset < range.endOffset) {
        highlight(range);
    }

    var paragraphSelector = "#gc-pagecontent > article > div > section:nth-child(3) > p:nth-child(2)";
    var existingRange = getRange(paragraphSelector, 2, 2, 2, 20);
    if (existingRange && existingRange.startOffset < existingRange.endOffset) {
        highlight(existingRange);
    }

    function highlight(range) {
        var span = document.createElement('SPAN');
        span.appendChild(range.extractContents());
        span.style.background = "red";
        range.insertNode(span);
    }

    function getRange(paragraphSelector, textNodeStartIndex, textNodeEndIndex, offsetStart, offsetEnd) {
        var paragraph = document.querySelector(paragraphSelector);
        var textNodeStart = paragraph.childNodes[textNodeStartIndex];
        var textNodeEnd = paragraph.childNodes[textNodeEndIndex];
        var range = new Range();
        range.setStart(textNodeStart, offsetStart);
        range.setEnd(textNodeEnd, offsetEnd);
        return range;
    }
    
})();