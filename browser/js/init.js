(function(){
    'use strict';

    var rangeData = JSON.parse(localStorage.getItem('ranges') || '[]');
    if(rangeData) {
        rangeData.forEach(data => {
            var range = getRange(
                data.paragraphSelector, 
                data.textNodeStartIndex, 
                data.textNodeEndIndex, 
                data.offsetStart, 
                data.offsetEnd);
            
            if (range) {
                highlight(range, "red");
            }
        });
        
    }

    function getRange(paragraphSelector, textNodeStartIndex, textNodeEndIndex, offsetStart, offsetEnd) {
        var domElement = document.querySelector(paragraphSelector);
        if(!domElement) {   
            return undefined;
        }
        var textNodeStart = domElement.childNodes[textNodeStartIndex];
        var textNodeEnd = domElement.childNodes[textNodeEndIndex];
        var range = new Range();
        range.setStart(textNodeStart, offsetStart);
        range.setEnd(textNodeEnd, offsetEnd);
        return range;
    }
    
})();