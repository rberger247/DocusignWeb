new function () {
    var App = angular.module('MassEntryApp');

    App.controller('DocumentLinkController', function ($scope, $http, $location, $filter, ngDialog) {

        //$scope.openConfirm = function () {
        //    return ngDialog.openConfirm({
        //        template: 'modalDialogId',
        //        className: 'ngdialog-theme-default'
        //    }).then(function (value) {
        //        return 'confirmed';
        //        console.log('Modal promise resolved. Value: ', value);
        //    }, function (reason) {
        //        return 'cancelled';
        //        console.log('Modal promise rejected. Reason: ', reason);
        //    });
        //};

        //$scope.confirm = function () {
        //    return ngDialog.openConfirm({ template: 'modalDialogId' });
        //};

        $scope.DocLinkMode = "Basic";

        var dbEnvironment = $scope.dbEnvironment;

        $scope.showBatchTypes = false;
        $scope.showDocumentTypes = false;
        $scope.showDescription = false;
        $scope.ClientsMessage = "";

        $scope.Clients = [];

        $scope.EditMode = true;
        $scope.ViewMode = false;
        

        //Get Initial Settings
        var initParams = { dbEnvironment: dbEnvironment }
        $http.get("/MassEntry/GetInitialValues", { params: initParams })
        .success(function (response, status) {
            $scope.AllBatchTypes = response.BatchTypes;
            $scope.DocumentMainPath = response.DocumentMainPath;
            $scope.AllDocumentTypes = response.DocTypes;
        });


        ////Get All Batch Types
        //$http({
        //    method: "GET",
        //    url: "/MassEntry/GetBatchTypes",
        //    params: { dbEnvironment: dbEnvironment }
        //}).then(function success(response) {
        //    $scope.AllBatchTypes = response.data;
        //}, function error(response) {
        //    alert("Error Retrieving Batch Types" + response.statusText);
        //});

        //Get All Form Types
        //var docTypeParams = { dbEnvironment: dbEnvironment, batchType: null }
        //$http.get("/MassEntry/GetDocumentTypes", { params: docTypeParams })
        //     .success(function (response, status) {
        //         $scope.AllDocumentTypes = response;
        //});

        //Link Documents Function
        $scope.LinkDocuments = function () {

            if (!confirm("You are about to link documents to images. Are you sure you want to proceed?")) {
                return false;
            }

            $scope.LinkDocumentsDisabled = true;

            var errors = false;
            //$scope.BatchTypeError = false;
            //$scope.DocumentTypeError = false;
            $scope.DocumentDescriptionError = false;
            $scope.IncompleteSelection = false;

            //if (!$scope.quickSelectBatchType)
            //{
            //    $scope.BatchTypeError = true;
            //    errors = true;
            //}

            //if (!$scope.selectedDocumentType) {
            //    $scope.DocumentTypeError = true;
            //    errors = true;
            //}

            if (!$scope.DocumentDescription)
            {
                $scope.DocumentDescriptionError = true;
                errors = true;
            }

            angular.forEach($scope.Clients, function (value, index) {
                if (value.DocumentType == null)
                {
                    errors = true;
                    $scope.IncompleteSelection = true;
                }
            });

            
            
            if (errors == true)
            {
                $scope.LinkDocumentsDisabled = false;
                return;
            }


            var linkData = {};
            linkData.dbEnvironment = dbEnvironment;
            //linkData.batchType = $scope.quickSelectBatchType;
            //linkData.documentType = $scope.selectedDocumentType;
            linkData.documentFolder = $scope.DocumentFolder;
            linkData.documentDescription = $scope.DocumentDescription;
            linkData.clients = $scope.Clients;

            var jsonData = angular.toJson(linkData);

            $http.post("/MassEntry/LinkDocuments", {
                jsonData: jsonData
            }).success(function (result) {
                if (result.ReturnMessage === "Success") {
                    $scope.Clients = result.Clients;
                    $scope.ViewMode = true;
                    $scope.EditMode = false;
                }
            })
            .error(function (status) {
                    alert('error linking docs');
                });

        };

        //Load Documents Function
        $scope.LoadDocuments = function () {

            var errors = false;
            $scope.DocumentPathError = "";

            $scope.AllowLinkDocuments = false;
            $scope.showBatchTypes = false;
            $scope.showDocumentTypes = false;
            $scope.showDescription = false;

            $scope.quickSelectBatchType = "";
            $scope.Clients = [];


            if (!$scope.DocumentFolder)
            {
                $scope.DocumentPathError = "Please Enter a Valid Path";
                errors = true;
            }

            if (errors == true) {
                return;
            }

            var params = { dbEnvironment: dbEnvironment, documentFolder: $scope.DocumentFolder }

            $http.get("/MassEntry/GetClientList", { params: params })
                 .success(function (response, status) {
                     if (response.Message === "Success")
                     {
                         $scope.Clients = response.Clients;
                         if ($scope.Clients.length > 0)
                         {
                             $scope.ClientsMessage = $scope.Clients.length + " Client(s) found";
                             $scope.showBatchTypes = true;
                             $scope.showDocumentTypes = true;
                             $scope.showDescription = true;
                             $scope.AllowLinkDocuments = true;
                             $scope.quickSelectBatchType = response.BatchType;
                         }
                         else
                         {
                             $scope.ClientsMessage = "No Clients found";
                         }
                     }
                     else
                     {
                         $scope.DocumentPathError = response.Message;
                     }
                     
                 });
        };

        
        //$scope.fileNameChanged = function (ele) {
        //    var files = ele.files;
        //    var l = files.length;
        //    var namesArr = [];

        //    for (var i = 0; i < l; i++) {
        //        namesArr.push(files[i]);
        //    }
        //    console.log(namesArr);
        //};

        $scope.ChangeDocLinkMode = function () {
            //alert($scope.DocLinkMode);
            $scope.DocumentPathError = "";

            $scope.AllowLinkDocuments = false;
            $scope.showBatchTypes = false;
            $scope.showDocumentTypes = false;
            $scope.showDescription = false;

            $scope.quickSelectBatchType = "";
            $scope.Clients = [];
            $scope.DocumentFolder = "";
            $scope.ClientsMessage = "";

        };

        $scope.QuickSelectDocumentType = function () {
            if ($scope.selectedDocumentType != null)
            {
                //console.log($scope.selectedDocumentType);
                
                var clientsByBatchType = $filter('filter')($scope.Clients, { BatchType: $scope.quickSelectBatchType });
                angular.forEach(clientsByBatchType, function (value, index) {
                    value.DocumentType = $scope.selectedDocumentType;
                });

                console.log($scope.Clients);
            }

            //$scope.Clients.each(function (Client) {
            //    console.log(Client.FirstName)
            //    //Client.DocumentType = $scope.selectedDocumentType
            //});
        };

        //$scope.GetDocumentsForBatchType = function () {
        //    $scope.selectedDocumentType = "";
            
        //    var params = { dbEnvironment: dbEnvironment, batchType: $scope.quickSelectBatchType }

        //    $http.get("/MassEntry/GetDocumentTypes", {params: params})
        //         .success(function (response, status) {
        //            $scope.DocumentTypes = response;
        //    });

        //};

    });

};

