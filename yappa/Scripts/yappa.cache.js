var yappa;
(function (yappa) {
    var Cache = (function () {
        function Cache() {
        }
        Cache.prototype.getEmail = function () {
            return localStorage.getItem("email");
        };
        Cache.prototype.setEmail = function (value) {
            localStorage.setItem("email", value);
        };
        Cache.prototype.removeEmail = function () {
            localStorage.removeItem("email");
        };
        Cache.prototype.getToken = function () {
            return localStorage.getItem("token");
        };
        Cache.prototype.setToken = function (value) {
            localStorage.setItem("token", value);
        };
        Cache.prototype.removeToken = function () {
            localStorage.removeItem("token");
        };
        return Cache;
    })();
    yappa.Cache = Cache;
    yappa.cache = new Cache();
})(yappa || (yappa = {}));
//# sourceMappingURL=yappa.cache.js.map