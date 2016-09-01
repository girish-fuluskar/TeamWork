angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

  .state('dashboard', {
    url: '/dashboard',
    templateUrl: 'templates/dashboard.html',
    controller: 'getBillCtrl'
  })

  .state('createNewBill', {
    cache: false,
    url: '/createnewbill',
    templateUrl: 'templates/createNewBill.html',
    controller: 'createNewBillCtrl'
  })

  .state('reviewBill',{
    url: '/reviewbill',
    templateUrl: 'templates/reviewBill.html',
    controller: 'reviewBillCtrl'
  })

$urlRouterProvider.otherwise('/dashboard')

  

});