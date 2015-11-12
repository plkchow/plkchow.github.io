var yappa;
(function (yappa) {
    var App = (function () {
        function App() {
            var _this = this;
            this.index = ko.observable(-1);
            this.keywords = ko.observable("");
            this.price = ko.observable("");
            this.searchResultList = ko.observableArray([]);
            this.lowestResult = ko.observable();
            this.alertsList = ko.observableArray([]);
            this.sideMenuActive = ko.observable();
            this.appStart = ko.observable(false);
            this.searching = ko.observable(false);
            this.creating = ko.observable(false);
            this.email = ko.observable("");
            this.sortedAlertsList = ko.computed(function () {
                if (!_this.alertsList())
                    return [];
                return _this.alertsList().sort(function (a, b) {
                    if (!a.keywords && !b.keywords)
                        return 0;
                    if (!a.keywords)
                        return -1;
                    if (!b.keywords)
                        return 1;
                    return a.keywords.localeCompare(b.keywords);
                });
            });
            this.displayResult = ko.computed(function () {
                return _this.lowestResult() && !_this.searching();
            });
        }
        App.prototype.init = function () {
            // test server availability
            $.get(yappa.appSettings.baseUrl + "/ping")
                .done(function (result) {
                console.log("Ping to api server: " + result);
            });
            // valid token
            $(document).ajaxSend(function (event, xhr, settings) {
                if (yappa.cache.getToken()) {
                    xhr.setRequestHeader("Authorization", "Bearer " + yappa.cache.getToken());
                }
            });
            $(document).ajaxError(function (event, xhr, settings) {
                if (xhr.status == 401) {
                    yappa.cache.removeToken();
                    yappa.cache.removeEmail();
                    yappa.app.email("");
                }
            });
            if (yappa.cache.getToken()) {
                // Restore previous session
                yappa.auth.verifyCacheToken();
            }
        };
        App.prototype.toggleSideMenu = function () {
            yappa.app.sideMenuActive(!yappa.app.sideMenuActive());
        };
        App.prototype.search = function (d, e) {
            if (!yappa.app.keywords()) {
                return;
            }
            yappa.app.appStart(true);
            yappa.app.searching(true);
            var data = { keywords: yappa.app.keywords() };
            $.get(yappa.appSettings.baseUrl + "/search", data)
                .done(function (result) {
                yappa.app.searchResultList(result.items);
                if (!yappa.app.searchResultList() || yappa.app.searchResultList().length === 0)
                    return null;
                var sortedList = yappa.app.searchResultList().sort(function (a, b) {
                    return a.price - b.price;
                });
                var lowest = sortedList[0];
                yappa.app.lowestResult(lowest);
            }).always(function () {
                yappa.app.searching(false);
            });
        };
        App.prototype.getAlerts = function () {
            $.ajax({
                url: yappa.appSettings.baseUrl + "/alerts",
                type: "GET",
                dataType: "json",
                headers: {
                    Authorization: "Bearer " + yappa.cache.getToken()
                },
                success: function (result) {
                    yappa.app.alertsList(result);
                }
            });
        };
        App.prototype.addAlert = function () {
            yappa.app.creating(true);
            var price = Number(yappa.app.price());
            var data = { index: -1, keywords: yappa.app.keywords(), price: price };
            $.ajax({
                url: yappa.appSettings.baseUrl + "/alerts",
                type: "POST",
                data: JSON.stringify(data),
                contentType: "application/json",
                success: function (success) {
                    yappa.app.price("");
                    yappa.app.alertsList.push(data);
                },
                complete: function () {
                    yappa.app.creating(false);
                }
            });
        };
        App.prototype.showAlert = function (d, e) {
            yappa.app.keywords(d.keywords);
            yappa.app.search();
        };
        App.prototype.deleteAlert = function (d, e) {
            $.ajax({
                url: yappa.appSettings.baseUrl + "/alerts/" + d.index,
                contentType: "application/json",
                type: "DELETE",
                success: function (success) {
                    if (success) {
                        yappa.app.alertsList.remove(function (item) {
                            return item.index === d.index;
                        });
                    }
                }
            });
        };
        App.prototype.getParam = function () {
            var vars = [];
            var hashes = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
            for (var i = 0; i < hashes.length; i++) {
                var hash = hashes[i].split("=");
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        };
        App.prototype.discount = function (discount) {
            if (!yappa.app.lowestResult())
                return "";
            var target = yappa.app.calcTarget(discount);
            return yappa.app.formatCurrency(target);
        };
        App.prototype.setDiscount = function (discount) {
            if (!yappa.app.lowestResult())
                return;
            var target = yappa.app.calcTarget(discount);
            yappa.app.price(target.toFixed(2));
        };
        App.prototype.calcTarget = function (discount) {
            var percentage = (100 - discount) * 0.01;
            return yappa.app.lowestResult().price * percentage;
        };
        App.prototype.formatCurrency = function (value) {
            return "$" + value.toFixed(2);
        };
        return App;
    })();
    yappa.App = App;
    yappa.app = new App();
    window.onload = function () {
        ko.applyBindings({ app: yappa.app, auth: yappa.auth });
        yappa.app.init();
    };
})(yappa || (yappa = {}));
//# sourceMappingURL=yappa.app.js.map