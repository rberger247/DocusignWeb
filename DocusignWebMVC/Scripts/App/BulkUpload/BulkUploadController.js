new function () {
    var App = angular.module('MassEntryApp');

    App.controller('BulkUploadController', function ($scope, $http, $location, $filter, $upload, $sce) {

        $scope.to_trusted = function(html_code) {
            return $sce.trustAsHtml(html_code);
        }

        var dbEnvironment = $scope.dbEnvironment;
        $scope.EditMode = true;
        $scope.ViewMode = false;
        $scope.TemplateFile = "/MassEntry/DownloadTemplate?uploadOption=" + $scope.userSelectedOption;
        $scope.ShowTemplateMessage = true;

        switch ($scope.userSelectedOption) {
            case "3": //Upload Excel Activities
                $scope.UploadButtonCaption = "Load Activity File";
                $scope.ConfirmMessage = "YOU ARE ABOUT TO UPLOAD ACTIVITY ENTRIES. ARE YOU SURE YOU WANT TO PROCEED?";
                break; 
            case "6": //Upload Excel Questions
                $scope.UploadButtonCaption = "Load Questions File";
                $scope.ConfirmMessage = "ARE YOU SURE YOU WANT TO PROCEED?";
                break;
            case "7": //Upload Paralegal Assignments
                $scope.UploadButtonCaption = "Load Paralegal Assignments File";
                $scope.ConfirmMessage = "YOU ARE ABOUT TO UPLOAD PARALEGAL ASSIGNMENTS. ARE YOU SURE YOU WANT TO PROCEED?";
                break;
            case "8": //Bulk SubLit Change
                $scope.UploadButtonCaption = "Load Bulk SubLit Change File";
                $scope.ConfirmMessage = "YOU ARE ABOUT TO UPLOAD BULK SUBLIT CHANGES. ARE YOU SURE YOU WANT TO PROCEED?";
                break;
            case "9": //Case Category Upload
                $scope.UploadButtonCaption = "Load Case Category Upload File";
                $scope.ConfirmMessage = "YOU ARE ABOUT TO UPLOAD CASE CATEGORIES. ARE YOU SURE YOU WANT TO PROCEED?";
                break;
            case "17": //Routing Sheets
                $scope.UploadButtonCaption = "Load Routing Sheets File";
                $scope.ConfirmMessage = "YOU ARE ABOUT TO PRINT ROUTING SHEETS. ARE YOU SURE YOU WANT TO PROCEED?";
                break;
            case "19": //Custom Merge Excel
                $scope.UploadButtonCaption = "Load Excel File";
                $scope.ConfirmMessage = "YOU ARE ABOUT TO MERGE. ARE YOU SURE YOU WANT TO PROCEED?";
                $scope.ShowTemplateMessage = false;
                break;
        }

        $scope.onFileSelect = function ($files) {
            $scope.UploadedFile = $files[0];
            $scope.UploadError = "";
            $scope.UploadMessage = "";
            $scope.ReturnInfo = [];
        };

        $scope.ShowUploadErrors = function () {

            var uploadData = {};
            uploadData.DbEnvironment = dbEnvironment;
            uploadData.UploadOption = $scope.userSelectedOption;
            uploadData.UploadId = $scope.UploadId;

            var jsonData = angular.toJson(uploadData);

            $http.post("/MassEntry/ShowUploadErrors", {
                jsonData: jsonData
            }).success(function (result) {
                if (result.Success === "Yes") {
                    $scope.ReturnInfo = result.ReturnInfo;
                } else {
                    alert("Error Retrieving Errors");
                }
            })
            .error(function (status) {
                alert("Error Retrieving Errors");
            });
        };

        $scope.UploadFile = function () {

            //var defer = $q.defer();

            //Initialize
            $scope.AllowUpload = false;
            $scope.UploadError = "";
            $scope.ReturnInfo = [];
            $scope.UploadDisabled = true;
            $scope.UploadId = "";
            $scope.ShowErrors = false;

            var data = { dbEnvironment: dbEnvironment, uploadOption: $scope.userSelectedOption };
            var file = $scope.UploadedFile;
            
            
            if (!file) {
                 //return defer.promise;
                $scope.UploadError = "Please select a file";
                //alert('please upload a file');
                return false;
            }

            $upload.upload({
                url: '/MassEntry/UploadDataFile',
                data: data,
                file: file
            })
            .success(function (data, status, headers, config) {
                    if (data.Success === "Yes") {
                        $scope.AllowUpload = true;
                        $scope.UploadId = data.UploadId;
                    } else {
                        $scope.AllowUpload = false;
                        $scope.UploadError = data.ReturnMessage;
                        $scope.ShowErrors = true;
                        $scope.UploadId = data.UploadId;
                    }
                    
                    $scope.ReturnInfo = data.ReturnInfo;
                });

            return true;
            //return defer.promise;
        };

        $scope.UploadData = function () {

            //var defer = $q.defer();

            if (!confirm($scope.ConfirmMessage)) {
                return false;
            }

            var uploadData = {};
            uploadData.DbEnvironment = dbEnvironment;
            uploadData.UploadOption = $scope.userSelectedOption;
            uploadData.UploadId = $scope.UploadId;

            var jsonData = angular.toJson(uploadData);


            $scope.ViewMode = true;
            $scope.EditMode = false;

            $scope.BulkUploadDisabled = true;
            $scope.UploadMessage = "Uploading Please Wait...";


            $http.post("/MassEntry/UploadData", {
                jsonData: jsonData
            }).success(function (result) {
                if (result.Success === "Yes") {
                    $scope.UploadMessage = result.ReturnMessage;
                } else {
                    $scope.UploadMessage = "";
                    $scope.UploadError = "Error Uploading Data";
                }
            })
            .error(function (status) {
                alert('error saving data');
            });

            return true;
            //return defer.promise;
        };


        //$scope.btn_upload = function () {
        //    //$log.info('uploading...');
        //    uiUploader.startUpload({
        //        url: '/MassEntry/UploadActivityFile',
        //        concurrency: 2,
        //        onProgress: function (file) {
        //            //$log.info(file.name + '=' + file.humanSize);
        //            //$scope.$apply();
        //        },
        //        onCompleted: function (file, response) {
        //            //$log.info(file + 'response' + response);
        //        }
        //    });
        //};

        //$scope.files = [];
        //var element = document.getElementById('file1');
        //element.addEventListener('change', function (e) {
        //    var files = e.target.files;
        //    uiUploader.addFiles(files);
        //    $scope.files = uiUploader.getFiles();
        //    $scope.$apply();
        //});

    });

};


