new function() {
    var App = angular.module('TollingApp');

    App.controller('TollingHomeController', function ($scope, $http, $location) {

        $scope.dbEnvironment = $location.search().db;
        $scope.clientId = $location.search().clientId;
        
        $scope.TollingAccess = false;

        var params = { dbEnvironment: $scope.dbEnvironment}

        $http.get("/Tolling/HasAccess", { params: params })
        .success(function (response, status) {
            $scope.TollingAccess = response.Access;
            if ($scope.TollingAccess)
            {
                $scope.include = "Scripts/App/Tolling/ClientTolling.html";
            }
            else
            {
                $scope.include = "Scripts/App/Tolling/ClientTollingNoAccess.html";
            }
        });
          
        

    });

};

