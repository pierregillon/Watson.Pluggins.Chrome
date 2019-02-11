function HttpClient(server, storage) {
    var self = this;

    self.GET = function (url) {
        return new Promise(function (resolve, reject) {
            storage.get("token", function (result) {
                try {
                    checkTokenStillValid(result.token);
                    var client = new XMLHttpRequest();
                    client.open("GET", server + url);
                    client.setRequestHeader("Content-Type", "text/json");
                    configureClient(client, result.token, resolve, reject);
                    client.send();
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    self.POST = function (url, body) {
        return new Promise(function (resolve, reject) {
            storage.get("token", function (result) {
                try {
                    checkTokenStillValid(result.token);
                    var client = new XMLHttpRequest();
                    client.open("POST", server + url);
                    configureClient(client, result.token, resolve, reject);
                    client.send(buildFormData(body));
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    function checkTokenStillValid(token) {
        if(token && token.expire) {
            if (new Date(token.expire) < new Date()) {
                throw {statusCode: 401};
            }
        }
    }

    function buildFormData(body) {
        var data = new FormData();
        for (var key in body) {
            data.append(key, body[key]);
        }
        return data;
    }

    function configureClient(client, token, resolve, reject) {
        if (token) {
            client.setRequestHeader("Authorization", token.value);
        }
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
            reject({
                statusCode: -1,
                message: "The Watson server is unreachable. Please retry in a few moment."
            });
        };
        client.onabort = function(error) {
            reject({
                statusCode: -2,
                message: "The operation has been cancelled."
            });
        };
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
            storage.set({ token: null }, function() {
                storage.get(["userId"], function(result) {
                    return client.POST("/api/login", { userId: result.userId }).then(function(data) {
                        storage.set({
                            token: {
                                value: data.token, 
                                expire: data.expire
                            }
                        }, function() {
                            resolve();
                        });
                    });
                });
            });
        });
    }
}