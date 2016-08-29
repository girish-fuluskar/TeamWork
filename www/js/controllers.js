angular.module('app.controllers', [])
  
.controller('dashboardCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('createNewBillCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('reviewBillCtrl', function($scope, $stateParams, StorageService){
	$scope.billItemsFromStorage = StorageService.getAll();
	if($scope.billItemsFromStorage.length>=1){
		$scope.billItemsFromStorage = $scope.billItemsFromStorage[$scope.billItemsFromStorage.length-1];
	}
	else{
		$scope.billItemsFromStorage = StorageService.getAll();
	}
})

.controller('addMoreBillItems', function($scope, $controller, $ionicModal, $ionicPlatform, $cordovaToast, $filter, StorageService, $ionicListDelegate, $cordovaFile, $cordovaEmailComposer, $state){
	var billItemsArray=[];
	var vm = this;

	// Initialize the modal view.
	    $ionicModal.fromTemplateUrl('pdf-viewer.html', {
	        scope: $scope,
	        animation: 'slide-in-up'
	    }).then(function (modal) {
	        vm.modal = modal;
	    });

	$scope.getStorageValue = function(){	

		$scope.billItemsFromStorage = StorageService.getAll();
		//creating document defination for pdf
		var documentDefination = { 
			content: [
	            { text: 'TEAM WORK', style: 'header', alignment: 'center'},
    	        { text: 'Flat No. 903, Guru Niwas Building, Near Wester Express Highway, Jijamata Marg, Pump House, Andheri(E), Mumbai  400093, Tel : 2683 4151 | Email : teamwork.kumar@gmail.com', alignment: 'center'},
    	        { text: ' '},
            { text: ' '},
            { text: $scope.billItemsFromStorage[0].header.date, alignment: 'right'},
            { text: 'To,', style: 'subheader'},
            { text: 'M/S :' + "   " + $scope.billItemsFromStorage[0].header.ms, style: 'subheader'},
            { text: 'Pan Card No : ADWPR2292Q', alignment: 'right'},
            { text: 'Service Tax No : ADWPR2292QST001', alignment: 'right'},
            {text: ' '},
            { text: 'Particulars', style: 'subheader'},
            {
					style: 'tableExample',
					table: {
							widths: ['*', 75, 75],
							body: [
									['Particulars', 'Quantity', 'Amount'],
									[$scope.billItemsFromStorage[0].finalBillDetails[0].particulars, $scope.billItemsFromStorage[0].finalBillDetails[0].quantity.toString(), $scope.billItemsFromStorage[0].finalBillDetails[0].amount.toString()]
							]
					}
			},
			{
                style: 'totalsTable',
                table: {
                    widths: ['*', 75, 75],
                    body: [
                        [
                            '',
                            'Subtotal',
                            $scope.billItemsFromStorage[0].finalBillDetails[0].amount.toString(),
                        ],
                        [
                            '',
                            'Shipping',
                            '0',
                        ],
                        [
                            '',
                            'Total',
                            $scope.billItemsFromStorage[0].finalBillDetails[0].amount.toString(),
                        ]
                    ]
                },
                layout: 'noBorders'
            },
			],
	        styles: {
	            header: {
	                fontSize: 20,
	                bold: true,
	                margin: [0, 0, 0, 10],
	                alignment: 'right'
	            },
	            subheader: {
	                fontSize: 16,
	                bold: true,
	                margin: [0, 20, 0, 5]
	            },
	            itemsTable: {
	                margin: [0, 5, 0, 15]
	            },
	            itemsTableHeader: {
	                bold: true,
	                fontSize: 13,
	                color: 'black'
	            },
	            totalsTable: {
	                bold: true,
	                margin: [0, 30, 0, 0]
	            }
	        }
    	};    	

    	pdfMake.createPdf(documentDefination).getBase64(function(base64){
    		pdf = atob(base64);
    		p = base64;
    		var arr = new Array(pdf.length);
    		var a = new Array(p);
			for(var i = 0; i < pdf.length; i++) {
			    arr[i] = pdf.charCodeAt(i);
			}
			var byteArray = new Uint8Array(arr);
			var byteArray64 = new Uint8Array(p);
			binaryArray = byteArray.buffer; // Convert to Binary...	

			var blob = new Blob([byteArray], {type: 'application/pdf'});
			$scope.pdfUrl = URL.createObjectURL(blob);
		    		    
		    //writing file on device		    
    		var folderpath = cordova.file.externalRootDirectory;
    		var filename = "File.pdf";

    		window.resolveLocalFileSystemURL(folderpath, function(dir) {
		        console.log("Access to the directory granted succesfully");
				dir.getFile(filename, {create:true}, function(file) {
		            console.log("File created succesfully.");
		            file.createWriter(function(fileWriter) {
		                console.log("Writing content to file");
		                fileWriter.write(blob);
		            }, function(){
		                alert('Unable to save file in path '+ folderpath);
		            });
				});
		    });

			vm.modal.show();			
    	});
	}

	// Clean up the modal view.
    /*$scope.$on('$destroy', function () {
        vm.modal.remove();
    });*/

    

	$scope.addBillItems = function(quantity,particulars,amount){		
		if(($scope.date != "" && $scope.date != null) && ($scope.ms !="" && $scope.ms != null) 
			&& ($scope.particulars !="" && $scope.particulars != null)){
			//creating structured JSON bean
			var billItems={
				quantity : quantity,
				particulars : particulars,
				amount : amount
			};
			//assigning to obk=ject
			var finalBillItems = {billItems:billItems};
			//pushing into array
			billItemsArray.push(finalBillItems);
			//clearing data from controls
			$scope.quantity = "";
		    $scope.particulars = "";
		    $scope.amount = "";
		    //retrive items
		    $scope.things = billItemsArray;		    

		    //toast message for item added
		    $cordovaToast.show("Item Added", 'short', 'bottom')
		    .then(function(success) {
		            
	        }, function (error) {
	            
	        });
		}
		else{
			//toast message for require validation
			$cordovaToast.show("All item required", 'short', 'bottom')
		    .then(function(success) {		    			            
	        }, function (error) {	            
	        });
		}		
	};
	$scope.addStorage = function (date,ms) {
		var listBillItems = [];
		var header={
			date : date.toString().slice(0,15),
			ms : ms
		} 					
		if(billItemsArray.length >0){
			StorageService.add(header,billItemsArray);

			listBillItems.push(header,billItemsArray);
			$scope.things = listBillItems;
			//clearing fields on previous screen
			$scope.ms = "";
			$scope.date = "";

			//removing item from list
	        for(var r=0;r<=billItemsArray.length;r++){
	        	billItemsArray.splice(billItemsArray[r], 1);
	        	$ionicListDelegate.closeOptionButtons();
	        }
	        
	        $state.go('reviewBill');

			//toast message for item added
		    $cordovaToast.show("Bill Saved", 'short', 'bottom')
		    .then(function(success) {		    		    		            
	        }, function (error) {            
	        });
		}
		else{
			//toast message for require validation
			$cordovaToast.show("Bill item required", 'short', 'bottom')
		    .then(function(success) {		            
	        }, function (error) {	            
	        });
		}		                   
	};
	//deleting items one by one from list
	$scope.deleteItem = function (i, billItemsDelete){
		billItemsArray.splice(billItemsArray.indexOf(i), 1);		
		$ionicListDelegate.closeOptionButtons();
	};
}) 
 