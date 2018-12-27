(function(){
    'use strict';

    var range = document.getSelection().getRangeAt(0);
    if (range && range.startOffset < range.endOffset) {
        highlight(range, "orange");
    }
    
})();