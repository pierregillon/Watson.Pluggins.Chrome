import { expect } from "chai"
import "./stringExtensions"

describe("StringExtension import", () => {
    it("add toWording() method to String class", () => {
        expect(String.prototype.toWording).to.exist;
    });

    it("add middleTrim() method to String class", () => {
        expect(String.prototype.middleTrim).to.exist;
    });
});

describe("string.toWording()", () => {
    it("remove duplicated spaces", () => {
        const value = "hello    world";
        const result = value.toWording();
        expect(result).to.equal("hello world");
    });

    it("remove line break", () => {
        const value = "hello \r\n world";
        const result = value.toWording();
        expect(result).to.equal("hello world");
    });
});

describe("string.middleTrim()", () => {
    it("shorts string with dots", () => {
        const value = "hello world this is a very long sentence";
        const result = value.middleTrim(10);
        expect(result).to.equal("hello ... tence");
    });
});