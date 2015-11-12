var yappa;
(function (yappa) {
    var AppSettings = (function () {
        function AppSettings() {
            this.baseUrl = "http://pricealert.azurewebsites.net/api";
        }
        return AppSettings;
    })();
    yappa.AppSettings = AppSettings;
    yappa.appSettings = new AppSettings();
})(yappa || (yappa = {}));
//# sourceMappingURL=yappa.appSettings.js.map