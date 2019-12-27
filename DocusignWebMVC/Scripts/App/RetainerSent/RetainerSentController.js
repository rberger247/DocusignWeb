new function () {
    var App = angular.module('MassEntryApp');

    App.controller('RetainerSentController', function ($scope, $http, $location, $filter, ngDialog) {

        $scope.EditMode = true;
        $scope.ViewMode = false;

        var dbEnvironment = $scope.dbEnvironment;

        //Get Initial Settings
        var initParams = { dbEnvironment: dbEnvironment }
        //Upload Entries
        $scope.UploadEntries = function () {

            var uploadData = {};
            uploadData.dbEnvironment = dbEnvironment;
            uploadData.UploadDate = $scope.RetainerSentDate;
            uploadData.WLNumbers = $scope.WLNumbers;

            var errors = false;
            $scope.WLNumbersError = false;
            $scope.RetainerSentDateError = false;
            $scope.UploadMessage = "";
            $scope.UploadError = "";

            if ($.trim($scope.RetainerSentDate) === "") {
                $scope.RetainerSentDateError = true;
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
            

            if (!confirm("YOU ARE ABOUT TO UPLOAD " + noOfWLNumbers + " RETAINER SENT ENTRIES. ARE YOU SURE YOU WANT TO PROCEED?")) {
                return false;
            }

            $scope.UploadEntriesDisabled = true;
            var jsonData = angular.toJson(uploadData);

            $http.post("/MassEntry/UpdateRetainerSent", {
                jsonData: jsonData
            }).success(function (result) {
                $scope.UploadEntriesDisabled = false;
                if (result.Success === "Yes") {
                    $scope.EditMode = false;
                    $scope.ViewMode = true;
                    $scope.UploadMessage = result.ReturnMessage;
                } else {
                    $scope.UploadError = result.ReturnMessage;
                }
            })
            .error(function (status) {
                alert('error uploading entries');
            });
            
        };

    });

};


