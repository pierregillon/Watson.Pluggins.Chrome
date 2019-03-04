/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/browser/js/init.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/browser/js/init.js":
/*!********************************!*\
  !*** ./src/browser/js/init.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("(function () {\r\n    'use strict';\r\n\r\n    const overlay = new Overlay();\r\n    const suspiciousFactClassNames = \"watson fact suspicious\";\r\n    const suspiciousFactOverlayClassNames = \"watson fact overlay\";\r\n\r\n    chrome.runtime.onMessage.addListener(function (msg, _, sendResponse) {\r\n        if (msg.type == \"suspiciousFactsLoaded\") {\r\n            highlightFacts(msg.suspiciousFacts);\r\n            sendResponse();\r\n        }\r\n        else if (msg.type == \"getNewSuspiciousFact\") {\r\n            sendResponse(createNewFactFromSelectedTextRange());\r\n        }\r\n    });\r\n\r\n    // ----- Functions\r\n\r\n    function createNewFactFromSelectedTextRange() {\r\n        var textRange = getSelectedTextRange();\r\n        if (!textRange) {\r\n            return undefined;\r\n        }\r\n        else {\r\n            return {\r\n                fact: new Fact(textRange),\r\n                conflict: isTextRangeIntersectingExistingFact(textRange)\r\n            };\r\n        }\r\n    }\r\n\r\n    function getSelectedTextRange() {\r\n        var selection = document.getSelection();\r\n        if (selection && selection.rangeCount > 0) {\r\n            return selection.getRangeAt(0);\r\n        }\r\n        return undefined;\r\n    }\r\n\r\n    function isTextRangeIntersectingExistingFact(range) {\r\n        var elements = document.getElementsByClassName(suspiciousFactClassNames);\r\n        for (let i = 0; i < elements.length; i++) {\r\n            const element = elements[i];\r\n            if (range.intersectsNode(element)) {\r\n                return true;;\r\n            }\r\n        }\r\n        return false;\r\n    }\r\n\r\n    function highlightFacts(facts) {\r\n        var ranges = [];\r\n        facts.forEach(fact => {\r\n            var textRange = createTextRange(fact);\r\n            if (textRange) {\r\n                var nodeClone = textRange.cloneContents();\r\n                var currentWording = nodeClone.textContent.toWording();\r\n                if (fact.wording === currentWording) {\r\n                    ranges.push(textRange);\r\n                }\r\n                else {\r\n                    console.warn(\"Suspicious fact wording changed. Ignored.\")\r\n                }\r\n            }\r\n        });\r\n        ranges.forEach(range => {\r\n            highlightTextRange(range);\r\n        });\r\n    }\r\n\r\n    function createTextRange(fact) {\r\n        return createTextRangeFromXPath(fact) || createTextRangeFromTextSearch(fact);\r\n    }\r\n\r\n    function createTextRangeFromXPath(fact) {\r\n        try {\r\n            var textNodeStart = document.getElementByXPath(fact.startNodeXPath);\r\n            var textNodeEnd = document.getElementByXPath(fact.endNodeXPath);\r\n            var range = new Range();\r\n            range.setStart(textNodeStart, fact.startOffset);\r\n            range.setEnd(textNodeEnd, fact.endOffset);\r\n            return range;\r\n        }\r\n        catch (error) {\r\n            if (error && (error.name === \"TypeError\" || error.name == \"IndexSizeError\")) {\r\n                console.warn(\"Failed to display suspicious fact text range from xpath.\");\r\n            }\r\n            else {\r\n                console.warn(\"Failed to display suspicious fact text range from xpath. \" + error);\r\n            }\r\n            return undefined;\r\n        }\r\n    }\r\n\r\n    function createTextRangeFromTextSearch(fact) {\r\n        if (window.find(fact.wording)) {\r\n            var textRange = document.getSelection().getRangeAt(0).cloneRange();\r\n            document.getSelection().removeAllRanges();\r\n            return textRange;\r\n        }\r\n        else {\r\n            console.warn(\"Failed to display suspicious fact text range from wording search :  \" + fact.wording);\r\n            return undefined;\r\n        }\r\n    }\r\n\r\n    function highlightTextRange(range) {\r\n        try {\r\n            var element = createHighlightElement();\r\n            var extract = range.extractContents();\r\n            element.appendChild(extract);\r\n            range.insertNode(element);\r\n        }\r\n        catch (error) {\r\n            console.error(error);\r\n        }\r\n    }\r\n\r\n    function createHighlightElement() {\r\n        var element = document.createElement('SPAN');\r\n        element.className = suspiciousFactClassNames;\r\n        element.onmouseenter = mouseEnterFact;\r\n        element.onmouseleave = mouseLeaveFact;\r\n        element.onmousemove = mouseMoveOnFact;\r\n        return element;\r\n\r\n        function mouseEnterFact(event) {\r\n            this.overlaying = true;\r\n            overlay.show(event.pageX, event.pageY);\r\n        }\r\n    \r\n        function mouseLeaveFact() {\r\n            this.overlaying = false;\r\n            overlay.hide();\r\n        }\r\n    \r\n        function mouseMoveOnFact(event) {\r\n            if (this.overlaying) {\r\n                overlay.show(event.pageX, event.pageY);\r\n            }\r\n        }\r\n    }\r\n\r\n    function Overlay() {\r\n        var self = this;\r\n        var domElement = null;\r\n    \r\n        self.show = function(x, y) {\r\n            if (!domElement) {\r\n                domElement = createDomElement();\r\n                document.body.append(domElement);\r\n            }\r\n            domElement.style.left = (x + 5) + \"px\";\r\n            domElement.style.top = (y - 35) + \"px\";\r\n        }\r\n\r\n        self.hide = function() {\r\n            if(domElement) {\r\n                document.body.removeChild(domElement);\r\n                domElement = null;\r\n            }\r\n        }\r\n\r\n        function createDomElement() {\r\n            var overlay = document.createElement('SPAN');\r\n            var imageUrl = chrome.runtime.getURL('extension/images/icon-detective16.png');\r\n            overlay.innerHTML = \"<img src=\\\"\" + imageUrl + \"\\\"> This fact has been reported as <strong>suspicious</strong> by a user.\";\r\n            overlay.className = suspiciousFactOverlayClassNames;\r\n            return overlay;        \r\n        }\r\n    }\r\n\r\n})();\n\n//# sourceURL=webpack:///./src/browser/js/init.js?");

/***/ })

/******/ });