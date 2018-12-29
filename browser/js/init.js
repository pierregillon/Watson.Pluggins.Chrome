(function(){
    'use strict';

    var repository = new FalseInformationRepository();
    var falseInformation = repository.getAllFalseInformation();
    falseInformation.forEach(data => {
        var range = createRange(
            data.paragraphSelector, 
            data.textNodeStartIndex, 
            data.textNodeEndIndex, 
            data.offsetStart, 
            data.offsetEnd);
        
        if (range) {
            highlight(range, "red");
        }
    });

    function createRange(paragraphSelector, textNodeStartIndex, textNodeEndIndex, offsetStart, offsetEnd) {
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