new function() {
    var App = angular.module('SOLApp');

    App.controller('SOLHomeController', function ($scope, $http, $location) {

        $scope.dbEnvironment = $location.search().db;
        $scope.clientId = $location.search().clientId;
        
        $scope.LitAbbr = $location.search().lit;

        

        var params = { dbEnvironment: $scope.dbEnvironment}

        $http.get("/SOLManagement/HasAccess", { params: params })
        .success(function (response, status) {
                $scope.SOLAccess = response.Access;
                if ($scope.SOLAccess) {
                    $scope.include = "Scripts/App/SOLManagement/ClientSOL.html";
                }
                else {
                    $scope.include = "Scripts/App/SOLManagement/NoAccess.html";
                }
            });


        $scope.ShowDevice = false;
        $scope.ShowImplantNo = false;

        if ($scope.LitAbbr === "HRP")
        {
            $scope.ShowDevice = true;
        }

        if ($scope.LitAbbr === "HEM") {
            $scope.SOLStateCaption = "State of Implantation";
            $scope.ShowResidencyState = true;
            $scope.ShowSubLitigation = false;
            $scope.ShowImplantNo = true;
        }
        else
        {
            $scope.SOLStateCaption = "SOL State";
            $scope.ShowResidencyState = false;
            $scope.ShowSubLitigation = true;
        }

        $scope.ShowInjury5 = false;
        
            switch ($scope.LitAbbr)
            {
                case 'HRP':
                case 'ZIK':
                    $scope.Injury1Caption = "Initial Implant";
                    $scope.Injury2Caption = "Symptoms Onset";
                    $scope.Injury3Caption = "Symptoms Diagnosed";
                    $scope.Injury4Caption = "Revision";
                    break;
                case 'HEM':
                    $scope.Injury1Caption = "Implant Date";
                    $scope.Injury2Caption = "Symptoms Onset";
                    $scope.Injury3Caption = "Repair Date";
                    $scope.Injury4Caption = "Revision Date";
                    $scope.Injury5Caption = "Other Injury";

                    $scope.ShowInjury5 = true;
                    break;
                case 'PMO':
                    $scope.Injury1Caption = "Initial Surgery";
                    $scope.Injury2Caption = "Symptoms Onset";
                    $scope.Injury3Caption = "Symptoms Diagnosed";
                    $scope.Injury4Caption = "Corrective Surgery";
                    break;
                case 'IVC':
                    $scope.Injury1Caption = "Filter Implanted";
                    $scope.Injury2Caption = "Injury 1";
                    $scope.Injury3Caption = "Injury 2";
                    $scope.Injury4Caption = "Injury 3";
                    break;
                case 'SAB':
                    $scope.Injury1Caption = "Date Of Birth";
                    $scope.Injury2Caption = "Injury 2";
                    $scope.Injury3Caption = "Injury 3";
                    $scope.Injury4Caption = "Injury 4";
                    break;
                default:
                    $scope.Injury1Caption = "Injury Date 1";
                    $scope.Injury2Caption = "Injury Date 2";
                    $scope.Injury3Caption = "Injury Date 3";
                    $scope.Injury4Caption = "Injury Date 4";
            }
            
    });

};

