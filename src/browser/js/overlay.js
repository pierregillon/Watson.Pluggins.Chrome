const suspiciousFactOverlayClassNames = "watson_fact_overlay";

export default class Overlay {
    constructor(root) {
        this.domElement = null;
        this.root = root;
    }
    
    show(x, y) {
        if (!this.domElement) {
            this.domElement = this._createDomElement();
            document.body.append(this.domElement);
        }
        this.domElement.style.left = (x + 5) + "px";
        this.domElement.style.top = (y - 35) + "px";
    }

    hide() {
        if (this.domElement) {
            document.body.removeChild(this.domElement);
            this.domElement = null;
        }
    }

    _createDomElement() {
        var overlay = document.createElement('SPAN');
        var imageUrl = chrome.runtime.getURL('images/icon-detective16.png');
        overlay.innerHTML = "<img src=\"" + imageUrl + "\"> This fact has been reported as <strong>suspicious</strong> by a user.";
        overlay.className = suspiciousFactOverlayClassNames;
        overlay.style.height = "auto";
        return overlay;        
    }
}