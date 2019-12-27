new function() {
    var App = angular.module('TollingApp');
    

    App.controller('TollingController', function ($scope, $http, $location, $q) {

        var params = { dbEnvironment: $scope.dbEnvironment, clientId: $scope.clientId }
        
        $scope.CurrentToll = {};
        $scope.ViewMode = true;
        $scope.EditMode = false;

        $http.get("/Tolling/GetInitialValues", { params: params })
        .success(function (response, status) {
            $scope.SubLitigations = response.tollingModel.SubLitigations;
            $scope.ClientInfo = response.clientInfo;
        });

        $scope.ShowClientToll = function () {
            $http.get("/Tolling/GetClientToll", { params: params })
                    .success(function (response, status) {
                        if (response.Message === "Success") {
                            $scope.TollEntries = response.TollEntries;
                            $scope.ViewMode = true;
                            $scope.EditMode = false;
                        }
                        else {
                            $scope.TollError = response.Message;
                        }
                    });
        };

        $scope.EditToll = function (index) {
            $scope.CurrentToll = angular.copy($scope.TollEntries[index]);
            $scope.ViewMode = false;
            $scope.EditMode = true;
            $scope.NewToll = false;
        };

        $scope.AddToll = function () {
            $scope.CurrentToll = {};
            $scope.ViewMode = false;
            $scope.EditMode = true;
            $scope.NewToll = true;
        };

        $scope.CancelSave = function (index) {
            $scope.ShowClientToll();
            $scope.ViewMode = true;
            $scope.EditMode = false;
            $scope.TollError = "";
        };

        $scope.SaveToll = function (index) {
            $scope.TollError = "";


            if (!$scope.CurrentToll.TollStartDate)
            {
                $scope.TollError = "Start Date is Required";
                return;
            }



            var tollJson = angular.toJson($scope.CurrentToll);

            $http.post("/Tolling/SaveClientToll", {
                dbEnvironment: $scope.dbEnvironment, clientId: $scope.clientId, tollJson: tollJson
            }).success(function (result) {
                if (result.Success === "Yes") {
                    $scope.ShowClientToll();
                    $scope.ViewMode = true;
                    $scope.EditMode = false;
                }
                else {
                    $scope.TollError = result.ReturnMessage;
                }
            })
            .error(function (status) {
                $scope.TollError = "error saving toll";
            });

        };

        $scope.DeleteToll = function (tollId) {

            if (confirm("YOU ARE ABOUT TO DELETE TOLL INFO. ARE YOU SURE YOU WANT TO PROCEED?")) {
                $http.post("/Tolling/DeleteClientToll", {
                    dbEnvironment: $scope.dbEnvironment, tollId: tollId
                }).success(function (result) {
                    if (result.Success === "Yes") {
                        $scope.ShowClientToll();
                        $scope.ViewMode = true;
                        $scope.EditMode = false;
                    }
                    else {
                        $scope.TollError = result.ReturnMessage;
                    }
                })
                .error(function (status) {
                    alert(status)
                    $scope.TollError = "error deleting toll";
                });
            }
        };

        angular.isUndefinedOrNull = function (val) {
            return angular.isUndefined(val) || val === null;
        }

        $scope.ShowClientToll();


    });

};

