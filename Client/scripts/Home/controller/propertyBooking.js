var PropertyBooking= angular.module('PropertyBookingApp', [] ); 



PropertyBooking.controller('Mainctrl', function($scope,$location,bookingFactory,$window) {


               try {
               	  $scope.search=window.location.search.substring(1);
                  $scope.propertydetails=angular.fromJson(atob($scope.search));

               }catch (er){
               	 console.log(er);
               	 $window.location.href='/Illegal.html';
               }


   $scope.bookProperty=function(){
   	var prop={};
   	prop.client= $scope.booking.client;
  	prop.property=$scope.propertydetails.property;
  	prop.stage="booking";
  	prop.Owner=$scope.propertydetails.Owner;


   	 bookingFactory.bookProperty(prop)
		 .success(function (data){
	
			  alert("Booked");
			 
			  
			   })
		   .error(function(data) {
			  console.log("Error Configuring Your Details Refresh");
		   });

   }

      



});





PropertyBooking.factory('bookingFactory', ['$http',function($http) {
var url='/web/Property';
	var data = {
              
		
		 
            getAdminDetails:function () {
		     return $http.get(url + '/AdminDetails',{ cache: true });
            },
           
           
            bookProperty: function(property) {
			return $http.post(url+'/PropertyBooking',property);
			
		},
           



	}
	return data;
}]);