export default function AuthenticationService(httpClient, settings) {
    var self = this;

    self.register = function(credentials) {
        return httpClient.POST("/api/register", credentials)
            .then(function (data) {
                settings.set({
                    userId: credentials.userId,
                    token: {
                        value: data.token,
                        expire: data.expire
                    }
                });
            });
    }

    self.login = function(credentials) {
        return httpClient.POST("/api/login", credentials)
            .then(function(data) {
                settings.set({
                    token: {
                        value: data.token, 
                        expire: data.expire
                    }
                });
            });
    }
}