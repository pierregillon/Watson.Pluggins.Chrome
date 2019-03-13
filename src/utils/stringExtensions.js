Object.defineProperty(String.prototype, "toWording", {
    value: function () {
        return this
            .split(/\r\n|\r|\n|\ /g)
            .filter(str => { return str.length != 0; })
            .join(" ")
            .trim();
    },
    writable: true,
    configurable: true
});

Object.defineProperty(String.prototype, "middleTrim", {
    value: function (maxCharacterCount) {
        if (this.length > maxCharacterCount) {
            var half = maxCharacterCount / 2;
            var start = this.substr(0, half);
            var end = this.substr(this.length - half, half);;
            return start + " ... " + end
        }
        return value;
    },
    writable: true,
    configurable: true
});