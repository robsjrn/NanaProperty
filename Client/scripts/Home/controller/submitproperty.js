
'use strict';

var propertymngtApp= angular.module('propertymngtApp', [] ); 


 propertymngtApp.controller('submitProperty', function ($scope,PropertyFactory,FileReader) {
  $scope.property={};
       $scope.property.loc=[];
  $scope.loading=false;
  $scope.btndis=true;
  $scope.property.location={};
  $scope.shownotification=false;

$scope.files = [];

  $scope.$on("fileSelected", function (event, args) {
    $scope.$apply(function () {            
        $scope.files.push(args.file);
		   FileReader.readAsDataUrl(args.file, $scope)
                      .then(function(result) {
                          $scope.imageSrc = result;
						  $scope.btndis=false;
                      });
         });
});


  $scope.$on('locationChange', function(evt, position) {
     $scope.property.location.latitude=position.lat();
     $scope.property.location.longitude=position.lng(); 
    });


      $scope.getAddress = function () {
			   $scope.showloading=true;
  	           if (navigator.geolocation) {
						navigator.geolocation.getCurrentPosition(function(position){
					            var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
								 var geocoder = new google.maps.Geocoder();
									geocoder.geocode({'latLng': latlng}, function(results, status)
											{ if (status == google.maps.GeocoderStatus.OK)
												 {if (results[1])
													 {      $scope.property.address=results[1].formatted_address;
														    $scope.property.location.latitude=position.coords.latitude;
											                $scope.property.location.longitude=position.coords.longitude;
                                                           

													
														}
														else {		}
											  } else
												   {
													  
													}
										     });					            
				                       });
			            }
				  else {

					   $scope.lat="-1.2920658999999999";
	                   $scope.lng="36.8219462";
                 													 
                      }
		        };




  $scope.saveInformation=function(){
	  $scope.loading=true;
	  	 $scope.property.title=$scope.property.type;
	     $scope.property.listing=true;
		 $scope.property.instatus=="On " + $scope.property.status;
		 $scope.property.tag="for " + $scope.property.status;
		 $scope.property.listing_page="home-page";
		 $scope.property.assetimg="/images/assets/"+$scope.property.type+".png"
         $scope.property.loc.push($scope.property.location.longitude);
		 $scope.property.loc.push($scope.property.location.latitude);
        

       PropertyFactory.addProperty($scope.property,$scope.myFile)
		  .success(function(data) { 
			$scope.loading=false;
			$scope.msg="Hi " + $scope.property.owner.names+ " Your Property Has been Updated ...";
			$scope.shownotification=true;
			$scope.property="";
			console.log($scope.msg);
			
                                   }) 
		  .error(function(data) {
             $scope.loading=false;
			 $scope.property="";
			 $scope.msg="Hi an Error Occurred Property Not Uploaded ..";
			// $scope.shownotification=true;
			 console.log($scope.msg);
								   });



	  
  }


       $scope.closeNotification=function(){
               
      }


	
  });


  

propertymngtApp.service('GoogleMapApi', ['$window', '$q', 
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

propertymngtApp.factory('PropertyFactory', ['$http', function($http) {
	var url='/web/Property';
     var data = {
		  addProperty: function(details,picfile) {
			 var fd = new FormData();
				fd.append('file', picfile);
				fd.append("property", JSON.stringify(details));
				return $http.post('/web/Property/property', fd, {
					transformRequest: angular.identity,
					headers: {'Content-Type': undefined}
				})



			 
		 }
	     }
return data;
}]);



propertymngtApp.factory('FileReader', function($q, $window) {

   if (!$window.FileReader) {
      throw new Error('Browser does not support FileReader');
    }

  var onLoad = function(reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result);
                });
            };
        };
 
        var onError = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
        };
 
        var onProgress = function(reader, scope) {
            return function (event) {
                scope.$broadcast("fileProgress",
                    {
                        total: event.total,
                        loaded: event.loaded
                    });
            };
        };
 
        var getReader = function(deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            reader.onprogress = onProgress(reader, scope);
            return reader;
        };
 
        var readAsDataURL = function (file, scope) {
            var deferred = $q.defer();
             
            var reader = getReader(deferred, scope);         
            reader.readAsDataURL(file);
             
            return deferred.promise;
        };
 
        return {
            readAsDataUrl: readAsDataURL  
        };
    
 

	});

propertymngtApp.directive('myMap', function(GoogleMapApi,$rootScope ) {
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




propertymngtApp.directive('fileModel', ['$parse', function ($parse,$scope) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
				scope.$emit("fileSelected", { file: element[0].files[0] });
                scope.$apply(function(){
					
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);


                               