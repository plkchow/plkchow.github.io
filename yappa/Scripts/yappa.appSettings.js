var yappa;
(function (yappa) {
    var AppSettings = (function () {
        function AppSettings() {
            this.baseUrl = "https://microsoft-apiappbafd7abfae1e4958a624350cc194ab2d.azurewebsites.net/api";
        }
        return AppSettings;
    })();
    yappa.AppSettings = AppSettings;
    yappa.appSettings = new AppSettings();
})(yappa || (yappa = {}));
//# sourceMappingURL=yappa.appSettings.js.map