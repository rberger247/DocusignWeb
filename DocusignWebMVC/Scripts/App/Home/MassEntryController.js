new function() {
    var App = angular.module('MassEntryApp');

    App.controller('MassEntryController', function ($scope, $http, $location) {

            $scope.title = "Mass Entry";
            $scope.include = "";

            $scope.dbEnvironment = $location.search().db;
            $scope.LitAbbr = $location.search().lit;

            var cacheid = "DD8A2B42";
            

            //get entry options
            var initParams = { dbEnvironment: $scope.dbEnvironment };
            $http.get("/MassEntry/GetMassEntryOptions", { params: initParams }).success(function (data, status, headers, config) {
                $scope.EntryOptions = data.EntryOptions;
                if ($scope.EntryOptions.length === 0)
                {
                    $scope.Access = false;
                    $scope.include = "Scripts/App/Shared/NoAccess.html";
                }
                else
                {
                    $scope.Access = true;
                }
            }).error(function (data, status, headers, config) {
                alert("Unexpected Error");
            });

            $scope.ProcessOption = function () {
                console.log('selectedOption ' + $scope.userSelectedOption);

                switch ($scope.userSelectedOption) {
                    case "1": //Correspondence
                        $scope.include = "Scripts/App/CorrespondenceEntry/CorrespondenceEntry.html";
                        break;
                    case "2": //Activity
                        $scope.include = "Scripts/App/ActivityEntry/ActivityEntry.html";
                        break;
                    case "3": //Upload Excel Activities
                        $scope.include = "Scripts/App/BulkUpload/BulkUpload.html?Option3";
                        break;
                    case "4": //Retainer Sent
                        $scope.include = "Scripts/App/RetainerSent/RetainerSent.html";
                        break;
                    case "6": //Upload Excel Questions
                        $scope.include = "Scripts/App/BulkUpload/BulkUpload.html?Option6";
                        break;
                    case "5": //Link Documents
                        $scope.include = "Scripts/App/DocumentLink/DocumentLink.html?cacheid=" + cacheid;
                        break;
                    case "7": //Update Paralegal Assignments
                        $scope.include = "Scripts/App/BulkUpload/BulkUpload.html?Option7";
                        break;
                    case "8": //Bulk SubLit Change
                        $scope.include = "Scripts/App/BulkUpload/BulkUpload.html?Option8";
                        break;
                    case "9": //Case Category Upload
                        $scope.include = "Scripts/App/BulkUpload/BulkUpload.html?Option9";
                        break;
                    case "10": //Reject Letter
                        $scope.include = "Scripts/App/RejectLetter/RejectLetter.html?cacheid=" + cacheid;
                        break;
                    case "11": //S&C Letters
                        $scope.include = "Scripts/App/SCLetter/SCLetter.html?Option11";
                        break;
                    case "12": //Affidavit
                        $scope.include = "Scripts/App/SCLetter/SCLetter.html?Option12";
                        break;
                    case "13": //Affidavit
                        $scope.include = "Scripts/App/SCLetter/SCLetter.html?Option13";
                        break;
                    case "14": //PFS
                        $scope.include = "Scripts/App/SCLetter/SCLetter.html?Option14";
                        break;
                    case "15": //Subpoena
                        $scope.include = "Scripts/App/SCLetter/SCLetter.html?Option15";
                        break;
                    case "16": //S&C Letters
                        $scope.include = "Scripts/App/SCLetter/SCLetter.html?Option16";
                        break;
                    case "17": //Routing Sheets
                        $scope.include = "Scripts/App/BulkUpload/BulkUpload.html?Option17";
                        break;
                    case "18": //Affidavit Dismissal
                        $scope.include = "Scripts/App/SCLetter/SCLetter.html?Option18";
                        break;
                    case "19": //Custom Merge Excel
                        $scope.include = "Scripts/App/BulkUpload/BulkUpload.html?Option19";
                        break;
                    case "20": //PPITemplateMIA
                        $scope.include = "Scripts/App/SCLetter/SCLetter.html?Option20";
                        break;
                    case "21": //PPITemplateHIPAA
                        $scope.include = "Scripts/App/SCLetter/SCLetter.html?Option21";
                        break;
                    case "22": //PPITemplateNOK
                        $scope.include = "Scripts/App/SCLetter/SCLetter.html?Option22";
                        break;
                    case "23": //Subpoena 2nd Attempt
                        $scope.include = "Scripts/App/SCLetter/SCLetter.html?Option23";
                        break;
                    default:
                }
            };

    });

};

