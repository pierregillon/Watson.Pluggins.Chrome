Object.defineProperty(String.prototype, "toWording", {
	value: function () {
        return this
            .split(/\r\n|\r|\n|\ /g)
            .filter(function (str) { return str.length != 0; })
            .join(" ")
            .trim();
    },
	writable: true,
	configurable: true
});