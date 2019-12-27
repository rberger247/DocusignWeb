new function() {
    var App = angular.module('SOLApp');
    

    App.controller('SOLController', function ($scope, $http, $location, $q) {

        $scope.CurrentSOL = {};
        $scope.ViewMode = true;
        $scope.EditMode = false;

        var params = { dbEnvironment: $scope.dbEnvironment, clientId: $scope.clientId, litAbbr: $scope.LitAbbr }
        
        $http.get("/SOLManagement/GetInitialValues", { params: params })
        .success(function (response, status) {
            $scope.SOLStates = response.SOLStates;
            $scope.SubLitigations = response.SubLitigations;
            $scope.Devices = response.Devices;
            $scope.ImplantNos = response.ImplantNos;
        });


        $scope.ShowClientSOL = function () {
            $http.get("/SOLManagement/GetClientSOL", { params: params })
                    .success(function (response, status) {
                        //alert(response.Message);
                        if (response.Message === "Success") {
                            $scope.SOLEntries = response.SOLEntries;
                            $scope.ClientInfo = response.ClientInfo;
                            $scope.ViewMode = true;
                            $scope.EditMode = false;
                            console.log($scope.SOLEntries);
                        }
                        else {
                            $scope.SOLError = response.Message;
                        }
                    });
        };

        $scope.DeleteSOL = function (stateNo, sublitigationId, deviceId, currentResidencyStateNo, residencyStateNo, implantNo) {

            if (confirm("YOU ARE ABOUT TO DELETE SOL INFO. ARE YOU SURE YOU WANT TO PROCEED?")) {
                $http.post("/SOLManagement/DeleteClientSOL", {
                    dbEnvironment: $scope.dbEnvironment, clientId: $scope.clientId, stateNo: stateNo, sublitigationId: sublitigationId, deviceId: deviceId, currentResidencyStateNo: currentResidencyStateNo, residencyStateNo: residencyStateNo, implantNo: implantNo
                }).success(function (result) {
                    if (result.Success === "Yes") {
                        $scope.ShowClientSOL();
                        $scope.ViewMode = true;
                        $scope.EditMode = false;
                    }
                    else {
                        $scope.SOLError = result.ReturnMessage;
                    }
                })
                .error(function (status) {
                    alert(status)
                    $scope.SOLError = "error deleting sol";
                });
            }
        };

        $scope.EditSOL = function (index) {
            $scope.CurrentSOL = angular.copy($scope.SOLEntries[index]);
            

            $scope.ViewMode = false;
            $scope.EditMode = true;

            if ($scope.LitAbbr === "HEM") {
                $scope.EditKeyInfo = true;
                $scope.OldSOL = angular.copy($scope.SOLEntries[index]);
            }
            else {
                $scope.EditKeyInfo = false;
                $scope.OldSOL = null;
            }
            
            //console.log($scope.CurrentSOL);
        };

        $scope.AddSOL = function () {
            $scope.CurrentSOL = {};
            $scope.ViewMode = false;
            $scope.EditMode = true;
            $scope.EditKeyInfo = true;

            if ($scope.LitAbbr == "SAB") {
                $scope.CurrentSOL.StateNo = "44"; //NY
                $scope.CurrentSOL.InjuryDate1 = $scope.ClientInfo.DOB;
            }

        };
        
        angular.isUndefinedOrNull = function (val) {
            return angular.isUndefined(val) || val === null;
        }


        $scope.SaveSOL = function (index) {
            //console.log($scope.CurrentSOL);
            $scope.SOLError = "";


            if ($scope.ShowResidencyState == true)
            {
                if (
                    angular.isUndefinedOrNull($scope.CurrentSOL.StateNo)
                    || angular.isUndefinedOrNull($scope.CurrentSOL.ResidencyStateNo)
                    || angular.isUndefinedOrNull($scope.CurrentSOL.CurrentResidencyStateNo)
                    || $scope.CurrentSOL.StateNo === "0"
                    || $scope.CurrentSOL.ResidencyStateNo === "0"
                    || $scope.CurrentSOL.CurrentResidencyStateNo === "0"
                   )
                {
                    $scope.SOLError = "Please select all states";
                    return;
                }
            }

            if ($scope.ShowImplantNo == true) {
                if (angular.isUndefinedOrNull($scope.CurrentSOL.ImplantNo) || $scope.CurrentSOL.ImplantNo === "0")
                {
                    $scope.SOLError = "Please Select Implant No";
                    return;
                }
            }

            if (angular.isUndefinedOrNull($scope.CurrentSOL.StateNo) || $scope.CurrentSOL.StateNo === "0")
            {
                $scope.SOLError = "Please select a state";
                return;
            }


            if (
                angular.isUndefinedOrNull($scope.CurrentSOL.InjuryDate1) &&
                angular.isUndefinedOrNull($scope.CurrentSOL.InjuryDate2) &&
                angular.isUndefinedOrNull($scope.CurrentSOL.InjuryDate3) &&
                angular.isUndefinedOrNull($scope.CurrentSOL.InjuryDate4) &&
                angular.isUndefinedOrNull($scope.CurrentSOL.InjuryDate5) &&
                angular.isUndefinedOrNull($scope.CurrentSOL.KnowledgeDate)
               ) {
                $scope.SOLError = "No dates entered";
                return;
            }


            var solJson = angular.toJson($scope.CurrentSOL);

            var oldSolJson = angular.toJson($scope.OldSOL);

            $http.post("/SOLManagement/SaveClientSOL", {
                dbEnvironment: $scope.dbEnvironment, clientId: $scope.clientId, solJson: solJson, oldSolJson: oldSolJson
            }).success(function (result) {
                if (result.Success === "Yes") {
                    if (result.AdditionalMessage !== "") {
                        alert(result.AdditionalMessage);
                    }
                    $scope.ShowClientSOL();
                    $scope.ViewMode = true;
                    $scope.EditMode = false;
                }
                else {
                    $scope.SOLError = result.ReturnMessage;
                }
            })
            .error(function (status) {
                $scope.SOLError = "error saving sol";
            });

        };

        $scope.CancelSave = function (index) {
            $scope.ShowClientSOL();
            $scope.ViewMode = true;
            $scope.EditMode = false;
            $scope.SOLError = "";
        };

        $scope.ShowClientSOL();


    });

};

