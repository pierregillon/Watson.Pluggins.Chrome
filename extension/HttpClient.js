function HttpClient(server, storage) {
    var self = this;

    self.GET = function (url) {
        return new Promise(function(resolve, reject) {
            storage.get("token", function(result) {
                var client = new XMLHttpRequest();
                client.open("GET", server + url);
                client.setRequestHeader("Content-Type", "text/json");
                client.setRequestHeader("Authorization", result.token);
                client.onload = function () {
                    var result = {
                        statusCode: client.status
                    };
                    if (client.responseText) {
                        result = JSON.parse(client.responseText);
                    }
                    if (client.status == 200) {
                        resolve(result);
                    }
                    else {
                        reject(result);
                    }
                }
                client.onerror = function(error) {
                    reject(error);
                };
                client.onabort = function(error) {
                    reject(error);
                };
                client.send();
            });
        });
    }

    self.POST = function (url, body) {
        return new Promise(function(resolve, reject) {
            storage.get("token", function(result) {
                var data = new FormData();
                for (var key in body) {
                    data.append(key, body[key]);
                }

                var client = new XMLHttpRequest();
                client.open("POST", server + url);
                client.setRequestHeader("Authorization", result.token);
                client.onload = function () {
                    var result = {
                        statusCode: client.status
                    };
                    if (client.responseText) {
                        result = JSON.parse(client.responseText);
                    }
                    if (client.status == 200) {
                        resolve(result);
                    }
                    else {
                        reject(result);
                    }
                }
                client.onerror = function(error) {
                    reject(error);
                };
                client.onabort = function(error) {
                    reject(error);
                };
                client.send(data);
            });
        });
    }
}

function RenewTokenHttpClient(client, storage) {
    var self = this;

    self.GET = function(url) {
        return client.GET(url).catch(function(error) {
            if (error.statusCode != 401) {
                throw error;
            }
            return renewToken().then(function(){
                return client.GET(url);
            });
        });
    };

    self.POST = function(url, body) {
        return client.POST(url, body).catch(function(error) {
            if (error.statusCode != 401) {
                throw error;
            }
            return renewToken().then(function() {
                return client.POST(url, body);
            });
        });
    };

    function renewToken() {
        return new Promise(function(resolve, reject) {
            storage.get(["userId"], function(result) {
                return client.POST("/api/login", { userId: result.userId }).then(function(data) {
                    storage.set({token: data.token}, function() {
                        resolve();
                    });
                });
            });
        });
    }
}