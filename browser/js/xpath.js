(function(window){
    'use strict';

    var Xpath = {};
	
	Xpath.getElementXPath = function(element) 	{
		if (element && element.id)
			return '//*[@id="' + element.id + '"]';
		else
			return Xpath.getElementTreeXPath(element);
	};

	Xpath.getElementTreeXPath = function(element) 	{
		var paths = [];
		for (; element && element.nodeType == Node.ELEMENT_NODE || element.nodeType == Node.TEXT_NODE; 
			element = element.parentNode)
		{
			var index = 0;
			var hasFollowingSiblings = false;
			for (var sibling = element.previousSibling; sibling; 
				sibling = sibling.previousSibling)
			{
				// Ignore document type declaration.
				if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
					continue;

				if (sibling.nodeName == element.nodeName)
					++index;
			}

			for (var sibling = element.nextSibling; 
				sibling && !hasFollowingSiblings;
				sibling = sibling.nextSibling)
			{
				if (sibling.nodeName == element.nodeName)
					hasFollowingSiblings = true;
			}

			var tagName = '';
			if(element.nodeType == Node.TEXT_NODE) {
				tagName = "text()";
			}
			else if(element.prefix) {
				tagName = element.prefix + ":" + element.localName;
			} 
			else {
				tagName = element.localName;
			}
			var pathIndex = (index || hasFollowingSiblings ? "[" + (index + 1) + "]" : "");
			paths.splice(0, 0, tagName + pathIndex);
		}

		return paths.length ? "/" + paths.join("/") : null;
	};

    window.Xpath = Xpath;
})(window);