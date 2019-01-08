function Fact(range) {
    var self = this;

    self.FirstSelectedHtmlNodeXPath = range.startContainer.calculateXPath();
    self.LastSelectedHtmlNodeXPath = range.endContainer.calculateXPath();
    self.SelectedTextStartOffset = range.startOffset;
    self.SelectedTextEndOffset = range.endOffset;
    self.Wording = range.cloneContents()
                        .textContent
                        .split(/\r\n|\r|\n/g)
                        .filter(function (str) { return str.length != 0; })
                        .join(" ");
}