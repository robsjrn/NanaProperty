'use strict';

var Financemngt= angular.module('propertyFinance', ['ngRoute','notifications'] ); 

   	Financemngt.factory('authInterceptor', function ($rootScope, $q, $window) {
		  return {
			request: function (config) {
			  config.headers = config.headers || {};
			  if ($window.sessionStorage.token) {
				config.headers.token=  $window.sessionStorage.token;
			  }
			  else{
				   // no token in Store
                    $window.location.href = "Error.html";
			  }
			  return config;
			},
			response: function (response) {
			  if (response.status === 401) {
				// handle the case where the user is not authenticated
				$window.location.href = "Error.html";
			  }
			  return response || $q.when(response);
			}
		  };
		});

Financemngt.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});

Financemngt.config(function($routeProvider,$locationProvider)	{

$locationProvider.hashPrefix("!");

  $routeProvider
	 
 .when('/payment', {
     templateUrl: 'views/property/finance/payment.html',   
      controller: 'paymentctrl'
        })
    .when('/TenantAdmin', {
       templateUrl: 'views/Admin/TenantAdmin.html',   
       controller: 'TenantAdminctrl'
        })
	.otherwise({
         redirectTo: '/payment'
      });

});


Financemngt.controller('Mainctrl', function ($scope,$window) {

	});
Financemngt.controller('paymentctrl', function ($scope,$window,$notification) {

           $notification.info('test', 'content', 'userData', 60);
	});