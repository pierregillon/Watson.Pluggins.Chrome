import { expect } from "chai"
import RenewTokenHttpClient from "./renewTokenHttpClient"

describe("RenewTokenHttpClient", () => {
    let client = null;
    let httpClientMock = null;
    let settings = null;
    let authenticationService = null;

    before(() => {
        httpClientMock = { count: 0 };
        authenticationService = {};
        settings = {};
        client = new RenewTokenHttpClient(httpClientMock, settings, authenticationService);
    });

    it('returns directly GET result when no error', done => {
        // Arrange
        httpClientMock.GET = url => {
            return Promise.resolve("ok GET");
        };

        // Act
        client.GET("api/ping").then(result => {
            // Assert
            expect(result).to.equal("ok GET");
        }).then(done);
    });

    it('returns directly POST result when no error', done => {
        // Arrange
        httpClientMock.POST = (url, body) => {
            return Promise.resolve("ok POST");
        };

        // Act
        client.POST("api/ping", { data: "somedata" }).then(result => {
            // Assert
            expect(result).to.equal("ok POST");
        }).then(done);
    });

    it('re-logs current user when 401 error from GET', done => {
        // Arrange
        httpClientMock.GET = url => {
            httpClientMock.count++;
            if (httpClientMock.count < 2) {
                return Promise.reject({ statusCode: 401 });
            }
            else {
                return Promise.resolve("ok GET");
            }
        };
        settings.get = (propertyNames, callback) => {
            callback({ userId: "my-user-id" });
        };
        settings.set = (obj, callback) => {
            callback();
        };
        authenticationService.login = id => {
            return Promise.resolve();
        };

        // Act
        client.GET("api/ping").then(result => {
            // Assert
            expect(result).to.equal("ok GET");
        }).then(done);
    });

    it('throws error if re-log fail', done => {
        // Arrange
        httpClientMock.GET = url => {
            return Promise.reject({ statusCode: 401 });
        };
        settings.get = (propertyNames, callback) => {
            callback({ userId: "my-user-id" });
        };
        settings.set = (obj, callback) => {
            callback();
        };
        authenticationService.login = id => {
            return Promise.reject({ statusCode: 500 });
        };

        // Act
        client.GET("api/ping").catch(error => {
            // Assert
            expect(error.statusCode).to.equal(500);
            done();
        });
    });
}); 