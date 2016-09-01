angular.module('app.services', [])

// New factory for localstorage
.factory ('StorageService', function ($localStorage) {

	$localStorage = $localStorage.$default({
	  things: []
	});

	var _getAll = function () {
	  return $localStorage.things;
	};

	var _add = function (header, billItems, totalAmount) {
		var finalBillDetails = [];
		
		//creating repeatative structure
		for(var y=0;y<billItems.length;y++){
			var itemDetails = 
			{		
				quantity : billItems[y].billItems.quantity,
				particulars : billItems[y].billItems.particulars,
				amount :billItems[y].billItems.amount
			};
			finalBillDetails.push(itemDetails);
		}
		//creating final structure
		var finalInvoice =
		{
			header,
			finalBillDetails,
			totalAmount
		}
		//pushing to local storage
	  	$localStorage.things.push(finalInvoice);	  		  	
	}

	/*var _remove = function (thing) {
	  $localStorage.things.splice($localStorage.things.indexOf(thing), 1);
	}*/

	return {
	    getAll: _getAll,
	    add: _add
	    //remove: _remove
	  };
})