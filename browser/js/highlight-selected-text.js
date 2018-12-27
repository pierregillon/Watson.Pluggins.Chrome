(function(){
    'use strict';

    var range = document.getSelection().getRangeAt(0);
    if (range && range.startOffset < range.endOffset) {
        highlight(range, "orange");
    }
    
    function highlight(range, color) {
        var span = document.createElement('SPAN');
        span.appendChild(range.extractContents());
        span.style.background = color;
        range.insertNode(span);
    }
})();