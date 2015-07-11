



var PropertyListing= angular.module('PropertyListingApp', [] ); 



PropertyListing.controller('Mainctrl', function($scope,$location,propertyListingFac,$window) {

   

                  console.log("url"+$location.absUrl());


         propertyListingFac.listproperty()
		  .success(function(data) { 
			 $scope.data=data;
			 console.log($scope.data);
                                  }) 
		  .error(function(data) {
            });

$scope.bookProperty=function(property){
     	var det = angular.toJson(property);
           det=btoa(det);



           $window.location.href='/property-Booking.html?'+det;
}

});



PropertyListing.factory('propertyListingFac', ['$http', function($http) {
	var url='/web/Property/';
	var data = {

		  	listproperty:function (tenantid) {
		     return $http.get(url + 'property');
            }
	}
	return data;
}]);