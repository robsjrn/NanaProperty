'use strict';

var Financemngt= angular.module('propertyFinance', ['ngRoute'] ); 

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
Financemngt.controller('paymentctrl', function ($scope,$window) {

         
	});
Financemngt.service('SettingService', function () {
    var settings = [];
    this.set = function (settings) {
         
		   settings.push(settings);

    }

    this.get = function (settings) {
         
		   return settings;

    }

	});

 Financemngt.service('BatchTrxnService', function () {

    var data = [];
       var uid = 0;
          var i;
    this.save = function (user) {
           user.traceid=uid++;
		   data.push(user);

    }


    this.get = function (id) {
        for (i in data) {
            if (data[i].traceid == id) {	
                return data[i];
            }
        }

    }
    
    //iterate through contacts list and delete 
    //contact if found
    this.delete = function (id) {
        for (i in data) {
            if (data[i].traceid == id) {
				var dt=data[i];
                data.splice(i, 1);
				return dt;
            }
        }
    }
    this.Drop=function(){
         data.length = 0;
       }
    this.list = function () {
        return data;
    }
});
