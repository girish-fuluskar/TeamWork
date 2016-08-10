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

.controller('addMoreBillItems', function($scope, $controller, $cordovaToast, $filter, StorageService, $ionicListDelegate, $state){
	var billItemsArray=[];

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
			date : date.toISOString().slice(0,10),
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
 