(function(){
    'use strict';

    var range = document.getSelection().getRangeAt(0);
    if (range && range.startOffset < range.endOffset) {
        highlight(range);
    }

    function highlight(range) {
        var span = document.createElement('SPAN');
        span.appendChild(range.extractContents());
        span.style.background = "orange";
        range.insertNode(span);
    }    
})();