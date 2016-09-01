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

//Review bill before generating invoice (taking last value added in local storage)
.controller('reviewBillCtrl', function($scope, $stateParams, StorageService){
	$scope.billItemsFromStorageToReview = StorageService.getAll();
	if($scope.billItemsFromStorageToReview.length>=1){
		$scope.billItemsFromStorageToReview = $scope.billItemsFromStorageToReview[$scope.billItemsFromStorageToReview.length-1];
	}
	else{
		$scope.billItemsFromStorageToReview = StorageService.getAll();
	}
})

//Getting local storage values
.controller('getBillCtrl', function($scope, $stateParams, StorageService){
	$scope.getBillDetails = StorageService.getAll();
})

.controller('addMoreBillItems', function($scope, $ionicModal, $ionicPlatform, $cordovaToast, StorageService, $ionicListDelegate, $cordovaFile, $cordovaEmailComposer, $state){
	var billItemsArray=[];
	var vm = this;

	// Initialize the modal view.
	    $ionicModal.fromTemplateUrl('pdf-viewer.html', {
	        scope: $scope,
	        animation: 'slide-in-up'
	    }).then(function (modal) {
	        vm.modal = modal;
	    });

	//creating document defination from local storage value (taking only last value added in local storage)
	$scope.getStorageValue = function(){	
		//getting all records from local storage and filtering to last value added
		$scope.billItemsFromStorage = StorageService.getAll();
		if($scope.billItemsFromStorage.length>=1){
			$scope.billItemsFromStorage = $scope.billItemsFromStorage[$scope.billItemsFromStorage.length-1];
		}
		else{
			$scope.billItemsFromStorage = StorageService.getAll();
		}

		//Mapping local stoarage values according to document defination
		var items = $scope.billItemsFromStorage.finalBillDetails.map(function(item) {
	        return [item.particulars, JSON.stringify(item.quantity), JSON.stringify(item.amount)];
	    });

		//creating document defination for pdf
		var documentDefination = { 
			content: [
	            { text: 'TEAM WORK', style: 'header', alignment: 'center'},
    	        { text: 'Flat No. 903, Guru Niwas Building, Near Wester Express Highway, Jijamata Marg, Pump House, Andheri(E), Mumbai  400093, Tel : 2683 4151 | Email : teamwork.kumar@gmail.com', alignment: 'center'},
    	        { text: ' '},
            	{ text: ' '},
            	{ text: $scope.billItemsFromStorage.header.date, alignment: 'right'},
            	{ text: 'To,', style: 'subheader'},
            	{ text: 'M/S :' + "   " + $scope.billItemsFromStorage.header.ms, style: 'subheader'},
            	{ text: 'Pan Card No : ADWPR2292Q', alignment: 'right'},
            	{ text: 'Service Tax No : ADWPR2292QST001', alignment: 'right'},
            	{text: ' '},
            	{ text: 'Particulars', style: 'subheader'},
            	{
					style: 'tableExample',
					table: {
							widths: ['*', 75, 75],
							body: [
								[
									{ text: 'Particulars', style: 'itemsTableHeader' },
		                            { text: 'Quantity', style: 'itemsTableHeader' },
		                            { text: 'Price', style: 'itemsTableHeader' },
	                            ]
							].concat(items)
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
	                            $scope.billItemsFromStorage.totalAmount.total.toString(),
	                        ],
	                        [
	                            '',
	                            'Shipping',
	                            '0',
	                        ],
	                        [
	                            '',
	                            'Total',
	                            $scope.billItemsFromStorage.totalAmount.total.toString(),
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
    		var arr = new Array(pdf.length);
    		for(var i = 0; i < pdf.length; i++) {
			    arr[i] = pdf.charCodeAt(i);
			}
			var byteArray = new Uint8Array(arr);			
			binaryArray = byteArray.buffer;
			var blob = new Blob([byteArray], {type: 'application/pdf'});
			$scope.pdfUrl = URL.createObjectURL(blob);
		    		    
		    //writing file on device		    
    		var folderpath = cordova.file.externalRootDirectory;
    		var filename = $scope.billItemsFromStorage.header.ms+".pdf";

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
    		$state.go('dashboard', {},{location:'replace'}).then(
    			function(){
    				//Opening created pdf file into default file opener (Acrobat for PDF)
					window.plugins.fileOpener.open(folderpath+$scope.billItemsFromStorage.header.ms+".pdf");
    		});
    	});    	
	}   

	$scope.addBillItems = function(quantity,particulars,amount){		
		if(($scope.date != "" && $scope.date != null) && ($scope.ms !="" && $scope.ms != null) 
			&& ($scope.particulars !="" && $scope.particulars != null)){
			//creating structured JSON bean
			var billItems={
				quantity : quantity,
				particulars : particulars,
				amount : amount
			};

			$scope.addedItems = billItems;
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
		var listBillItems=[];
		var totalOfItems=0;
		var header={
			date : date.toString().slice(0,15),
			ms : ms
		}
		for(var t=0;t<billItemsArray.length;t++){
			totalOfItems += billItemsArray[t].billItems.amount; 
		}

		var totalAmount={
			total : totalOfItems
		} 					
		if(billItemsArray.length >0){
			StorageService.add(header,billItemsArray, totalAmount);

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