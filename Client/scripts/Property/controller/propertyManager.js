'use strict';

var Managermngt= angular.module('propertyManager', ['ngRoute','textAngular','ngResource'] ); 

   	Managermngt.factory('authInterceptor', function ($rootScope, $q, $window) {
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

Managermngt.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});



Managermngt.config(function($routeProvider,$locationProvider)	{

$locationProvider.hashPrefix("!");

  $routeProvider
	 
 .when('/portfolio', {
     templateUrl: 'views/Property/manager/portfolio.html',   
      controller: 'portfolioctrl'
        })
  .when('/Land/:landid/:landname', {
     templateUrl: 'views/Property/manager/Land.html',   
      controller: 'landctrl'
        })
  .when('/Office/:officeid/:officename', {
     templateUrl: 'views/Property/manager/Office.html',   
      controller: 'officectrl'
        })
    .when('/Apartment/:details', {
     templateUrl: 'views/Property/manager/apartment.html',   
      controller: 'apartmentctrl'
        })
       .when('/propertyView', {
     templateUrl: 'views/Property/manager/propertyView.html',   
      controller: 'propertyViewctrl'
        })
    .when('/tenantMngt', {
     templateUrl: 'views/Property/manager/Tenantmngt.html',   
      controller: 'tenantMngtctrl'
        })
      .when('/gettenant/tenantid', {
     templateUrl: 'views/Property/manager/TenantDetails.html',   
      controller: 'tenantidctrl'
        })
  
    .when('/tenantAccess', {
     templateUrl: 'views/Property/manager/tenantaccess.html',   
      controller: 'tenantAccessctrl'
        })
    .when('/check-in', {
     templateUrl: 'views/Property/manager/checkin.html',   
      controller: 'checkinctrl'
        })
  
    .when('/check-out', {
     templateUrl: 'views/Property/manager/checkout.html',   
      controller: 'checkoutctrl'
        })
    .when('/tenantList', {
     templateUrl: 'views/Property/manager/tenantList.html',   
      controller: 'tenantListctrl'
        })
    
   .when('/Documentmngt', {
     templateUrl: 'views/Property/manager/Documentmngt.html',   
      controller: 'Documentmngtctrl'
        })
  .when('/Notice', {
     templateUrl: 'views/Property/manager/VacateNotice.html',   
      controller: 'Noticectrl'
        })

	.otherwise({
         redirectTo: '/portfolio'
      });

});



Managermngt.controller('Mainctrl', function ($scope,$window,managerFactory,ManagerDetails,Configuration) {


  	   
	   managerFactory.getAdminDetails()
		 .success(function (data){
	
			  ManagerDetails.save(data);


			   })
		   .error(function(data) {
			  console.log("Error Configuring Your Details Refresh");
		   });


		   managerFactory.getpropertyConfiguration()
            .success(function (data){
	
			  Configuration.save(data);
			   })
		   .error(function(data) {
			  console.log("Error Configuring Your Details Refresh");
		   });

  
    $scope.Logout=function(){

    	managerFactory.logout()
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



Managermngt.controller('propertyViewctrl', function ($scope,managerFactory,ManagerDetails) {

		   managerFactory.getPropertyList()
		 .success(function (data){
	
			  $scope.data=data;
               
			
			   })
		   .error(function(data) {
			  console.log("Error Configuring Your Details Refresh");
		   });

});	

Managermngt.controller('landctrl', function ($scope) {

});
Managermngt.controller('officectrl', function ($scope) {
	});
Managermngt.controller('Noticectrl', function ($scope) {
	});


Managermngt.controller('Documentmngtctrl', function ($scope,ManagerDetails) {
 
  $scope.documents=[{"name":"Tenant Agreement Doc","type":"TenantAgreement"},
	                {"name":"Water Agreement Doc","type":"WaterAgreement"}
	               ];
	$scope.doc={};
  $scope.showdoc=false;
   $scope.documenterror=false;
   $scope.documenterror=false;
  $scope.btndisabled=false;

	 $scope.selectdocType=function(docType) { 
		 $scope.doc.docType=docType.name;
	 };
  
 $scope.adddoc=function(){
	 if ($scope.doc.docType) { $scope.showdoc=true; }
	 else{alert("Choose a Document..");}
	 
 };
 $scope.clearEdit=function(){
   $scope.doctext="";
 }
 
 $scope.SaveDoc=function(pname){
	 
      $scope.btndisabled=true;
	  
	    var Details={
			         "plotName": pname,
			         "DocumentType":$scope.doc.docType,
			         "DocumentText":$scope.doctext,
			         "DocumentDate":new Date().toISOString()
		  }
                  $http.post('/web/Landlord/SaveDocument',Details )
				 		 .success(function(data) {
                                
                                $scope.documentSaved=true;
							 }) 
						 .error(function(data) {
								 
							    $scope.msg=data.error;
								 $scope.documenterror=true;
							 });	
   };
	 
 
});
Managermngt.controller('tenantListctrl', function ($scope,managerFactory) {
   managerFactory.listtenant()
   .success(function (data){$scope.tenantdata=data ;})
   .error(function(data) {});
});


Managermngt.controller('checkinctrl', function ($scope,ManagerDetails,managerFactory,$filter) {



  $scope.Tenant={};
$scope.House={};
$scope.House.property={};
$scope.housetaken=false;
$scope.housetakenerror=false;
 $scope.disableComponents=true;
$scope.showCustom=false;

 $scope.landlordplots=ManagerDetails.getProperties();
 $scope.Tenant.plot=$scope.landlordplots[0];


  $scope.TransactionPayment =[
	{"type":"RD","name":"Rent And Deposit"} ,
    {"type":"R","name":"Rent Only"} ,
    {"type":"C","name":"Custom"} 
  ];

  $scope.House.TransactionPayment=$scope.TransactionPayment[0];

$scope.update=function(type){
  if (type=="C"){ $scope.showCustom=true;}
  else {$scope.showCustom=false;}
};

$scope.GetDetails=function(){
 // have this in a nested Promise
      managerFactory.listofUnbookedtenant()
            .success(function (data){$scope.tenantdata=data ;$scope.Tenant.names=$scope.tenantdata[0];})
             .error(function(data) {});
     managerFactory. listofVacantunits()
            .success(function (data){
            	$scope.housedata=data ;
            	$scope.Tenant.unitid=$scope.housedata[0].property.Unitid;})
             .error(function(data) {});        

 
}


 $scope.Add=function(){
	  $scope.disableComponents=false;

 };
 $scope.save=function(){
	
	 var bal;
	 var desc;
	 var trxdate=$filter('date')(new Date(),'yyyy-MM-dd');
   if ($scope.House.TransactionPayment.type=="RD")
   {
	  bal =($scope.Tenant.unitid.property.amount * 2);
	  desc="Rent And Deposit";
   }
   else if ($scope.House.TransactionPayment.type=="R")
   {
	   bal =$scope.Tenant.unitid.property.amount;
	   desc="Rent Only";
   }
   else if ($scope.House.TransactionPayment.type=="C")
   {
	   bal =$scope.custom.amount;
	   desc=$scope.custom.description;
	  
   }

    var d = new Date();
    var today = $filter('date')(d,'yyyy-MM-dd');
    var Month = d.getMonth();







 var data={"update":{
		 "tenantupdate":{"AgreementStatus":true,"AccessStatus":0,"hsestatus":1,"housename":$scope.Tenant.unitid.property.Unitid,"balance":bal},
		 "houseUpdate":{"occupationStatus":"rented","tenantid":$scope.Tenant.names._id,"dateOccupied":today},
         "Trxn":{"tenantid":$scope.Tenant.names._id, "housenumber":$scope.Tenant.unitid.property.Unitid,
	             "propertyname":$scope.Tenant.names.propertyname,"transactiondate":trxdate,
	              "transactiontype":"Check In Posting", "Description":desc,"currentBal":bal,"Month":Month,
	              "tranAmount":bal,"landlordid":ManagerDetails.get()._id,"balcf":bal,"Charges":null},
		    "details":{"_id":$scope.Tenant.names._id,"number":$scope.Tenant.unitid.property.Unitid}
               }
		  };

  managerFactory.checkin(data)
	.success(function(data){
	  
      $scope.housetaken=true;
      console.log('Success ','House Occupied Successfully ..');
       
  })
	.error(function(data) {
	  
		$scope.housetakenerror=true;
		$scope.msg=data.error;
		console.log('Error','Ooops Error Occurred ..');
	 });
	  
   $scope.disableComponents=true;


 }
  





});
Managermngt.controller('checkoutctrl', function ($scope,managerFactory,$filter) {
   



                         managerFactory.listofOccupiedtenant()
                             .success(function(data) {
                            
							       $scope.tenantdata=data;
									$scope.crit=$scope.tenantdata[0];
							 }) 
						 .error(function(data) {

							  $scope.Acesserror=true;
							 });
	$scope.Update=function(){
      var d = new Date();
    var today = $filter('date')(d,'yyyy-MM-dd');
           
	var data={"update":{
		 "tenantupdate":{"hsestatus":0,"housename":$scope.crit.housename},
		 "houseUpdate":{"dateVacated":today,"tenantid":$scope.crit._id},
		 "details":{"_id":$scope.crit._id,"number":$scope.crit.housename}
               }
		  };


      managerFactory.vacateUnit(data)
	.success(function(data){
		  
      $scope.vacateupdate=true;
	   console.log('Success ','Vacation Success ..');
       
  })
	.error(function(data) {
	  
		$scope.vacateerror=true;
		$scope.msg=data.error;
		console.log('Error ','Ooops An Error Occured ..');
	 });
	 
	  $scope.disableComponents=true;


	}

});

Managermngt.controller('tenantAccessctrl', function ($scope,managerFactory) {

	

                         managerFactory.TenantAccessRequest()
                             .success(function(data) {
                             	console.log(data);
							  $scope.users=data;
							 }) 
						 .error(function(data) {

							  $scope.Acesserror=true;
							 });


	$scope.GrantAccess=function(user,index){
		 
	 managerFactory.GrantAccess(user)
						 .success(function(data) {
							   $scope.AccessGranted=true; 
							   $scope.users.splice(index, 1);
							 }) 
						 .error(function(data) {

							  $scope.Acesserror=true;
							 });
      };

});



Managermngt.controller('tenantMngtctrl', function ($scope,ManagerDetails,managerFactory) {
	

	$scope.properties=ManagerDetails.getProperties();
	$scope.propertyname=$scope.properties[0];
	 $scope.Tenant={};
	$scope.saveTenant=function(){

		
				  
				   $scope.Tenant.propertyname =$scope.propertyname.name;
				   $scope.Tenant.AccessStatus=0;
				   $scope.Tenant.hsestatus=0;
				   $scope.Tenant.role="tenant";
				   $scope.Tenant.AgreementStatus=false;
				   $scope.Tenant.datecreated=new Date().toISOString();
				    $scope.Tenant.createdby=ManagerDetails.get()._id;
				   $scope.Tenant.tid=$scope.Tenant._id;
				   $scope.Tenant.Homepage="/Tenant.html";
				  
 //change this later
            $scope.Tenant.password= $scope.Tenant._id;
            $scope.Tenant.id= $scope.Tenant._id;

				    managerFactory.createTenant($scope.Tenant)
						 .success(function(data) {
							alert("oookkk");
								
							 }) 
						 .error(function(data) {
							alert("nooooo");	
							 });	


	};


	$scope.CheckidExists=function(id){

           managerFactory.checkTenant(id)
				 		 .success(function(data) {
			                  if (data.exist)
			                     { $scope.userExist=true;
							       $scope.showloading=false;
                                      $scope.tdata=data.data;
							          $scope.disableComponents=true;
							      }
							   else{ $scope.userExist=false; 
								      $scope.disableComponents=false;
							   }
							  $scope.showloading=false;
							 }) 
						 .error(function(data) {
							   $scope.ErrorStatus=true;
							   $scope.showloading=false;
								notificationService.showAlert('Error ','Ooops an error Occurred Retry Later');	
			});
};


$scope.CheckPhonenumberExists=function(){
$scope.showloading=true;
          managerFactory.checkTenantContact("+254"+$scope.Tenant.contact)
				 		 .success(function(data) {
			                  if (data.exist)
			                     { $scope.contactExist=true;
							        $scope.showloading=false;
                                      $scope.tdata=data.data;
							        $scope.disableComponents=true;
			
							      }
							   else{ $scope.contactExist=false; 
								      $scope.disableComponents=false;
                                      $scope.showloading=false;
							   }
							   $scope.ContactSpinner=false;
							 }) 
						 .error(function(data) {
							   $scope.ErrorStatus=true;
							    $scope.ContactSpinner=false;
								notificationService.showAlert('Error ','Ooops an error Occurred Retry Later');	
			});
};




});
Managermngt.controller('tenantidctrl', function ($scope) {

});




Managermngt.controller('apartmentctrl', function ($scope,$route,Configuration,managerFactory,ManagerDetails) {
	$scope.apartment={};
    $scope.House={};
    $scope.unit={};
  $scope.propertydetails=angular.fromJson(atob($route.current.params.details));


	$scope.apartment.name=$scope.propertydetails.name;


	$scope.hsetype=Configuration.get().hsetype;
	$scope.House.type=$scope.hsetype[0];




     $scope.CheckHseNoExists=function(){     
                         
			 }

   $scope.saveUnit=function(){
          $scope.unit.Owner={};
          $scope.unit.property={};
				$scope.unit.Owner.landlordid=$scope.propertydetails.landlordid;
				$scope.unit.Owner.name=$scope.propertydetails.contact.name;
				$scope.unit.Owner.phone=$scope.propertydetails.contact.phone;

                $scope.unit.createBy=ManagerDetails.get()._id;
                $scope.unit.datecreated=new Date().toISOString();

				$scope.unit.property.name=$scope.apartment.name;
                $scope.unit.property.amount=$scope.House.amount;
                $scope.unit.property.currency=$scope.House.currency;
                $scope.unit.property.description =$scope.House.description;
                $scope.unit.property.type=$scope.propertydetails.type.name;
                $scope.unit.property.status=$scope.propertydetails.status.name;
                $scope.unit.property.propertyMasterid=$scope.propertydetails.id;
                $scope.unit.occupationStatus="vacant";

                $scope.unit.property.UnitType=$scope.House.type;
                $scope.unit.property.Unitid=$scope.House.number;

           //     $scope.unit.property.loc=[];
           //     $scope.unit.property.address=[];


                      managerFactory.createunit($scope.unit)				  
						 .success(function(data) {                           
								//    notificationService.showAlert('Success ','Data Saved ..');
					
					console.log("ook");

							 }) 
						 .error(function(data) {
							//  notificationService.showAlert('Error ',data.error);
							console.log("Errorss");
							 });	
          }
                     
	 


});
Managermngt.controller('portfolioctrl', function ($scope,managerFactory,$location,ManagerDetails) {
             
	   managerFactory.listportfolio()
		 .success(function (data){
	
			  $scope.data=data;
			 
			   ManagerDetails.saveProperties(data);
			   })
		   .error(function(data) {
			  console.log("Error Configuring Your Details Refresh");
		   });

     $scope.addunits=function(portfolio){

     console.log(portfolio);
     	var det = angular.toJson(portfolio);
           det=btoa(det);

     	if (portfolio.type.name==="Land"){

     		$location.path('/Land/'+portfolio._id+'/'+portfolio.name);
     	}
     	else if (portfolio.type.name==="Office"){
     		$location.path('/office/'+portfolio._id+'/'+portfolio.name);

     	}
     	else{

     		$location.path('/Apartment/'+det);
     }	

     }




	});







Managermngt.factory('managerFactory', ['$http',function($http) {
	var url='/web/Property';
	var data = {
              
		
		 
            getAdminDetails:function () {
		     return $http.get(url + '/AdminDetails',{ cache: true });
            },
            getPropertyList:function () {
		     return $http.get(url + '/PropertyList',{ cache: true });
            },
            TenantAccessRequest:function () {
		     return $http.get(url + '/TenantAccessRequest',{ cache: true });
            },
		  	listportfolio:function (user) {
		     return $http.get(url + '/propertyPortfolio',{ cache: true });
            },
            createunit:function (unitDetails) {
		     return $http.post(url + '/createunit',unitDetails);
            }
            ,checkin:function (unitDetails) {
		     return $http.post(url + '/checkin',unitDetails);
            },
            vacateUnit:function (vacateUnit) {
		     return $http.post(url + '/vacateUnit',vacateUnit);
            },
		  	listofUnbookedtenant:function () {
		     return $http.get(url + '/listofUnbookedtenant');
            },
            listofVacantunits:function () {
		     return $http.get(url + '/VacanthouseList');
            },
            listofOccupiedtenant:function () {
		     return $http.get(url + '/OccupiedTenantList',{ cache: true });
            },
             listtenant:function () {
		     return $http.get(url + '/listtenant',{ cache: true });
            },

            
            
            
              logout:function () {
		     return $http.get('/web/logout');
            },

            
            GrantAccess:function (tenantDetails) {
		     return $http.post(url + '/GrantTenantAccess',tenantDetails);
            },

             createTenant:function (tenantDetails) {
		     return $http.post(url + '/CreateTenant',tenantDetails);
            },

           
            getpropertyConfiguration: function() {
			return $http.get(url+'/configurations',{ cache: true })
			
		},
           



	}
	return data;
}]);

 Managermngt.service('ManagerDetails', function () {

    var data={} ;
    var properties=[] ;
    this.save = function (userDetails) {
		   data=userDetails;

    }


    this.get = function () {  
         return data;
       }

       this.saveProperties = function (prop) {
		   properties=prop;

    }


    this.getProperties = function () {  
         return properties;
       }
    
  
});

  Managermngt.service('Configuration', function () {

    var data={} ;
    this.save = function (config) {
		   data=config;

    }


    this.get = function () {  
         return data;
       }
    
  
});






