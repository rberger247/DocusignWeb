new function () {
    var App = angular.module('MassEntryApp');

    App.controller('SCLetterController', function ($scope, $http, $location, $filter, ngDialog) {

        $scope.EditMode = true;
        $scope.ViewMode = false;

        var dbEnvironment = $scope.dbEnvironment;

        //Get Initial Settings
        var initParams = { dbEnvironment: dbEnvironment }


        switch ($scope.userSelectedOption) {
            case "11": //Complaints
                $scope.UploadButtonCaption = "Generate Complaint";
                break;
            case "16": //Complaints
                $scope.UploadButtonCaption = "Generate Complaint";
                break;
            case "12": //Affidavit
                $scope.UploadButtonCaption = "Generate Client Affidavit";
                break;
            case "13": //Affidavit
                $scope.UploadButtonCaption = "Generate Sedgh Affidavit";
                break;
            case "14": //PFS
                $scope.UploadButtonCaption = "Generate Plaintiff Fact Sheet";
                break;
            case "15": //Subpoena
                //$scope.WLNumbers = "All";
                $scope.UploadButtonCaption = "Generate Subpoena";
                break;
            case "23": //Subpoena 2nd Attempt
                //$scope.WLNumbers = "All";
                $scope.UploadButtonCaption = "Generate Subpoena 2nd Attempt";
                break;
            case "18": //Affidavit Dismissal
                $scope.UploadButtonCaption = "Generate Client Affidavit Dismissal";
                break;
            case "20": //PPITemplateMIA
                $scope.UploadButtonCaption = "Generate MIA Letter";
                break;
            case "21": //PPITemplateHIPAA
                $scope.UploadButtonCaption = "Generate HIPAA Cover Letter";
                break;
            case "22": //PPITemplateNOK
                $scope.UploadButtonCaption = "Generate NOK Cover Letter";
                break;
        }

        
        //Upload Entries
        $scope.UploadEntries = function () {

            var uploadData = {};
            uploadData.dbEnvironment = dbEnvironment;
            uploadData.WLNumbers = $scope.WLNumbers;
            uploadData.DocType = $scope.userSelectedOption;

            var errors = false;
            $scope.WLNumbersError = false;
            $scope.UploadMessage = "";
            $scope.UploadError = "";

            if ($.trim($scope.WLNumbers) === "") {
                $scope.WLNumbersError = true;
                errors = true;
            }

            if (errors === true) {
                return false;
            }

            var lines = $scope.WLNumbers.split("\n");
            var noOfWLNumbers = lines.length;
            

            if (!confirm("You are about to generate " + noOfWLNumbers + " Letters. Are You Sure?")) {
                return false;
            }

            $scope.UploadEntriesDisabled = true;
            var jsonData = angular.toJson(uploadData);

            $http.post("/MassEntry/GenerateLetter", {
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


