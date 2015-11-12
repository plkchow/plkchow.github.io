var yappa;
(function (yappa) {
    var AppSettings = (function () {
        function AppSettings() {
            //baseUrl = "https://microsoft-apiappbafd7abfae1e4958a624350cc194ab2d.azurewebsites.net/api";
            //baseUrl = "http://localhost:19662/api";
            this.baseUrl = "http://vchehealthws07.vch.ca/yappa.api/api";
        }
        return AppSettings;
    })();
    yappa.AppSettings = AppSettings;
    yappa.appSettings = new AppSettings();
})(yappa || (yappa = {}));
//# sourceMappingURL=yappa.appSettings.js.map