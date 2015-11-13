var yappa;
(function (yappa) {
    var App = (function () {
        function App() {
            var _this = this;
            this.keywords = ko.observable("");
            this.price = ko.observable("");
            this.searchResultList = ko.observableArray([]);
            this.alertsList = ko.observableArray([]);
            this.searching = ko.observable(false);
            this.adding = ko.observable(false);
            this.searchItem = ko.computed(function () {
                if (!_this.searchResultList() || _this.searchResultList().length <= 0)
                    return null;
                var sortedList = _this.searchResultList().sort(function (a, b) {
                    return a.price - b.price;
                });
                return sortedList[0];
            });
            this.discounts = ko.computed(function () {
                if (!_this.searchItem())
                    return [];
                var result = [];
                for (var i = 1; i < 10; i++) {
                    var discount = i * 10;
                    var percentage = (100 - discount) * 0.01;
                    var target = _this.searchItem().price * percentage;
                    result.push(target);
                }
                return result;
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
                    yappa.auth.email("");
                }
            });
            if (yappa.cache.getToken()) {
                // Restore previous session
                yappa.app.getAlerts();
            }
        };
        App.prototype.search = function (d, e) {
            if (!yappa.app.keywords()) {
                return;
            }
            yappa.app.searching(true);
            var data = { keywords: yappa.app.keywords() };
            $.get(yappa.appSettings.baseUrl + "/search", data)
                .done(function (result) {
                yappa.app.searchResultList(result.items);
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
                success: function (vm) {
                    yappa.auth.email(vm.email);
                    yappa.app.alertsList(vm.alerts);
                }
            });
        };
        App.prototype.addAlert = function () {
            var price = Number(yappa.app.price());
            if (price) {
                yappa.app.adding(true);
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
                        yappa.app.adding(false);
                    }
                });
            }
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
        App.prototype.setDiscount = function (d) {
            yappa.app.price(d.toFixed(2));
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