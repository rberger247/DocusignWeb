new function () {
    var App = angular.module('MassEntryApp');

    App.controller('ActivityEntryController', function ($scope, $http, $location, $filter, ngDialog) {

        $scope.EditMode = true;
        $scope.ViewMode = false;

        var dbEnvironment = $scope.dbEnvironment;

        //Get Initial Settings
        var initParams = { dbEnvironment: dbEnvironment }
        $http.get("/MassEntry/GetActivityEntryInitialValues", { params: initParams })
        .success(function (response, status) {
            $scope.ActivityTypes = response.ActivityTypes;
            $scope.ActivityDate = response.ActivityDate;
        });

        //Upload Activity Entries
        $scope.UploadActivityEntries = function () {
            
            var uploadData = {};
            uploadData.dbEnvironment = dbEnvironment;
            uploadData.ActivityDate = $scope.ActivityDate;
            uploadData.ActivityType = $scope.ActivityType;
            uploadData.ActivityDescription = $scope.ActivityDescription;
            uploadData.WLNumbers = $scope.WLNumbers;

            var errors = false;
            $scope.ActivityTypeError = false;
            $scope.ActivityDescriptionError = false;
            $scope.WLNumbersError = false;
            $scope.ActivityUploadMessage = "";
            $scope.ActivityUploadError = "";

            if (angular.isUndefined($scope.ActivityType)) {
                $scope.ActivityTypeError = true;
                errors = true;
            }


            
            if ($.trim($scope.ActivityDescription) === "" || angular.isUndefined($scope.ActivityDescription)) {
                $scope.ActivityDescriptionError = true;
                errors = true;
            }

            if ($.trim($scope.WLNumbers) === "") {
                $scope.WLNumbersError = true;
                errors = true;
            }

            if (errors === true) {
                return false;
            }

            var lines = $scope.WLNumbers.split("\n");
            var noOfWLNumbers = lines.length;
            

            if (!confirm("YOU ARE ABOUT TO UPLOAD " + noOfWLNumbers + " ACTIVITY ENTRIES. ARE YOU SURE YOU WANT TO PROCEED?")) {
                return false;
            }

            $scope.LinkDocumentsDisabled = true;
            var jsonData = angular.toJson(uploadData);

            $http.post("/MassEntry/UploadActivityEntries", {
                jsonData: jsonData
            }).success(function (result) {
                $scope.LinkDocumentsDisabled = false;
                if (result.Success === "Yes") {
                    $scope.EditMode = false;
                    $scope.ViewMode = true;
                    $scope.ActivityUploadMessage = result.ReturnMessage;
                } else {
                    $scope.ActivityUploadError = result.ReturnMessage;
                }
            })
            .error(function (status) {
                alert('error uploading entries');
            });
            
        };

    });

};


