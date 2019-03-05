import { expect } from "chai"
import RenewTokenHttpClient from "./renewTokenHttpClient"

describe("RenewTokenHttpClient", () => {
    it('returns directly data when no errors', done => {
        var internal = {
            GET: function(url) {
                return Promise.resolve("ok");
            }
        }

        var client = new RenewTokenHttpClient(internal, null, null);

        client.GET("api/ping").then(function(result) {
            expect(result).to.equal("ok");
            done();
        });
    });
}); 