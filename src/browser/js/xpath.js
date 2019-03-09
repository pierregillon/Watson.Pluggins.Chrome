Object.defineProperty(Node.prototype, "calculateXPath", {
	value: calculateXPath,
	writable: true,
	configurable: true
});

Object.defineProperty(Document.prototype, "getElementByXPath", {
	value: getElementByXPath,
	writable: true,
	configurable: true
});

function getElementByXPath(xPath) {
	var evaluation = this.evaluate(xPath, document, null, XPathResult.ANY_TYPE, null);
	if (evaluation) {
		return evaluation.iterateNext();
	}
	return '';
}

function calculateXPath() {
	if (this.nodeType != Node.ELEMENT_NODE && this.nodeType != Node.TEXT_NODE) {
		return '';
	}
	if (this.id) {
		return '//*[@id="' + this.id + '"]';
	}

	if (this.parentNode) {
		return this.parentNode.calculateXPath() + "/" + buildXPath(this);
	}
	else {
		return buildXPath(this);
	}
}

function buildXPath(element) {
	var tagName = '';
	if (element.nodeType == Node.TEXT_NODE) {
		tagName = "text()";
	}
	else {
		tagName = element.localName;
	}

	if (element.prefix) {
		tagName = element.prefix + ":" + tagName;
	}

	var ciblingIndex = getSiblingIndex(element);
	if (ciblingIndex != -1) {
		tagName = tagName + "[" + ciblingIndex + "]";
	}

	return tagName;
}

function getSiblingIndex(element) {
	var index = 0;
	var hasFollowingSiblings = false;

	for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
		if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
			continue;
		if (sibling.nodeName == element.nodeName)
			index++;
	}

	for (var sibling = element.nextSibling; sibling; sibling = sibling.nextSibling) {
		if (sibling.nodeName == element.nodeName) {
			hasFollowingSiblings = true;
			break;
		}
	}

	if (index || hasFollowingSiblings) {
		return index + 1;
	}
	return -1;
}