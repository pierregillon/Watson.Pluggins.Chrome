function HttpClient(server) {
    var self = this;

    self.GET = function (url) {
        return new Promise(function(resolve, reject) {
            var client = new XMLHttpRequest();
            client.open("GET", server + url);
            client.setRequestHeader("Content-Type", "text/json");
            client.onload = function () {
                if (client.status == 200) {
                    resolve(JSON.parse(client.responseText));
                }
                else {
                    reject(client.status + " : " + client.responseText);
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
    }

    self.POST = function (url, body) {
        return new Promise(function(resolve, reject) {
            var data = new FormData();
            for (var key in body) {
                data.append(key, body[key]);
            }

            var client = new XMLHttpRequest();
            client.open("POST", server + url);
            client.onload = function () {
                if (client.status == 200) {
                    resolve();
                }
                else {
                    reject(client.status + " : " + client.responseText);
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
    }
}