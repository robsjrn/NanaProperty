'use strict';

var Adminmngt= angular.module('propertyAdmin', ['ngRoute'] ); 

   	Adminmngt.factory('authInterceptor', function ($rootScope, $q, $window) {
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

Adminmngt.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});



Adminmngt.config(function($routeProvider,$locationProvider)	{

$locationProvider.hashPrefix("!");

  $routeProvider
	 
 .when('/propertyRegistration', {
     templateUrl: 'views/Admin/propertyRegistration.html',   
      controller: 'propertyRegistrationctrl'
        })
  .when('/addproperty', {
     templateUrl: 'views/Admin/addproperty.html',   
      controller: 'addpropertyctrl'
        })
  .when('/Users', {
     templateUrl: 'views/Admin/Users.html',   
     controller: 'Usersctrl'
        })
   .when('/addUser', {
     templateUrl: 'views/Admin/adduser.html',   
      controller: 'addUserctrl'
        })
   .when('/Roles', {
       templateUrl: 'views/Admin/Roles.html',   
       controller: 'Rolesctrl'
        })
    .when('/assignResponsibility', {
       templateUrl: 'views/Admin/assignResponsibility.html',   
       controller: 'assignResponsibilityctrl'
        })
    .when('/TenantAdmin', {
       templateUrl: 'views/Admin/TenantAdmin.html',   
       controller: 'TenantAdminctrl'
        })
	.otherwise({
         redirectTo: '/propertyRegistration'
      });

});



Adminmngt.controller('Mainctrl', function ($scope,$window,propertyFactory,AdminDetails) {


  	   
	   propertyFactory.getAdminDetails()
		 .success(function (data){
	
			  AdminDetails.save(data);
			   })
		   .error(function(data) {
			  console.log("Error Configuring Your Details Refresh");
		   });


  
    $scope.Logout=function(){

    	propertyFactory.logout()
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

Adminmngt.controller('Usersctrl', function ($scope,userFactory) {

          userFactory.listUser()	
			.success(function (data){
					$scope.users=data;
				
			   })
		   .error(function(data) {
				  alert("errror ");
			   
		   });
  
 

	
 	});

Adminmngt.controller('propertyRegistrationctrl', function ($scope,propertyFactory) {
			
			propertyFactory.listProperty()	
			.success(function (data){
					 $scope.data=data;
			   })
		   .error(function(data) {
				  alert("errror ");
			   
		   });	

	});

	
Adminmngt.controller('Rolesctrl', function ($scope) {

});
Adminmngt.controller('TenantAdminctrl', function ($scope) {


	});
Adminmngt.controller('assignResponsibilityctrl', function ($scope,userFactory) {


    $scope.user={};
     $scope.det={};
     $scope.det.userRole={};

     $scope.roles = [
      {name:'Maker'},
      {name:'Checker'},
      {name:'Both'}
	
    ];

   $scope.resp = [
      {name:'Property Management',"id":1},
      {name:'Finance',"id":2},
      {name:'Sales',"id":3},
      {name:'Reporting',"id":4},
      {name:'Communication',"id":5}
    ];

    $scope.user.responsibility= $scope.resp[0];
    $scope.user.role= $scope.roles[0];

                    userFactory.listunassignedUser()	
						.success(function (data){
								$scope.employees=data;

								$scope.user.names=$scope.employees[0];
							
						   })
					   .error(function(data) {
							  alert("errror ");
						   
					   });
      $scope.assignUser=function(){
            if ($scope.user.responsibility.id==1){$scope.det.Homepage="/Property-Manager.html";$scope.det.userRole.id=1;$scope.det.userRole.role='propertyManager';}
            else if ($scope.user.responsibility.id==2){$scope.det.Homepage="/Finance-propertyManagement.html";$scope.det.userRole.id=1;$scope.det.userRole.role='financeManager';}
            else if ($scope.user.responsibility.id==3){$scope.det.Homepage="/Sales-propertyManagement.html";$scope.det.userRole.id=1;$scope.det.userRole.role='salesManager';}
            else if ($scope.user.responsibility.id==4){$scope.det.Homepage="/Report-propertyManagement.html";$scope.det.userRole.id=1;$scope.det.userRole.role='reportManager';}	
         	else if ($scope.user.responsibility.id==5){$scope.det.Homepage="/Communication-propertyManagement.html";$scope.det.userRole.id=1;$scope.det.userRole.role='communicationManager';}

 
               $scope.det.role=$scope.user.role;
               $scope.det.id=$scope.user.names.id;
               $scope.det.assignedStatus=1;

                    userFactory.editUser($scope.det)	
						.success(function (){
                             alert("Edit Ok");
							
						   })
					   .error(function(data) {
							  alert("errror ");
						   
					   });
        
        }

	});



Adminmngt.controller('addUserctrl', function ($scope,userFactory,AdminDetails) {

$scope.user={};

     $scope.createUser=function(){
     	 $scope.user.landlordid=AdminDetails.get()._id;
         $scope.user.datecreated=new Date().toISOString();
          $scope.user.createdby=$scope.user.landlordid;
         $scope.user._id=$scope.user.id;
         $scope.user.assignedStatus=0;    
         $scope.user.AccessStatus=1;
			userFactory.addUser($scope.user)	
			.success(function (data){
					alert("user oook");
				
			   })
		   .error(function(data) {
				  alert("errror ");
			   
		   });

     }


	});


Adminmngt.controller('addpropertyctrl', function ($scope,propertyFactory,AdminDetails) {
	$scope.property={};
	 $scope.type = [
      {name:'Land'},
      {name:'Apartments'},
      {name:'Office'},
	  {name:'Villas'},
	  {name:'Condos'},
      {name:'Loft'},
      {name:'Duplexes'}
    ];

   $scope.Rstatus = [
      {name:'Rent'},
      {name:'Sale'}
    ];

    $scope.property.status= $scope.Rstatus [0];
     $scope.property.type=$scope.type[0];


		$scope.addProperty=function(){

           $scope.property.landlordid=AdminDetails.get()._id;
    
			propertyFactory.addProperty($scope.property)	
			.success(function (data){
					alert("oook");
				
			   })
		   .error(function(data) {
				  alert("errror ");
			   
		   });
												
		}	


	});



Adminmngt.factory('propertyFactory', ['$http',function($http) {
	var url='/web/Property';
	var data = {

		
		    getAdminDetails:function () {
		     return $http.get(url + '/AdminDetails',{ cache: true });
            },

		  	addProperty:function (property) {
		     return $http.post(url + '/properytMaster',property);
            },
            editProperty:function (propertyDetails) {
		     return $http.put(url + '/properytMaster',propertyDetails);
            },
            delete:function (propertyid) {
		     return $http.delete(url + '/properytMaster/'+ propertyid);
            },
            listProperty:function () {
		     return $http.get(url + '/properytMaster',{ cache: true });
            },
             logout:function () {
		     return $http.get('/web/logout');
            }



	}
	return data;
}]);

Adminmngt.factory('userFactory', ['$http',function($http) {
	var url='/web/Property';
	var data = {

		
		 

		  	addUser:function (user) {
		     return $http.post(url + '/properytUser',user);
            },
            editUser:function (userDetails) {
		     return $http.put(url + '/properytUser',userDetails);
            },
            deleteUser:function (userid) {
		     return $http.delete(url + '/properytUser'+ userid);
            },
            listUser:function () {
		     return $http.get(url + '/properytUser',{ cache: true });
            },
            listunassignedUser:function () {
		     return $http.get(url + '/properytUnassignedUser',{ cache: true });
            }
           



	}
	return data;
}]);

 Adminmngt.service('AdminDetails', function () {

    var data={} ;
    this.save = function (userDetails) {
		   data=userDetails;

    }


    this.get = function () {  
         return data;
       }
    
  
});


//directives

Adminmngt.service('GoogleMapApi', ['$window', '$q', 
      function ( $window, $q ) {
        var deferred = $q.defer();
        function loadScript() {  
		
          var script = document.createElement('script');
            script.src = '//maps.googleapis.com/maps/api/js?v=3.6&libraries=places&sensor=false&key=AIzaSyBEZrkDl1LuGxjnnI4WXC7U5nx41NOmxy8&callback=initMap';
            document.body.appendChild(script);
        }

        // Script loaded callback, send resolve
        $window.initMap = function () {
            deferred.resolve();
        }
        loadScript();

        return deferred.promise;
    }]);


Adminmngt.directive('myMap', function(GoogleMapApi,$rootScope ) {
    // directive link function
    var link = function($scope, element, attrs) {
        var map, infoWindow,marker,autocomplete;
        var markers = [];
		       
	          //initialise map	
                function initMap() {
                    if (map === void 0) {
                        //Places Option
                         autocomplete = new google.maps.places.Autocomplete(
						  /** @type {HTMLInputElement} */(document.getElementById('autocomplete')),
						  {
							types: [],
							componentRestrictions: {}
						  });
					 

					  google.maps.event.addListener(autocomplete, 'place_changed', onPlaceChanged);

					  
					  // map Options
		                var mapOptions = {
							center: new google.maps.LatLng($scope.lat, $scope.lng),
							zoom: 10,
							mapTypeId: google.maps.MapTypeId.ROADMAP
						};
                     
						map = new google.maps.Map(element[0], mapOptions);
                         setMarker(map, new google.maps.LatLng($scope.lat, $scope.lng), $scope.locname, $scope.plotname);
                          google.maps.event.addListener(map, 'click', function(event) {
                                 setMarker(map,event.latLng,"testLoc","Test Cont");
                            });
                       }
		        	}

                 GoogleMapApi.then(function () {
                      initMap();
					 
                    }, function () {
                        console.log("promise Rejected map not initialised");
                    });

					function onPlaceChanged(){
						 var place = autocomplete.getPlace();
							  if (place.geometry) {
								map.panTo(place.geometry.location);
								map.setZoom(10);
								//do something later 

                                 $scope.$apply(function() {
										$rootScope.$broadcast('locationChange', place.geometry.location);
									});

							  } else {
								document.getElementById('autocomplete').placeholder = 'Enter a location';
							  }
					}

                  function setMarker(map, position, title, content) {
					var marker;
					var markerOptions = {
						position: position,
						map: map,
						title: title,
						icon: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
					};
                   function DeleteMarker(obj){
					   var i;
                             for (i in markers) {
									if (markers[i].position.lat() == obj.getPosition().lat()  && markers[i].position.lng()==obj.getPosition().lng() ) {	
										markers[i].setMap(null); 
										markers.splice(i, 1);
									}
								}
                       

	                 }
					marker = new google.maps.Marker(markerOptions);
					markers.push(marker); // add marker to array
					google.maps.event.addListener(marker, 'dblclick',function (event) {
                              //right click on marker to delete
							  DeleteMarker(this);
					});
					google.maps.event.addListener(marker, 'click', function () {
						// close window if not undefined
						if (infoWindow !== void 0) {
							infoWindow.close();
						}
						// create new window
						var infoWindowOptions = {
							content: content
						};
						infoWindow = new google.maps.InfoWindow(infoWindowOptions);
						infoWindow.open(map, marker);
					});
				}
                      
    };
    
    return {
        restrict: 'A',
        template: '<div id="gmaps"></div>',
        replace: true,
			scope: {
                lat: '@',     // latitude
                lng: '@',     // longitude
				locname:'@',
				plotname:'@'
            },
        link: link
    };
});


