function Fact(range) {
    var self = this;

    self.startNodeXPath = range.startContainer.calculateXPath();
    self.endNodeXPath = range.endContainer.calculateXPath();
    self.startOffset = range.startOffset;
    self.endOffset = range.endOffset;
    self.wording = range.cloneContents()
                        .textContent
                        .split(/\r\n|\r|\n/g)
                        .filter(function (str) { return str.length != 0; })
                        .join(" ");
}