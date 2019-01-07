function Fact(range) {
    var self = this;

    self.FirstSelectedHtmlNodeXPath = Xpath.getElementXPath(range.startContainer);
    self.LastSelectedHtmlNodeXPath = Xpath.getElementXPath(range.endContainer);
    self.SelectedTextStartOffset = range.startOffset;
    self.SelectedTextEndOffset = range.endOffset;
    self.Wording = range.cloneContents()
                        .textContent
                        .split(/\r\n|\r|\n/g)
                        .filter(function (str) { return str.length != 0; })
                        .join(" ");
}