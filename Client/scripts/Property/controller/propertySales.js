'use strict';

var Salemngt= angular.module('propertySale', ['ngRoute'] ); 

   	Salemngt.factory('authInterceptor', function ($rootScope, $q, $window) {
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

Salemngt.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});



Salemngt.config(function($routeProvider,$locationProvider)	{

$locationProvider.hashPrefix("!");

  $routeProvider
	 
 .when('/schedule', {
     templateUrl: 'views/Property/sale/schedule.html',   
      controller: 'schedulectrl'
        })
  .when('/booking', {
     templateUrl: 'views/Property/sale/booking.html',   
      controller: 'bookingctrl'
        }) 
   .when('/reservations', {
     templateUrl: 'views/Property/sale/reservations.html',   
      controller: 'reservationsctrl'
        }) 
  .when('/reservationsRequirements/:details', {
     templateUrl: 'views/Property/sale/reservationsRequirements.html',   
      controller: 'reservationsRequirementsctrl'
        })

	.otherwise({
         redirectTo: '/schedule'
      });

});

Salemngt.controller('Mainctrl', function ($scope,saleFactory) {

    $scope.Logout=function(){

      saleFactory.logout()
              .success(function(data) {
            delete $window.sessionStorage.token;
          $window.location.href = "/";
          }) 
         .error(function(data) {
           delete $window.sessionStorage.token;
          $window.location.href = "/";
          }); 

       } 

});

Salemngt.controller('schedulectrl', function ($scope,saleFactory) {

   

});
Salemngt.controller('reservationsRequirementsctrl', function ($scope,saleFactory,$route) {
$scope.propertydetails=angular.fromJson(atob($route.current.params.details));
console.log($scope.propertydetails);

$scope.client=$scope.propertydetails.client;


$scope.ReservationDet=function(){
    var prop={};
           prop.clientid=$scope.client.id;
           prop.checklist=$scope.checklist;
         saleFactory.updateReservation(prop)  
        
      .success(function (data){
          alert("Reserved ");
        
         })
       .error(function(data,status) {
          console.log("the Status is "+status);
         
       });

}
   

});


Salemngt.controller('reservationsctrl', function ($scope,saleFactory,$location) {

    saleFactory.getReservedProperty()  
      .success(function (data){
          $scope.data=data;
        
         })
       .error(function(data,status) {
          console.log("the Status is "+status);
         
       });



       $scope.ReservedRequirements=function(req,index){
        var det = angular.toJson(req);
           det=btoa(det);

        $location.path('/reservationsRequirements/'+det);

       }


});



Salemngt.controller('bookingctrl', function ($scope,saleFactory) {

   saleFactory.getBookedProperty()  
      .success(function (data){
          $scope.data=data;
        
         })
       .error(function(data,status) {
          console.log("the Status is "+status);
         
       });

       $scope.acceptRequest=function(req,id){
        var prop={};
           prop.clientid=req.client.id;
           console.log(req.client.id);
         saleFactory.acceptRequest(prop)  
        
      .success(function (data){
          alert("accepted");
        
         })
       .error(function(data,status) {
          console.log("the Status is "+status);
         
       });

       }

});





Salemngt.factory('saleFactory', ['$http',function($http) {
  var url='/web/Sales';
  var data = {  
          getBookedProperty:function () {
               return $http.get(url + '/booking',{ cache: true });
            },
            getAdminDetails:function () {
         return $http.get(url + '/AdminDetails',{ cache: true });
            },
             getReservedProperty:function () {
               return $http.get(url + '/reservation',{ cache: true });
            },  
             updateReservation:function (reservationdet) {
               return $http.put(url + '/reservation',reservationdet);
            },  

            acceptRequest:function (clientid) {
               return $http.put(url + '/booking',clientid);
            }, 
              logout:function () {
         return $http.get('/web/logout');
            },

            
            
           



  }
  return data;
}]);

