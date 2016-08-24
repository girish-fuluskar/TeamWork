angular.module('app.controllers')

/*.controller('getStorageAllData', function($scope, StorageServiceLocal){
    $scope.storageDataGetAll = StorageServiceLocal.getStorageData();
})*/

.controller('DocumentController', ['$scope', '$ionicModal', '$localStorage', 'InvoiceService', 'StorageServiceLocal', DocumentController]);

function DocumentController($scope, $ionicModal, $localStorage, $cordovaEmailComposer, InvoiceService, StorageServiceLocal) {
    var vm = this;

    setDefaultsForPdfViewer($scope);

    // Initialize the modal view.
    $ionicModal.fromTemplateUrl('pdf-viewer.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        vm.modal = modal;
    });

    vm.createInvoice = function () {
        var invoice = getDummyData();

        InvoiceService.createPdf(invoice)
                        .then(function(pdf) {
                            var blob = new Blob([pdf], {type: 'application/pdf'});
                            $scope.pdfUrl = URL.createObjectURL(blob);

                            // Display the modal view
                            vm.modal.show();
                        });
    };

    // Clean up the modal view.
    $scope.$on('$destroy', function () {
        vm.modal.remove();
    });

    return vm;
}

function setDefaultsForPdfViewer($scope) {  
    $scope.scroll = 0;
    $scope.loading = 'loading';

    $scope.onError = function (error) {
        console.error(error);
    };

    $scope.onLoad = function () {
        $scope.loading = '';
    };

    $scope.onProgress = function (progress) {
        console.log(progress);
    };
}

function getDummyData($scope, $localStorage) {

    //$scope.storageDataGetAll = JSON.parse(localStorage["ngStorage-things"]); //StorageServiceLocal.getStorageData();
    console.log('Here : ' + JSON.parse(localStorage["ngStorage-things"]));
    return {        
        Date: JSON.parse(localStorage["ngStorage-things"])[0].header.date,//$scope.storageDataGetAll[0].header.date,
        To: {            
        },
        Ms: {
            Ms: JSON.parse(localStorage["ngStorage-things"])[0].header.ms//$scope.storageDataGetAll[0].header.ms
        },
        Particulars: [
            { Description: 'iPhone 6S', Quantity: '1', Price: '€700' },
            { Description: 'Samsung Galaxy S6', Quantity: '2', Price: '€655' }
        ],
        Subtotal: '€2010',
        Shipping: '€6',
        Total: '€2016'
    };
}