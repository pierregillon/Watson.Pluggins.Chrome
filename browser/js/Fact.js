function Fact(range) {
    var self = this;

    self.FirstSelectedHtmlNodeXPath = Xpath.getElementXPath(range.startContainer);
    self.LastSelectedHtmlNodeXPath = Xpath.getElementXPath(range.endContainer);
    self.SelectedTextStartOffset = range.startOffset;
    self.SelectedTextEndOffset = range.endOffset;
    self.Wording = range.cloneContents().textContent;
}