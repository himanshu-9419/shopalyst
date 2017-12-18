(function () {
    var app = angular.module("myApp");
    app.service("DataSvc", function ($http) {
        var self = this;
        self.getData = function (index,limit,query,other) {
            return $http.get('http://api.shortlyst.com/v1/products?index='+index+'&limit='+limit+'&q='+query+'&mode=full&apikey=e3ebd9fdf9704775c7fd6bb4f20e1798&'+other).then(data => data.data);
        }
    });
})();