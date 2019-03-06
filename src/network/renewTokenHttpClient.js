export default function RenewTokenHttpClient(httpClient, settings, authenticationService) {
    var self = this;

    self.GET = function(url) {
        return httpClient.GET(url).catch(function(error) {
            if (error.statusCode != 401) {
                throw error;
            }
            return reLogIn().then(function(){
                return httpClient.GET(url);
            });
        });
    };

    self.POST = function(url, body) {
        return httpClient.POST(url, body).catch(function(error) {
            if (error.statusCode != 401) {
                throw error;
            }
            return reLogIn().then(function() {
                return httpClient.POST(url, body);
            });
        });
    };

    function reLogIn() {
        return new Promise(function(resolve, reject) {
            settings.set({ token: null }, function() {
                settings.get(["userId"], function(result) {
                    return authenticationService.login({ userId: result.userId })
                        .then(resolve)
                        .catch(reject);
                });
            });
        });
    }
}