var yappa;
(function (yappa) {
    var Authentication = (function () {
        function Authentication() {
            this.email = ko.observable("");
        }
        Authentication.prototype.signout = function () {
            yappa.auth.email("");
            yappa.app.alertsList.removeAll();
            yappa.cache.removeEmail();
            yappa.cache.removeToken();
        };
        Authentication.prototype.onGoogleLoad = function () {
            var gapi = window.gapi;
            gapi.load("auth2", function () {
                gapi.auth2.init({
                    client_id: "226140050721-rpr9pka0notlvbqfv3l7tp3iigadcotl.apps.googleusercontent.com"
                });
            });
        };
        Authentication.prototype.googleSignIn = function () {
            var gapi = window.gapi;
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signIn().then(function () {
                var user = auth2.currentUser.get();
                var response = user.getAuthResponse();
                var idToken = response.id_token;
                yappa.auth.getBearerToken("google", idToken);
            });
        };
        Authentication.prototype.getBearerToken = function (provider, token) {
            var data = { provider: provider, token: token };
            $.get(yappa.appSettings.baseUrl + "/accounts/token", data)
                .done(function (result) {
                yappa.auth.email(result.userName);
                yappa.cache.setEmail(result.userName);
                yappa.cache.setToken(result.access_token);
                yappa.app.getAlerts();
            });
        };
        Authentication.prototype.verifyCacheToken = function () {
            $.ajax({
                url: yappa.appSettings.baseUrl + "/accounts/verify",
                type: "GET",
                success: function (email) {
                    yappa.auth.email(email);
                    yappa.app.getAlerts();
                }
            });
        };
        return Authentication;
    })();
    yappa.Authentication = Authentication;
    yappa.auth = new Authentication();
})(yappa || (yappa = {}));
//# sourceMappingURL=yappa.authentication.js.map