'use strict';

var Salemngt= angular.module('propertySale', ['ui.router'] ); 

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

Salemngt.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/schedule");
       $stateProvider
        .state('settings', {
          url: "/settings",
          controller: 'settingsctrl',
          templateUrl: "views/Property/sale/settings.html"
          })
          .state('settings.pipelinesetting', {
            url: "/pipelinesetting",
            controller: 'pipelinesettingctrl',
            templateUrl: "views/Property/sale/settingspartials/settings.html"
          })
          .state('settings.pipelinedesign', {
            url: "/design",
            controller: 'settingDesignsctrl',
            templateUrl: "views/Property/sale/settingspartials/design.html"
          })
       .state('schedule', {
          url: "/schedule",
          controller: 'schedulectrl',
          templateUrl: "views/Property/sale/schedule.html"
        })
       .state('booking', {
          url: "/booking",
          controller: 'bookingctrl',
          templateUrl: "views/Property/sale/booking.html"
        })
       .state('reservations', {
          url: "/reservations",
          controller: 'reservationsctrl',
          templateUrl: "views/Property/sale/reservations.html"
        })
       .state('reservationsRequirements/:details', {
          url: "//reservationsRequirements/:details",
          controller: 'reservationsRequirementsctrl',
          templateUrl: "views/Property/sale/reservationsRequirements.html"
        })
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

Salemngt.controller('pipelinesettingctrl', function ($scope,saleFactory,SalesService) {
     $scope.positions=SalesService.getPositions();
     $scope.stages =SalesService.getDesign();
     var settings=[];
   $scope.saveData=function(id,tid){
            $scope.positions= SalesService.deletePositon(id);
            $scope.stages=SalesService.removeStage(tid);
            settings.push($scope.data);
            $scope.settings=settings;
   }

});
Salemngt.service('SalesService', function () {
    var design=[] ;
    var uid = 0;
          var i;
    var positions =[{"id":1,"name":"One"},{"id":2,"name":"Two"}
    ,{"id":3,"name":"Three"},{"id":4,"name":"Four"},{"id":5,"name":"Five"}
   ];
   this.saveDesign = function (det) {
          det.traceid=uid++;
          design.push(det);
    }
    this.getDesign = function () {
      return design;
    }
    this.getPositions=function(){
      return positions;
    }
    this.deletePositon = function (id) {
        for (i in positions) {
            if (positions[i].id == id) {
        
                positions.splice(i, 1);
        return positions;
            }
        }
    }
    this.removeStage = function (name) {
        for (i in design) {
            if (design[i].stagename == name) {
                design.splice(i, 1);
        return design;
            }
        }
    }
});

Salemngt.controller('settingDesignsctrl', function ($scope,saleFactory,SalesService) {

    $scope.inputs = [];
    $scope.design={};
    $scope.addfield = function () {
        $scope.inputs.push({})
    }
    $scope.getValue = function (item) {
        alert(item.value)
    }
    $scope.savedetails=function(){
           $scope.design.stagename=$scope.stage.name;
           $scope.design.requirements=$scope.inputs;

           SalesService.saveDesign($scope.design);

    }

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


Salemngt.controller('settingsctrl', function ($scope,saleFactory) {
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

