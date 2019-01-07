function FactRepository(httpClient) {
    var self = this;
    var apiRoute = "/api/fact";

    self.getSuspiciousFacts = function (pageUrl) {
        return httpClient.GET(apiRoute + "?url=" + btoa(pageUrl));
    }

    self.report = function (pageUrl, suspiciousFact) {
        return httpClient.POST(apiRoute + "?url=" + btoa(pageUrl), suspiciousFact);
    }
}