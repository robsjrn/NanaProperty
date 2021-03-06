 
'use strict';

var landlordtmngt= angular.module('LandlordmngtApp', ['ngResource','ngRoute','angularFileUpload','textAngular','ngMaterial'] ); 

	landlordtmngt.factory('authInterceptor', function ($rootScope, $q, $window) {
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


landlordtmngt.run(['$rootScope', '$location','authService',
    function ($rootScope, $location,authService) {    
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
           /*
              if(!authService.isUrlAccessibleForUser(next.originalPath))
                 $location.path('/authError');   
				 
				 */
        });

}]);

landlordtmngt.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
    });

var ModalInstanceCtrl = function ($scope, $modalInstance, lat, lng,$timeout) {
   $scope.render=true;


  $scope.lat=lat;
  $scope.lng=lng;
 $scope.locationname="kasarani";
$scope.plotnames="plot kasarani";

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };   
  


};

landlordtmngt.controller('MainLandlordctrl', function($scope,$http,$window,LandlordFactory,$rootScope,notificationFactory) {
      
   
	   
	   
	   LandlordFactory.getLordDetails()
		 .success(function (data){
			  $rootScope.landlordDetails=data
				$scope.menu=$rootScope.landlordDetails.allowedPath;
			 // MasterDetails.save($rootScope.landlordDetails);
			if (typeof data.plots!="undefined")
			   {
				$rootScope.plot=data.plots;	
		  	   } else{
				   $rootScope.plot=[];
				   }	
			   })
		   .error(function(data) {
			  notificationFactory.error("Error Configuring Your Details Refresh");
		   });
		   
         
      $scope.config=LandlordFactory.getLandLordConfiguration()
		  .success(function (data){
		      $rootScope.expenseType=data.expenseType;
              $rootScope.paymentMethod=data.paymentmethod;
	          $rootScope.TransactionType=data.transactiontype;
	          $rootScope.hsetype=data.hsetype;
			  })
		   .error(function(data) {
		     notificationFactory.error("Error Configuring Your Details Refresh");
		   });
	 


	 $scope.firsttimelogin=true;
	 $scope.Logout=function(){
            $http.get('/web/logout')
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



landlordtmngt.controller('Messagesctrl', function($scope,$http,$window,smsmessages) {
   $scope.messageType=[{"type":1,"name":"Sent"},{"type":2,"name":"Un-Sent"}];
   
   $scope.message=false; 
   $scope.calls=false; 
   $scope.usage=false; 

$scope.messages=smsmessages.data.smsMessages;
$scope.Selecttype=function(name){
    if (name==="calls") { 
	   $scope.message=false; 
	   $scope.calls=true; 
	   $scope.usage=false; 
		}
	else if (name==="usage"){
		 $scope.message=false; 
         $scope.calls=false; 
         $scope.usage=true; 
		}
	else {
		 $scope.message=true; 
         $scope.calls=false; 
         $scope.usage=false; 
		 
        $scope.isInbound = function(sms) {
              return sms.direction === "inbound";
         };
        $scope.isOutbound = function(sms) {
              return sms.direction !== "inbound";
         };

		}
   }


});




landlordtmngt.controller('TenantTrxnctrl', function($scope,$window,tenant) {
	$scope.SearchType=[{id: 1, type: "tenantid", name: "Tenant Id"},
	               {id: 2, type: "housenumber", name: "House Name"},
	               {id: 3, type: "contact", name: "Tenant Telephone"}
             
];  

$scope.searchData=function(searchtype){
   if (typeof searchtype =="undefined") {
	    notificationFactory.error("Kindly Choose a Search Criteria..");
	   alert("Kindly Choose a Search Criteria..");

	    }
 else {

	
  var Datasearch ={}
      Datasearch.id=searchtype.id;
      Datasearch.detail=$scope.lookup;
      tenant.statement(Datasearch)
						 .success(function(data) {
		                    $scope.statement=data;
								
							 }) 
						 .error(function(data) {
							 
							 });
 }
}

 
});

landlordtmngt.controller('mapViewctrl', function($scope,$http,$window) {
	  

  $scope.lat=0.2280945;
  $scope.lng=34.81523390000007;
  $scope.locationname="Kahawa";
  $scope.plotnames="plot Kahawa";
 
});

landlordtmngt.controller('CreateUserctrl', function($scope,$rootScope,LandlordFactory) {
	 $scope.Newuser={};
     $scope.allowedPath=[];
     $scope.landlordplots=$rootScope.plot;
	 	   $scope.userCreated=false;
		   $scope.userCreatederror=false;
$scope.roles=[
	 {"id": 1, "role":"maker"},
     {"id": 2,"role":"admin"},
  ];
$scope.Newuser.userRole=$scope.roles[0];
 $scope.paths = [
    {"id": 1, "value":{"name":"plotmngt","path":"/plotmngt"},"text":"Add Plot"},
    {"id": 2, "value":{"name":"housemngt","path":"/housemngt"},"text":"Add House"},
	{"id": 3, "value":{"name":"housemngt","path":"/vacate"},"text":"Do Check-Out"},
	{"id": 4, "value":{"name":"housemngt","path":"/trxnmngt"},"text":"Add Transactions"},
	{"id": 5, "value":{"name":"housemngt","path":"/housemngt"},"text":"Post Rent"},
	{"id": 6, "value":{"name":"housemngt","path":"/housemngt"},"text":"Add Documents"},
	{"id": 7, "value":{"name":"housemngt","path":"/housemngt"},"text":"Add Notice"},
	{"id": 8, "value":{"name":"housemngt","path":"/housemngt"},"text":"Add Charges"},
	{"id": 9, "value":{"name":"housemngt","path":"/housemngt"},"text":"View Tenant Stmts"},
    {"id": 10,"value":{ "name":"housemngt","path":"/rent"},"text":"Check-in"},
	{"id": 11, "value":{"name":"housemngt","path":"/housemngt"},"text":"Compose Message"},
	{"id": 12, "value":{"name":"housemngt","path":"/housemngt"},"text":"View Message"},
	{"id": 13, "value":{"name":"housemngt","path":"/tenantsmngt"},"text":"Add Tenants"},
  
  ];

  $scope.updateSelection=function($event,value){
	var checkbox = $event.target;
    var action = (checkbox.checked ? 'add' : 'remove');

   if (action === 'add') {
    $scope.allowedPath.push(value);
  }
  if (action === 'remove' ) {
    $scope.allowedPath.splice(value, 1);
  }

  };

            $scope.createuser=function(){
                  if ($scope.allowedPath.length==0)
                  {
                    alert("You have to select atleast one Access"); 
                  }else{
					  
                    $scope.Newuser.Landlordid=$rootScope.landlordDetails._id;
                    $scope.Newuser.id=$scope.Newuser.id;
					$scope.Newuser._id=$scope.Newuser.id;
                    $scope.Newuser.parentLandlordid= $rootScope.landlordDetails._id;  
					$scope.Newuser.role=$rootScope.landlordDetails.role;
                     $scope.Newuser.allowedPath= $scope.allowedPath;
					 $scope.Newuser.AccessStatus =1;
                           LandlordFactory.createUser($scope.Newuser)
					         .success(function(data) {
					      		   $scope.userCreated=true;
								   $scope.userCreatederror=false;
							     }) 
						   .error(function(data) {
							     $scope.userCreated=false;
								 $scope.userCreatederror=true;
							 });
				  }
               };

 
});


landlordtmngt.controller('ComposeSmsctrl', function($scope,$http,$window,tenant,notificationFactory) {
	 $scope.sms={}; 
	  $scope.SuccessStatus=false;
	   $scope.ErrorStatus=false;
	     $scope.btnmsg=true;

   tenant.list()
	.success(function (data)
	{ 
    
	$scope.MailTo=data
		//add "all" to the Array
	$scope.MailTo.splice(0, 0, {"_id":0,"names":"All","contact":0});	
    $scope.sms.to=$scope.MailTo[0];
	}
	);
$scope.add=function(){
  $scope.btnmsg=false;
};


	$scope.SendSms=function(sms){
		
		notificationFactory.inprogress("Sending Sms..");
      var det={"phonenumber":sms.to.contact,"message":sms.msg};
          tenant.SendSms(det)
             .success(function (data){
			   $scope.SuccessStatus=true;
			   $scope.btnmsg=true
				   notificationFactory.success("Sms Sent");
			   
			   })
		   .error(function(data) {
               $scope.ErrorStatus=true;
			   $scope.btnmsg=false;
			   
			    notificationFactory.error("Error Sending Sms");
		   });

      
	};

 
});



landlordtmngt.controller('PaymentSummaryDatectrl', function($scope,$http,$window,TrxnService) {
  var d = new Date();
	var month = new Array();
	month[0] = "January";
	month[1] = "February";
	month[2] = "March";
	month[3] = "April";
	month[4] = "May";
	month[5] = "June";
	month[6] = "July";
	month[7] = "August";
	month[8] = "September";
	month[9] = "October";
	month[10] = "November";
	month[11] = "December";
	var n = month[d.getMonth()];
   
   $scope.month=n;

      TrxnService.getpaymentSummary()
			.success(function (data){
					$scope.data=data.total;
				   //  $scope.notice=$scope.noticelist[0];
				
			   })
		   .error(function(data) {
			   
		   });


});



landlordtmngt.controller('HomeLandlordctrl', function($scope,$http,$rootScope,$window,Email,Totals) {
   $scope.emails = {};
        $scope.UserMail=Email.data; 
		$scope.emails.messages=$scope.UserMail.Received;
      if (typeof Totals.data.total!=="undefined" && Totals.data.total.length > 0)
			   {$scope.Total=Totals.data.total[0].total;	
		  	   } else{$scope.Total=0;}	

     ;

});



landlordtmngt.controller('transactionVerificationctrl', function($scope,$http,$rootScope,unverifiedTransactions) {
  console.log(unverifiedTransactions.data);
  $scope.data=unverifiedTransactions.data;



});

landlordtmngt.controller('Noticectrl', function($scope,$rootScope,$http,LandlordFactory) {
       $scope.noticeSent=false;
		$scope.noticeSentError=false;
		$scope.btndisable=false;
$scope.noticelist=[];

        LandlordFactory.GetLandlordNotice()	
			.success(function (data){
					$scope.noticelist=data;
				   //  $scope.notice=$scope.noticelist[0];
				
			   })
		   .error(function(data,status) {
				  console.log("the Status is "+status);
			   
		   });

 $scope.selectnotice=function(not){
	 $scope.noticeSent=false;
	 $scope.noticeSentError=false;
      $scope.notice=not;
 };

  $scope.updateNotificationStatus=function(index){
     
$scope.btndisable=true;
	  
		    var dt={"tenantid":$scope.notice.Tenantid};
          $http.post('/web/Landlord/LandlordNoticeUpdate',dt)
				 		 .success(function(data) {
			                    $scope.btndisable=false;
			                    $scope.noticeSent=true;
								$scope.noticelist.splice(index, 1);
								$scope.notice="";
									
							 }) 
						 .error(function(data) {
								    $scope.btndisable=false;
								 	$scope.noticeSentError=true;
										
							   
			});
 };
   

});


landlordtmngt.controller('editTenantCtrl', function modalController ($scope, $modalInstance, Tenant) {
    $scope.Tenant = Tenant;
    $scope.ok = function () {
        $modalInstance().close($scope.Tenant);
    };
    $scope.cancel = function () {
        $modalInstance().dismiss('cancel');
  
    };
});



landlordtmngt.controller('VacateNoticectrl', function($scope,$rootScope,$http,notificationFactory) {
      $scope.disableSearchHse=true;
	  $scope.disableTenantid=true;
  	 $scope.NoticeSent=false;
	 $scope.NoticeSentError=false;
	 $scope.btnSend=true;
      $scope.search={};
	  $scope.notice={};
   $scope.add=function(){
	     $scope.disableSearchHse=false;
	  $scope.disableTenantid=false;
	  $scope.btnSend=false;
   };

   $scope.SearchTenantid=function(){
	$scope.disableSearchHse=true;
    
         $http.post('/web/Landlord/tenantDataID',  $scope.search)
						 .success(function(data) {
							notificationFactory.success("Tenant Found.. "+data.names);	
							  $scope.disableTenantid=true;
							  $scope.search.housename=data.housename;
							  $scope.search.names=data.names;
							  
							 }) 
						 .error(function(data) {
							$scope.TenantNotFound=true;
							 
							 notificationFactory.error("Tenant Not Found.. ");
							 $scope.disableComponents=true;
							 });

}
$scope.SearchHouseid=function(){
	$scope.disableTenantid=true;
    
	                  $http.post('/web/Landlord/tenantDataHseName',  $scope.search)
						 .success(function(data) {
							 
								
								notificationFactory.success("House Found.. "+data.names);
							    $scope.disableSearchHse=true;
								$scope.search.tenantid=data._id;
								 $scope.search.names=data.names;
							 }) 
						 .error(function(data) {
							 
							 notificationFactory.error("House Not Found.. ");
							$scope.TenantNotFound=true;
							$scope.disableComponents=true;
							 });
}


  $scope.sendNotification=function(){
    if (typeof $scope.search.names!="undefined")
  { 
	 $scope.btnSend=true;
	  $scope.text="<br> To"+$scope.search.names+"<br><br>"+new Date().toISOString()+"<br>"+
		           "<br><strong>RE : Notice To Vacate</strong><br><br>Dear Tenant <p><br>"+
		           "<br>" +$scope.Noticetext +"</br>"+
		           "<p>This letter constitutes my Vacation notice as required by our rental agreement and the Landlord/Tenant Act</p>"+
		           "<br>Sincerely,"+
		           "<br>"+$rootScope.landlordDetails.names + "</br>";
    

	   $scope.notice.processed=0;
       $scope.notice.text=$scope.text;
       $scope.notice.tenantid=$scope.search.tenantid;
       $scope.notice.date=new Date().toISOString();
       $scope.notice.landlordid=$rootScope.landlordDetails._id;
       $scope.notice.hseno=$scope.search.housename;
       $scope.notice.contact=$scope.search.contact;
          $http.post('/web/Landlord/ServeEvictionNotice',$scope.notice )
						   .success(function(data) {
							   
							  $scope.NoticeSent=true;
	                            notificationFactory.success("Notice Sent..");
							 }) 
							.error(function(data) {
								 
								 $scope.btndisable=true;
								 	$scope.NoticeSentError=true;
									notificationFactory.error("Ooops Error Occurred..");
								});
  }
  else{
	  notificationFactory.error("Select a Tenant..");
	  alert("You have to Select a Tenant");
	  
  }
	 
  };


});




landlordtmngt.controller('tenantctrl', function($scope,$rootScope,tenantlist,notificationService,LandlordFactory) {
 $scope.tenantcreated=false;
 $scope.tenanterror=false;
 $scope.plots=$rootScope.plot;
 $scope.showSpinner=false;
 $scope.ContactSpinner=false;
 $scope.Tenant={};
  $scope.Tnt={};
  $scope.search={};
 $scope.Tnt.plot=$scope.plots[0];



 	$scope.SearchType=[{id: 1, type: "tenantid", name: "Tenant Id"},
	               {id: 2, type: "housenumber", name: "House Name"},
	               {id: 3, type: "contact", name: "Tenant Telephone"}
             
];  


 $scope.disableComponents=true;

$scope.CheckidExists=function(id){
 $scope.showloading=true;
           LandlordFactory.checkTenant(id)
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
          LandlordFactory.checkTenantContact("+254"+$scope.Tenant.contact)
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
  

       $scope.TenantLookup=function(lookup){
       
	       if (typeof $scope.search.searchType =="undefined") {
	             notificationService.showAlert('Error ','Kindly Choose a Search Criteria');	
	              }
           else {
                      LandlordFactory.tenantLookup($scope.search.searchType.id,lookup)
						 .success(function(data) {
		                    $scope.statement=data;
							  $scope.Ten=data.data;
							 }) 
						 .error(function(data) {
							 
							 });
                   }


	   };


	   $scope.UpdateTenant=function(){
		   $scope.updatingdata=true;
            LandlordFactory.tenantUpdate($scope.Ten)
				.success(function(data) {
				               $scope.updatingdata=false;
		                       notificationService.showAlert('Success ','Tenant Successfully Updated');	
							 }) 
						 .error(function(data) {
								 $scope.updatingdata=false;
							   notificationService.showAlert('Error ','Ooops an error Occurred Retry Later');	
							 });

	   };

	   $scope.getTenantsData=function(){
		   $scope.process=true;
                 LandlordFactory.tenantList()
					 	.success(function(data) {
				            $scope.process=false;
							$scope.tenantData=data;
							 }) 
						 .error(function(data) {
								 $scope.process=false;
							   notificationService.showAlert('Error ','Ooops an error Occurred Retry Later');	
							 });

	   };

	   $scope.removeTenant=function(tid){
            LandlordFactory.DeleteTenant(tid)
				 .success(function(data) {
				            $scope.process=false;
							$scope.msg=data.success;
							removeRec(tid);
							 notificationService.showAlert('Success ','Tenant Successfully Deleted');	
							 }) 
						 .error(function(data) {
								 $scope.process=false;
							      notificationService.showAlert('Error ','Ooops an error Occurred Retry Later');	
							 });
	   };
    
	   function removeRec(ttid){
					   var i;
                             for (i in $scope.tenantData) {
									if ($scope.tenantData[i]._id==ttid) {	
										$scope.tenantData.splice(i, 1);
									}
								}
	                 }



           $scope.addTenant=function(){
				    $scope.tenantcreated=false;
					$scope.tenanterror=false;
                    $scope.disableComponents=false;
					$scope.userExist=false; 
					$scope.contactExist=false;
	
		   };
                 $scope.clearTenant=function(){
				  $scope.userExist=false; 
				 
		   };

		   
            $scope.saveTenant=function(){
            
			       $scope.Tenant.plot={};
				   $scope.Tenant.Landlordid=$rootScope.landlordDetails._id;
				   $scope.Tenant.plot.Plotname =$scope.Tnt.plot.Plotname;
				   $scope.disableComponents=true;
				   $scope.Tenant.AccessStatus=0;
				   $scope.Tenant.hsestatus=0;
				   $scope.Tenant.role="tenant";
				   $scope.Tenant.AgreementStatus=false;
				   $scope.Tenant.datecreated=new Date().toISOString();
				   $scope.Tenant.tid=$scope.Tenant._id;
 //change this later
            $scope.Tenant.password= $scope.Tenant._id;

				    LandlordFactory.createTenant($scope.Tenant)
						 .success(function(data) {
							    $scope.tenantcreated=true;
								$scope.msg=data.success;
								 notificationService.showAlert('Success ','Tenant Successfully Created');	
							 }) 
						 .error(function(data) {
							 $scope.tenanterror=true;
							 $scope.msg=data.error;
							  notificationService.showAlert('Error ','Ooops an error Occurred Retry Later');	
							 });	

                     };

   
  
});

landlordtmngt.controller('housemngtEditctrl', function($scope,$rootScope,$http,notificationFactory) {
   $scope.hsetype=$rootScope.hsetype;
   $scope.house={};
   $scope.disableComponents=true;

       $scope.houseupdate=false;
	   $scope.houseupdateError=false;

      $scope.searchHse=function(){
		  
		  var data={"id":$scope.house.id}      
	             $http.post('/web/Landlord/hseLookup',data)
				 		 .success(function(data) {
			                  $scope.house=data;
							  $scope.disableComponents=false;
							   
							   $scope.housenotfound=false;

							 }) 
						 .error(function(data) {
							  
                              $scope.housenotfound=true
			            });
		   
       };

	   $scope.update=function(){
		   
		          $http.post('/web/Landlord/updateHsedetails',$scope.house)
				 		 .success(function(data) {
							    $scope.houseupdateError=false;
								$scope.houseupdate=true;
							  
							  notificationFactory.success("Details Saved Successfully");
							 }) 
						 .error(function(data) {
							 console.log(data);
							  
							  $scope.houseupdateError=true;
							   $scope.houseupdate=false;
							   notificationFactory.success("Ooops an Error Occurred");

			            });

       };

});
landlordtmngt.controller('housemngtctrl', function($scope,$rootScope,LandlordFactory,$mdToast,notificationService) {
   $scope.House={};
     $scope.housecreated=false;
	 $scope.houseterror=false;
	  $scope.disableComponents=true;
    $scope.House.status="vacant";
	$scope.plot=$rootScope.plot;
	$scope.hsetype=$rootScope.hsetype;
     $scope.addHouse=function(){
          $scope.disableComponents=false; 
			    $scope.House.plot=$scope.plot[0];
				$scope.House.type=$scope.hsetype[0];
				$scope.House.number="";
				$scope.House.amount="";
                $scope.House.description="";
				$scope.HsenoExist=false;
	 };
             $scope.CheckHseNoExists=function(){     
                           $scope.busy=true;
                          LandlordFactory.CheckHseNoExists($scope.House.number,$scope.House.plot.Plotname)
				 		 .success(function(data) {
			                  if (data.exist)
			                     { 
							        $scope.disableComponents=true;
									$scope.House.number="";
									notificationService.showAlert('Error ','House Number Exists');	
							      }
							   else{ $scope.HsenoExist=false; 
								      $scope.disableComponents=false;
							   }
							   $scope.busy=false;
							 }) 
						 .error(function(data) {
							   notificationService.showAlert('Error ','Ooops an error Occurred Retry Later');	
							    $scope.busy=false;
								$scope.House.number="";
			          });
			 }



         $scope.GethseDetails=function(hsenumber){ 
                           $scope.loadingdata=true;
                          LandlordFactory.CheckHseNoExists(hsenumber,$scope.House.plot.Plotname)
				 		    .success(function(data) {
			                      	$scope.Hse=data.data;
							        $scope.loadingdata=false;
							 }) 
						 .error(function(data) {
							   notificationService.showAlert('Error ','Ooops an error Occurred Retry Later');	
							    $scope.loadingdata=false;
								$scope.House.number="";
			          });

                    };

  $scope.removeData=function(hsename){
          
        $scope.process=true;
		  LandlordFactory.deleteHse(hsename)
			   .success(function(data) {
			                      	
							        
									$scope.msg=data;
									removeRec(hsename);
									notificationService.showAlert('Success','Record Deleted..');
									$scope.process=false;
							 }) 
						 .error(function(data) {
								 $scope.msg=data;
								 $scope.process=false;
							   notificationService.showAlert('Error ','Ooops an error Occurred Retry Later');	
							    
							
			          });

  };
          function removeRec(hsename){
					   var i;
                             for (i in $scope.hseData) {
									if ($scope.hseData[i].number==hsename) {	
										$scope.hseData.splice(i, 1);
									}
								}
	                 }


  $scope.getData=function(){

                       $scope.process=true;
                          LandlordFactory.getmyHouses()
				 		    .success(function(data) {
			                      	$scope.hseData=data
							        $scope.process=false;
							 }) 
						 .error(function(data) {
							   notificationService.showAlert('Error ','Ooops an error Occurred Retry Later');	
							    $scope.process=false;
								
			          });
	  
  };

  $scope.Updatehse=function(){
          LandlordFactory.updateHse ($scope.Hse)
			  .success(function(data) {
			  notificationService.showAlert('Success ','Data Updated ..');
			  	 }) 
			  .error(function(data) {
			      notificationService.showAlert('Error ',data.error);
              });
  };
     $scope.saveHouse=function(cc){
          $scope.disableComponents=true;
				 $scope.House.landlordid=$rootScope.landlordDetails._id;
				 $scope.House.loc=$scope.plot.loc;
                      LandlordFactory.createHouse($scope.House)				  
						 .success(function(data) {
								$scope.msg=data.success;

                               if (typeof $rootScope.landlordDetails.nohse=="undefined")
							   {$rootScope.landlordDetails.nohse=1; 
							   }
							   else{
								$rootScope.landlordDetails.nohse =$rootScope.landlordDetails.nohse + 1;
                                $rootScope.landlordDetails.expcMonthlyIncome=$rootScope.landlordDetails.expcMonthlyIncome+ $scope.House.amount;
								    notificationService.showAlert('Success ','Data Saved ..');
								   }

							 }) 
						 .error(function(data) {
							  notificationService.showAlert('Error ',data.error);
							 });	
                     
	 }
});



landlordtmngt.controller('plotmngtctrl', function($scope,$rootScope,$mdDialog,LandlordFactory,$mdToast,notificationService) {
	 $scope.LandlordPlot={};
	 $scope.LandlordPlot.location={};
	 $scope.saving=false;
     $scope.loc;

	 
	 
	$scope.disableComponents=true;
    $scope.showSpinner=false;


 	 $scope.type = [
      {name:'Rentals'},
      {name:'Apartments'},
	  {name:'Villas'},
	  {name:'Condos'},
      {name:'Loft'},
      {name:'Duplexes'}
    ];

   $scope.Rstatus = [
      {name:'Rent'},
      {name:'Sale'}
    ];

	 $scope.loc = [
									  {name:'Nairobi'},
									  {name:'Kahawa'},
									  {name:'Buru Buru'},
									  {name:'Kiambu'},
									  {name:'Kasarani'}
									];
								  $scope.LandlordPlot.location=$scope.loc[0];

   $scope.$on('locationChange', function(evt, position) {
     $scope.LandlordPlot.location.latitude=position.lat();
     $scope.LandlordPlot.location.longitude=position.lng(); 
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
													 {      $scope.LandlordPlot.address=results[1].formatted_address;
														    $scope.LandlordPlot.location.latitude=position.coords.latitude;
											                $scope.LandlordPlot.location.longitude=position.coords.longitude;
															 $scope.showloading=false;
														}
														else {	$scope.showloading=false;	}
											  } else
												   {
													  $scope.showloading=false;;
													}
										     });					            
				                       });
			            }
				  else {

					   $scope.lat="-1.2920658999999999";
	                   $scope.lng="36.8219462";
                       notificationService.showAlert('Error','Sorry We could not Get Your Position !!');														 
                      }
		        };



 
							 $scope.codeAddress = function () {
							   var geocoder = new google.maps.Geocoder();
								geocoder.geocode( { 'address': $scope.LandlordPlot.address}, function(results, status) {
								  if (status == google.maps.GeocoderStatus.OK) {
									$scope.LandlordPlot.location.longitude=results[0].geometry.location.lng();
									$scope.LandlordPlot.location.latitude=results[0].geometry.location.lat();
									 $scope.loc=results[0].geometry.location;
									
								  } else {
											notificationService.showAlert('Error','Sorry We could not Get Your Position !!');														 

								  }
								});
								return;
							  };

	



				


							function DialogController($scope, $mdDialog) {
							  $scope.hide = function() {
								$mdDialog.hide();
							  };
							  $scope.cancel = function() {
								$mdDialog.cancel();
							  };
							  $scope.answer = function(answer) {
								$mdDialog.hide(answer);
							  };
							}


							$scope.CheckplotExists=function(){ 		  
									  LandlordFactory.plotExist($scope.LandlordPlot.Plotname)
													 .success(function(data) {
														  if (data.exist)
															 { $scope.plotExist=true;
																$scope.disableComponents=true;
																$scope.LandlordPlot.Plotname="";
															  }
														   else{ $scope.plotExist=false; 
																  $scope.disableComponents=false;
														   }
														   $scope.showSpinner=false;
														 }) 
													 .error(function(data) {
														   $scope.ploterror=true;
															$scope.showSpinner=false;
										});

							            }

							
								   $scope.Addplot=function(){ 
									$scope.disableComponents=false;
									$scope.LandlordPlot.Plotname="";
									$scope.plotExist=false;
								   }
							   $scope.Saveplot=function(){ 
                                      // check to see if long,lat is paseed if not just get it from the guys current location

                                        if (typeof $scope.LandlordPlot.location.longitude=="undefined")
										   {
										   	           $scope.LandlordPlot.location.longitude =36.8219462;
                                                       $scope.LandlordPlot.location.latitude=-1.2920658999999999;                                            
										   }

								   $scope.saving=true;
								   $scope.LandlordPlot.loc=[];
                                   $scope.LandlordPlot.loc.push($scope.LandlordPlot.location.longitude);
								   $scope.LandlordPlot.loc.push($scope.LandlordPlot.location.latitude);
										     LandlordFactory.addPlot($scope.LandlordPlot)
													 .success(function(data) {
                                                          $scope.saving=false;
														   $scope.plotSuccess=true; 
														   if (typeof $rootScope.landlordDetails.noplots=="undefined")
														   {$rootScope.landlordDetails.noplots=1; }
														   else{$rootScope.landlordDetails.noplots =$rootScope.landlordDetails.noplots+ 1;}
															$rootScope.plot.push($scope.LandlordPlot);
															 $scope.disableComponents=true;
                                                             
                                                            notificationService.showAlert('Success','Data Saved ..');	

														 }) 
													 .error(function(data) {
                                                          $scope.saving=false;
														  $scope.ploterror=true;
														  notificationService.showAlert('Error','Oops an Error occurred');	
														 });
							}


                    $scope.GetplotDetails=function(prop){ 
						   if (typeof prop =="undefined") {
	                            notificationService.showAlert('Choice','Kindly Choose a Property');														 
	                            }
                           else {
                                LandlordFactory.getPlotDetails(prop.Plotname)
                                .success(function(data) {
                                         $scope.property=data;              
										}) 
								.error(function(data) {
                                         $scope.property=[];                
									});
						   }

					}
    
	            $scope.UpdateProperty=function(){ 
                          LandlordFactory.updateProperty($scope.property)
                                .success(function(data) {        
										}) 
								.error(function(data) {
                                                    
									});
				}


				$scope.Confirmdelete = function(ev,delprop) {
					var confirm = $mdDialog.confirm()
					  .title('Are you Sure you Want Delete the Property?')
					  .content('Click Ok if You Agree..')
					  .ariaLabel('Delete')
					  .ok('Ok')
					  .cancel('No ')
					  .targetEvent(ev);
					$mdDialog.show(confirm).then(function() {
					    delRecord(delprop);
					}, function() {
					  $scope.msg = 'You decided to keep the Record.';
					});
				  };

      function delRecord(rec){
         $scope.showdeleting=true;

		          
              LandlordFactory.deleteProperty(rec.Plotname)
                                .success(function(data) { 
				                    removeRec(rec.Plotname);
				                     $scope.msg =data.status;
				                     $scope.showdeleting=false;
										}) 
								.error(function(data) {
                                    $scope.msg =data.status;
				                    $scope.showdeleting=false;            
									});

	  }

	               function removeRec(pname){
					   var i;
                             for (i in $rootScope.plot) {
									if ($rootScope.plot[i].Plotname==pname) {	
										$rootScope.plot.splice(i, 1);
									}
								}
	                 }



							  
});

landlordtmngt.controller('trxntypectrl', function($scope,TrxnService,notificationService) {
	    $scope.url='Singletransaction';
		$scope.Receipt={};

		$scope.disableComponents=true;
	$scope.RcptNotFound=false;
	$scope.RcptDeleted=false;
	$scope.disableEdit=true;
   $scope.GetDetails =function(){    
          var data ={
                    "receiptno":$scope.Receipt.number
                     };
          
                       TrxnService.getTransaction(data)
					         .success(function(data) {
					            
					        if (data===""){  $scope.RcptNotFound=true;  notificationService.showAlert('Error ','Receipt Not Found ..');; }
							else {	
								$scope.Detail =data;
								$scope.RcptNotFound=false;
								$scope.disableEdit=false;
								}
							  
							 
							 }) 
						 .error(function(data) {
							  
							  $scope.RcptNotFound=true;
							  $scope.disableComponents=true;
							  $scope.Detail="";
							 });
   }

   $scope.Edit=function(){
       $scope.disableComponents=false;
   }
   $scope.delete=function(){
      $scope.disableComponents=false;

             var data ={
                    "receiptno":$scope.Receipt.number,
                     "tenantid":$scope.Detail.tenantid,
					 "Amount":$scope.Detail.tranAmount
                     };
           
            
                       TrxnService.DeleteReceipt(data)
					         .success(function(data) {
					      		  
								  $scope.disableComponents=true;
								  $scope.RcptDeleted=true;
							     }) 
						 .error(function(data) {
							       
							       $scope.disableComponents=true;
								   $scope.RcptDeleted=false;
							 });
    }
			
});



landlordtmngt.controller('trxnmngtctrl', function($scope,$http,$rootScope, $window,$filter,tenant,BatchTrxnService,TrxnService,notificationService) {
//first clear everything in the Batch Trxn Table

BatchTrxnService.Drop();

$scope.Transaction={};

$scope.Transaction.PostedDate=new Date();
$scope.Transaction.TransactionDate=new Date();
$scope.paymentmethod=$rootScope.paymentMethod;
$scope.Transaction.paymentmethod=$scope.paymentmethod[0];
$scope.transactiontype=$rootScope.TransactionType;
$scope.Transaction.transactiontype=$scope.transactiontype[0];
$scope.ApplyCharges=false;
$scope.paymentposted=false;
$scope.paymenterror=false;
$scope.btnPost=true;
$scope.disableComponents=true;
$scope.disableTotalAmount=true;
$scope.TenantNotFound=false;
      $scope.disableSearchHse=true;
	  $scope.disableTenantid=true;
	  $scope.ReceiptFound=false;
	  $scope.ShowCharges=false;
	
	   $scope.disablePosting=true;
$scope.crit={};
$scope.Tenant={};
$scope.BatchTotal={};

$scope.SearchType=[{id: 1, type: "_id", name: "Tenant Id"},
	               {id: 2, type: "housename", name: "House Name"},
	               {id: 3, type: "contact", name: "Tenant Telephone"},
                   {id: 4, type: "email", name: "Email Address"}
];

$scope.searchData=function(searchtype){
   if (typeof searchtype =="undefined") {
	    notificationService.showAlert('Error ',"Kindly Choose a Search Criteria..");
	 //  alert("Kindly Choose a Search Criteria..");

	    }
 else {

	
  var Datasearch ={}
      Datasearch.id=searchtype.id;
     Datasearch.detail=$scope.lookup;
    tenant.Search(Datasearch)
						 .success(function(data) {
							  $scope.Tenant=data
							  $scope.search.housename=$scope.Tenant.housename;
							  $scope.TenantNotFound=false;
								
							  $scope.disableTenantid=true;
							 }) 
						 .error(function(data) {
							$scope.Tenants=data
							$scope.TenantNotFound=true;
							 
							 $scope.disableComponents=true;
							 });
 }
}

  $scope.toggleMin = function() {
  //  $scope.maxDate = $scope.maxDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yyyy',
    startingDay: 1
  };

  
  $scope.format = 'yyyy-MM-dd';

 $scope.landlordplots=$rootScope.plot;
 try{
 $scope.Tenant.plot=$scope.landlordplots[0];
 }catch(e){
	 notificationService.showAlert('Error ',"You Have to Add a Plot First..");
	// alert("You Have to Add a Plot First..");

 }



$scope.CheckCharges=function(){

	$scope.Transaction.customCharge={};
   if (!$scope.ApplyCharges){ 
	   $scope.ShowCharges=true;
	   $scope.ApplyCharges=true;
   }
   else{$scope.ShowCharges=false;}
	
};
$scope.CustomPaymentCharges=function(){
	$scope.Charge={};
	$scope.CustomCharge=true;
	$scope.LateCharge=false;
	$scope.customDisable=false;
	$scope.Charge={};
	$scope.Charge.Amount="";
	$scope.Charge.comment="";
};

$scope.NoCharges=function(){
	$scope.Transaction.customCharge={};
	$scope.ShowCharges=false;
	$scope.ApplyCharges=false;
};

$scope.LatePaymentCharges=function(){

	$scope.Charge={};
	$scope.CustomCharge=false;
    $scope.LateCharge=true;
	$scope.customDisable=true;
	$scope.ApplyCharges=true;
	$scope.Charge.Amount=1000;
	$scope.Charge.comment="Late Payment Charge";
	$scope.Charge.transactiontype="Late Rent Payment"
};

$scope.Receipt=function(){
 

  var data ={
     "receiptno":$scope.Transaction.receiptno,
  }
      TrxnService.getTransaction(data)
						 .success(function(data) {							
								
								  if (data === ""){
									$scope.ReceiptFound=false;
									$scope.userForm.$invalid=false;
									 $scope.btnPost=false;
								  }
								  else{	
									   $scope.Transaction.receiptno="";
									    $scope.userForm.$invalid=true;						   
					                    $scope.Receiptdata=data;
										$scope.ReceiptFound=true;
										
										notificationService.showAlert('Error ','Receipt Already Exists');	
										  ;}
		  
							 }) 
						 .error(function(data) {
							 	
							 $scope.ReceiptFound=false;
							
							 });
};


$scope.EditAmount=function(){
  $scope.disableTotalAmount=false;
};


 $scope.AddPayment=function(){
		 addpayment();
 };

  function addpayment(){
	  $scope.Charge={};
	  $scope.btnPost=true;
	  $scope.disableComponents=false;
      $scope.disableSearchHse=false;
	  $scope.disableTenantid=false;
      $scope.paymentposted=false;
      $scope.ShowCharges=false;
	  $scope.ApplyCharges=false;
	     $scope.Transaction.amount="";
		 $scope.Transaction.comments="";
		 $scope.Transaction.receiptno="";
		  $scope.Tenant="";
		  $scope.search="";
		   $scope.lookup="";
          // $scope.Tenant.balance=0;
	  $scope.Transaction.amount =0;
	  $scope.Charge.Amount=0;

  };

 $scope.ClearPayment=function(){
	     $scope.Transaction.amount="";
		 $scope.Transaction.comments="";
		 $scope.Transaction.receiptno="";
		 $scope.Tenant="";
		 $scope.search="";
		 $scope.lookup="";
 };


$scope.InsertRec=function(){
  $scope.disableTotalAmount=true;
   if (typeof $scope.BatchTotal.Amount =="undefined") {
	   notificationService.showAlert('Error ',"Kindly Enter the Total Amount");
	  // alert("Kindly Enter the Total Amount");
	    }
else {	
	 if ( $scope.Edited)
	 {
		     $scope.delete($scope.EditValue);
		     $scope.Edited=false;

	 }

 $scope.disableComponents=true;
 var charges={};
 var d = new Date();
 var today = $filter('date')(d,'yyyy-MM-dd');
 var trandate=$scope.Transaction.TransactionDate;
 var Month = d.getMonth();

     if ($scope.ApplyCharges)
     {
		charges ={
			      "ApplyCharge":true,
                  "body":{
                  "receiptno":$scope.Transaction.receiptno,
				  "Landlordid":$rootScope.landlordDetails._id,
	              "tenantid":$scope.Tenant._id,
	              "housenumber":$scope.Tenant.housename,
	              "plotnumber":$scope.Tenant.plot.Plotname,
                  "names":$scope.Tenant.names,
                  "contact":$scope.Tenant.contact,
	              "PostedDate":today,
                  "transactiondate":trandate,
	              "transactiontype":$scope.Charge.transactiontype,
	              "paymentmethod":$scope.Transaction.paymentmethod.name,
	              "Description":$scope.Charge.comment,
	              "tranAmount":$scope.Charge.Amount,
				  "currentBal":$scope.Tenant.balance,
	              "balcf":$scope.Tenant.balance-$scope.Transaction.amount+$scope.Charge.Amount,
                  "Month":Month
				  }
		 };
     }
	 else{
		   charges={
			   "ApplyCharge":false
		  };
	 }

       $scope.Payment={	             
	              "receiptno":$scope.Transaction.receiptno,
                  "Landlordid":$rootScope.landlordDetails._id,
	              "tenantid":$scope.Tenant._id,
	              "housenumber":$scope.Tenant.housename,
	              "plotnumber":$scope.Tenant.plot.Plotname,
                  "names":$scope.Tenant.names,
                  "contact":$scope.Tenant.contact,
	              "PostedDate":today,
                  "transactiondate":trandate,
	              "transactiontype":$scope.Transaction.transactiontype.name,
	              "paymentmethod":$scope.Transaction.paymentmethod.name,
	              "Description":$scope.Transaction.comments,
	              "tranAmount":$scope.Transaction.amount,
                  "currentBal":$scope.Tenant.balance,
	              "balcf":$scope.Tenant.balance-$scope.Transaction.amount,
                  "Charges":charges,
                  "Month":Month
	 
        };
		    
	          
				
				  
				    $scope.BatchTotal.Amount =$scope.BatchTotal.Amount-$scope.Payment.tranAmount; 
				     if ($scope.BatchTotal.Amount == 0){ 
				     	BatchTrxnService.save($scope.Payment); 
					 $scope.disablePosting=false ;
					 }else {
					BatchTrxnService.save($scope.Payment);
				      } 

                    $scope.data=BatchTrxnService.list();
                    }  
};


    $scope.delete = function (id) {
        $scope.DelTenant=BatchTrxnService.delete(id); 
		$scope.BatchTotal.Amount=$scope.BatchTotal.Amount+$scope.DelTenant.tranAmount;
    };



	 $scope.edit = function (id) {
     $scope.Edited=true;
		  $scope.EditTenant ={};
        $scope.EditTenant = BatchTrxnService.get(id);
        $scope.Tenant.names=$scope.EditTenant.names;
		$scope.Tenant._id=$scope.EditTenant.tenantid;
        $scope.Tenant.housename=$scope.EditTenant.housenumber;
        $scope.Tenant.plot.Plotname=$scope.EditTenant.plotnumber;
		$scope.Tenant.housename=$scope.EditTenant.housenumber;
		$scope.Tenant.balance=$scope.EditTenant.currentBal;
		$scope.Transaction.receiptno=$scope.EditTenant.receiptno;
		$scope.Transaction.comments=$scope.EditTenant.Description;
		$scope.Transaction.amount=$scope.EditTenant.tranAmount;
		$scope.Transaction.transactiontype=$scope.EditTenant.transactiontype;
		$scope.Transaction.paymentmethod=$scope.EditTenant.paymentmethod;
		$scope.Transaction.transactiondate=$scope.EditTenant.transactiondate
		$scope.balcf=$scope.EditTenant.balcf;
	//	$scope.Charge.Amount=$scope.EditTenant.Charges.body.tranAmount;
		$scope.Transaction.PostedDate=$scope.EditTenant.PostedDate;
	//	$scope.Charge.comment=$scope.EditTenant.Charges.body.Description;
	    $scope.EditValue=$scope.EditTenant.traceid;
	 $scope.disableComponents=false;
    };


$scope.postBatchPayment=function(){
  
     if ($rootScope.landlordDetails.userRole.role==="maker")
   {$scope.path="/web/Landlord/makerBatchRentalPayment"}
   else {$scope.path="/web/Landlord/BatchRentalPayment"};
	 $scope.disablePosting=true;
	 $scope.BatchPayment=BatchTrxnService.list();
     
	// notificationFactory.inprogress("Posting Data..");
                  $http.post($scope.path, $scope.BatchPayment)
						 .success(function(data) {
							    $scope.paymentposted=true;
								$scope.msg=data.success;
																
								notificationService.showAlert('Success ',"Data Successfully Posted.");
							 }) 
						 .error(function(data) {
							 $scope.paymenterror=true;
							 $scope.msg=data.error;
							 
							 notificationService.showAlert('Error ',"Ooops Error Occurred..");
							 });
              }
$scope.postPayment=function(){


//notificationFactory.inprogress("Posting Data..");
 $scope.userForm.$invalid=true;
 $scope.disableComponents=true;
 var charges={};
 var d = new Date();
 var today = $filter('date')(d,'yyyy-MM-dd');
 var trandate=  $filter('date')($scope.Transaction.TransactionDate,'yyyy-MM-dd');
  var Month = d.getMonth();
     if ($scope.ApplyCharges)
     {
		charges ={
			      "ApplyCharge":true,
                  "body":{
                  "receiptno":$scope.Transaction.receiptno,
				  "Landlordid":$rootScope.landlordDetails._id,
	              "tenantid":$scope.Tenant._id,
	              "housenumber":$scope.Tenant.housename,
	              "plotnumber":$scope.Tenant.plot.Plotname,
                  "names":$scope.Tenant.names,
                  "contact":$scope.Tenant.contact,
	              "PostedDate":today,
                  "transactiondate":trandate,
	              "transactiontype":$scope.Charge.transactiontype,
	              "paymentmethod":$scope.Transaction.paymentmethod.name,
	              "Description":$scope.Charge.comment,
	              "tranAmount":$scope.Charge.Amount,
	              "balcf":$scope.Tenant.balance-$scope.Transaction.amount+$scope.Charge.Amount,
				   "Month":Month
				  }
		 };
     }
	 else{
		   charges={
			   "ApplyCharge":false
		  };
	 }

  $scope.Payment={
	              "receiptno":$scope.Transaction.receiptno,
				  "Landlordid":$rootScope.landlordDetails._id,
	              "tenantid":$scope.Tenant._id,
	              "housenumber":$scope.Tenant.housename,
	              "plotnumber":$scope.Tenant.plot.Plotname,
                  "names":$scope.Tenant.names,
                  "contact":$scope.Tenant.contact,
	              "PostedDate":today,
                  "transactiondate":trandate,
	              "transactiontype":$scope.Transaction.transactiontype.name,
	              "paymentmethod":$scope.Transaction.paymentmethod.name,
	              "Description":$scope.Transaction.comments,
	              "tranAmount":$scope.Transaction.amount,
	              "balcf":$scope.Tenant.balance-$scope.Transaction.amount,
                  "Charges":charges,
                  "Month":Month
	 
 };
        if ($rootScope.landlordDetails.userRole.role==="maker")
   {$scope.path="/web/Landlord/makerRentalPayment"}
   else {$scope.path="/web/Landlord/RentalPayment"};

                  $http.post($scope.path, $scope.Payment)
						 .success(function(data) {
							    $scope.paymentposted=true;
								$scope.msg=data.success;
								
								notificationService.showAlert('Success ',"Data Successfully Posted.");
							 }) 
						 .error(function(data) {
							 $scope.paymenterror=true;
							 $scope.msg=data.error;
							 
							 notificationService.showAlert('Error ',"oops Error Occurred.");
							 });

            }


});




landlordtmngt.controller('expensemngtctrl', function($scope,$http,$rootScope,tenant,$filter,notificationFactory) {

$scope.paymentposted=false;
$scope.paymenterror=false;
$scope.disableComponents=true;
$scope.Tenant={};
 $scope.landlordplots=$rootScope.plot;
 $scope.Tenant.plot=$scope.landlordplots[0];

$scope.SearchType=[{id: 1, type: "_id", name: "Tenant Id"},
	               {id: 2, type: "housename", name: "House Name"},
	               {id: 3, type: "contact", name: "Tenant Telephone"},
                   {id: 4, type: "email", name: "Email Address"}
];

$scope.searchData=function(searchtype){
   if (typeof searchtype =="undefined") {
	   alert("Kindly Choose a Search Criteria..");
	   notificationFactory.error("Kindly Choose a Search Criteria..");
	    }
 else {

	
  var Datasearch ={}
      Datasearch.id=searchtype.id;
      Datasearch.detail=$scope.lookup;
    tenant.Search(Datasearch)
						 .success(function(data) {
							  $scope.Tenant=data
							  $scope.search.housename=$scope.Tenant.housename;
							  $scope.TenantNotFound=false;
							  
							  $scope.disableTenantid=true;
							 }) 
						 .error(function(data) {
							$scope.Tenants=data
							$scope.TenantNotFound=true;
							 
							 $scope.disableComponents=true;
							 });
 }
}




 $scope.toggleMin = function() {
  //  $scope.maxDate = $scope.maxDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yyyy',
    startingDay: 1
  };

  
  $scope.format = 'yyyy-MM-dd';





$scope.Expense=[];
$scope.crit={};


$scope.expensetype=$rootScope.expenseType;

 $scope.Expense.type=$scope.expensetype[0];
 $scope.Expense.date=new Date();

$scope.AddExpense=function(){
	 $scope.disableComponents=false;

	    $scope.Expense.amount="";
		 $scope.Expense.description="";
		  $scope.Tenant.names="";
		$scope.Tenant.housename="";
	  $scope.Tenant.balance="";
 };

 $scope.ClearExpense=function(){
	     $scope.Expense.amount="";
		 $scope.Expense.description="";
		 $scope.Tenant.names="";
		$scope.Tenant.housename="";
	  $scope.Tenant.balance="";
	
 };
 

 $scope.PostExpense=function(){
 var d = new Date();
 var charges={ "ApplyCharge":false };
 var today = $filter('date')(d,'yyyy-MM-dd');
 var trandate=  $filter('date')($scope.Expense.date,'yyyy-MM-dd');
  var Month = d.getMonth();
 
  $scope.expense={
	              "receiptno":null,
	              "tenantid":$scope.Tenant._id,
                  "Landlordid":$rootScope.landlordDetails._id,
                  "names":$scope.crit.names,
                  "contact":$scope.Tenant.contact,
	              "housenumber":$scope.Tenant.housename,
	              "plotnumber":$scope.Tenant.plot.Plotname,
	              "transactiondate":trandate,
                  "PostedDate":trandate,
	              "transactiontype":"Expense",
                  "paymentmethod":$scope.Expense.type.name,
	              "Description":$scope.Expense.description,
	              "tranAmount":-$scope.Expense.amount,
	              "balcf": $scope.Expense.amount + $scope.Tenant.balance,
                  "Charges":charges, 
				  "Month":Month
	 
 };

     if ($rootScope.landlordDetails.userRole.role==="maker")
   {$scope.path="/web/Landlord/makerRentalPayment"}
   else {$scope.path="/web/Landlord/RentalPayment"};       

  $http.post($scope.path, $scope.expense)
						 .success(function(data) {
							    $scope.paymentposted=true;
								$scope.msg=data.success;
								
								notificationFactory.success("Expense Posted ..");
							 }) 
						 .error(function(data) {
							 $scope.paymenterror=true;
							 $scope.msg=data.error;
							 
							 notificationFactory.error("Oooops Error occurred ..");
							 });

$scope.disableComponents=true;

 };



  
});


landlordtmngt.controller('summarymngtctrl', function($scope) {

$scope.chartType = 'bar';
$scope.messages = [];
   $scope.data = {
		series: ['Expense', 'Income'],
		
data :[{"_id":"2014-11-10","total":65000},{"_id":"2014-11-11","total":75000},{"_id":"2014-11-12","total":65000},{"_id":"2014-11-13","total":25000}]
	}


$scope.config = {
		labels: false,
		title : "Amount",
		legend : {
			display: true,
			position:'right'
		},
		click : function(d) {
			$scope.messages.push('clicked!');
		}
	}



});


landlordtmngt.controller('documentmngtctrl', function($scope,$http,$rootScope) {
   $scope.landlordplots=$rootScope.plot;
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
	 if (typeof pname =="undefined") {
	   alert("Kindly Select a Plot..");
	 }
	 else{
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
	 
 }
});

landlordtmngt.controller('ReportsPortalctrl', function($scope,$http,$rootScope,$filter) {


  $scope.landlordplots=$rootScope.plot;
  $scope.showData=false;
  $scope.showError=false;
  $scope.ViewReport=false;
  $scope.ViewDownloadReport=false;
  $scope.disablebtn=true;


 $scope.toggleMin = function() {
  //  $scope.maxDate = $scope.maxDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yyyy',
    startingDay: 1
  };

  
  $scope.format = 'yyyy-MM-dd';
    $scope.selectReport=function(name){
	  $scope.pname=name;
	  $scope.disablebtn=false;
  };

			  $scope.clear = function () {
				$scope.fromdt = null;
				$scope.todt= null;
			  };

				


   $scope.ShowReport=function(){
	    
		  var fromdt=$filter('date')($scope.fromdt,'yyyy-MM-dd');
		   var todt=$filter('date')($scope.todt,'yyyy-MM-dd');
  $scope.reportData={"startdate" :fromdt,
	                  "enddate":todt,
	                   "plot":$scope.pname,
	                   "option":"view"
  };
               $http.post('/web/Reports/TransactionReport', $scope.reportData)
						 .success(function(data) {
				    
                       $scope.ViewReport=true;
					   $scope.ViewDownloadReport=false;
                         $scope.content=data.result;
					
								
							 }) 
						 .error(function(data) {

							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 
								  $scope.showData=false;
							 });
							   
	
   }



 $scope.DownloadReport=function(){
            


  $scope.reportData={"startdate" :$scope.fromdt,
	                  "enddate":$scope.todt,
	                  "plot":$scope.pname,
	                  "option":"download"
  };
               $http.post('/web/Reports/TransactionReport', $scope.reportData)
						 .success(function(data) {
				    
                      $scope.ViewReport=false;
		         	$scope.ViewDownloadReport=true;
					    $scope.file=data;
								
							 }) 
						 .error(function(data) {
							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 
								  $scope.showData=false;
							 });
        

	};




  
});

landlordtmngt.controller('Settingsctrl', function($scope,$rootScope,$http) {
//anything here should be cached...,{ cache: true }
$scope.TenantNotification={};
$scope.MonthlyPosting={};
$scope.Payment={};
$scope.Landlord={};

 $scope.plot=$rootScope.plot;
 $scope.Landlord.plot=$scope.plot[0];

$scope.MonthlyPosting=false;
$scope.latePaymentPosted=false;
$scope.NotificationPosted=false;
$scope.NotificationError=false;

$scope.btnNotification=true;
$scope.btnLatePayment=true;
$scope.btnPosting=true;


	 $scope.saveTnotifications=function(){

      var Notificationdata={
		   "Rundate" : $scope.TenantNotification.month,
		   "ProcessName" : "Daily Tenant balance Process",
		   "ProcessDetails" : {
			"plotname" : $scope.Landlord.plot.Plotname,
			"title" : "Scheduled Tenant Balance Notification for  "+$scope.Landlord.plot.Plotname,
			"month" : "Monthly"
		   }
		 }
      
                   $http.post('/web/Landlord/CreateNotification',Notificationdata )
				 		 .success(function(data) {
							
								   $scope.NotificationPosted=true;
								 						 
							 }) 
						 .error(function(data) {
								 
							   $scope.NotificationError=true;
							 });
   

     }
	 $scope.saveMPosting=function(){
       $scope.MonthlyPosting=true;


          var MonthlyPostingdata={
		   "Rundate" : $scope.MPosting.month,
		   "ProcessName" : "Monthly Posting Process",
		   "ProcessDetails" : {
			"plotname" : $scope.Landlord.plot.Plotname,
			"title" : "Scheduled Monthly Posting for "+$scope.Landlord.plot.Plotname,
			"month" : "Monthly"
		   }
		 }
      
                   $http.post('/web/Landlord/CreateNotification',MonthlyPostingdata )
				 		 .success(function(data) {
							
								   $scope.MonthlyPosting=true;
								 						 
							 }) 
						 .error(function(data) {
								 
							   $scope.MonthlyPostingError=true;
							 });	



     }

	$scope.LatePayment=function(){
       $scope.latePaymentPosted=true;
     }


	 $scope.addMPosting=function(){
		 $scope.btnPosting=false;
		 $scope.MonthlyPosting=false;
	 };

	 $scope.addLatePayment=function(){
		 $scope.btnLatePayment=false;
		 $scope.latePaymentPosted=false;
	 };

	  $scope.addTnotifications=function(){
		  $scope.btnNotification=false;
		  $scope.NotificationPosted=false;
         $scope.NotificationError=false;
	    
	    };

});

landlordtmngt.controller('RentPostingctrl', function($scope,$rootScope,$http) {
   $scope.Months=[{"month":"1","value":"January"},
	              {"month":"2","value":"February"},
	              {"month":"3","value":"March"},
	              {"month":"4","value":"April"},
				  {"month":"5","value":"May"},
				  {"month":"6","value":"June"},
	              {"month":"7","value":"July"},
				  {"month":"8","value":"August"},
                  {"month":"9","value":"September"},
                  {"month":"10","value":"October"},
				  {"month":"11","value":"November"},
                  {"month":"12","value":"December"}
          ] ;
   $scope.Landlord={};
 
    
   $scope.rentPosted=false;
   $scope.rentPostedError=false;
   $scope.plot=$rootScope.plot;
   $scope.Landlord.plot=$scope.plot[0];
    $scope.Landlord.dateChoosen=$scope.Months[0];

  // $scope.Landlord;
   $scope.PostMonthlyRent=function(){ 

	    
		var Details={"plotName": $scope.Landlord.plot.Plotname,
			         "Month":$scope.Landlord.dateChoosen.value,
			         "ReceiptNo":$scope.Landlord.receipt,
			         "PostDateTime":new Date().toISOString()
		  };
        
				  $http.post('/web/Landlord/MonthlyRentPosting',Details )
				 		 .success(function(data) {
					
                                
								$scope.rentPosted=true;
							 }) 
						 .error(function(data) {
                 
								 
							   $scope.rentPostedError=true;
							   $scope.msg=data.error;
							 });	
   }

});


landlordtmngt.controller('inboxctrl', function($scope,$http,$rootScope,tenant) {
$scope.SuccessStatus=false;
 $scope.ErrorStatus=false;
$scope.Sentemails=[];
 tenant.list()
	.success(function (data)
	{ 
	$scope.MailTo=data
    $scope.Mail.to=$scope.MailTo[0];
	}
	);

$http.get('/web/Viewmail').success(function (data){
	$scope.UserMail=data; 
	$scope.emails = $scope.UserMail.Received;
	$scope.Sentemails= $scope.UserMail.Sent;
	if (typeof $scope.Sentemails=="undefined")
	  {
		  $scope.Sentemails=[];
	  }

	});



$scope.Mail={};
$scope.UserMail={};


 $scope.viewMail=false;
 $scope.viewSentMail=false;


 $scope.emails = {};

 $scope.ShowMailpopUp=function(mailinbox){
        $scope.viewMail=true;
		$scope.Mail=mailinbox;
 }

$scope.ShowSentMailpopUp=function(mailinbox){
        $scope.viewSentMail=true;
		$scope.Mail=mailinbox;
 }


 $scope.CloseViewMailpopup=function(){
        $scope.viewMail=false;
 }


 $scope.SendMail=function(){
	  if (typeof $scope.Mail.msg=="undefined")
	  {
		   alert("No Message Defined ..Kindly Type a Message");
	  }
	  else{
  

    var mail ={"update":{
		"senderDetails":{         
		 "to": $scope.Mail.to.names,
         "subject": $scope.Mail.subject,
         "msg": $scope.Mail.msg,
         "date": new Date()
		},
         "ReceiverId":$scope.Mail.to._id,
         "ReceiverDetails":{
		   "from": $rootScope.landlordDetails.names,
           "subject": $scope.Mail.subject,
           "msg": $scope.Mail.msg,
           "date": new Date()

		}
	  }
	};

                  $http.post('/web/Mail',mail )
				 		 .success(function(data) {
							
								   $scope.SuccessStatus=true;
								   $scope.Sentemails.push(mail.update.senderDetails );							 
							 }) 
						 .error(function(data) {
								 
							   $scope.ErrorStatus=true;
							 });	

	 

			}
 }

});



landlordtmngt.controller('vacatectrl', function($scope,$http,$rootScope, notificationService) {


 $scope.disableComponents=true;
  $scope.vacateupdate=false;
  $scope.vacateerror=false;

$scope.crit={};
$scope.Tenant={};

 $scope.landlordplots=$rootScope.plot;
 $scope.Tenant.plot=$scope.landlordplots[0];


   $scope.GetDetails=function(){
 
     $http.get('/web/Landlord/bookedtenantList/'+$scope.Tenant.plot.Plotname,{ cache: true })
		 .success(function (data){
		    $scope.tenantdata=data;
			$scope.crit=$scope.tenantdata[0];
			 
	 }); 
}



$scope.Add=function(){
    $scope.disableComponents=false;
};

$scope.Update=function(){



	var data={"update":{
		 "tenantupdate":{"hsestatus":0,"housename":$scope.crit.housename},
		 "houseUpdate":{"status":"vacant","tenantid":$scope.crit._id},
		 "details":{"_id":$scope.crit._id,"number":$scope.crit.housename}
               }
		  };


      $http.post('/web/Landlord/vacate', data)
	.success(function(data){
		  
      $scope.vacateupdate=true;
	   notificationService.showAlert('Success ','Vacation Success ..');
       
  })
	.error(function(data) {
	  
		$scope.vacateerror=true;
		$scope.msg=data.error;
		notificationService.showAlert('Error ','Ooops An Error Occured ..');
	 });
	 
	  $scope.disableComponents=true;


};


});



landlordtmngt.controller('LandlordProfilectrl', function($scope,$http,$rootScope,$upload) {

  $scope.updateUserDetails= function() {
     var file=$scope.file;  
       
   
      $scope.upload = $upload.upload({
        url: '/web/Landlord/Landlordphotoupload', //upload.php script, node.js route, or servlet url
        method: 'POST',
        // headers: {'header-key': 'header-value'},
        // withCredentials: true,
        data: {myObj: $scope.myModelObj},
        file: file, 
      }).progress(function(evt) {
       // console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
		
		$scope.Profileupdate=true;
		  $rootScope.landlordDetails.Details.imageUrl=data.imageUrl;
        
      });

 


  };

  $scope.onFileSelect = function($files) {
	  $scope.file=$files;   
  };

});

landlordtmngt.controller('rentctrl', function($scope,$http,$rootScope,$filter,notificationService) {
$scope.Tenant={};
$scope.House={};
$scope.housetaken=false;
$scope.housetakenerror=false;
 $scope.disableComponents=true;
$scope.showCustom=false;

 $scope.landlordplots=$rootScope.plot;
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


   $http.get('/web/Landlord/UnbookedtenantList/'+ $scope.Tenant.plot.Plotname).success(function (data){$scope.tenantdata=data ;$scope.Tenant.names=$scope.tenantdata[0];});
   $http.get('/web/Landlord/VacanthouseList/'+$scope.Tenant.plot.Plotname).success(function (data){$scope.housedata=data;$scope.Tenant.housename=$scope.housedata[0]; });
 
}


 $scope.Add=function(){
	  $scope.disableComponents=false;

 };
 $scope.save=function(){
	
  console.log($scope.Tenant);

	 var bal;
	 var desc;
	 var trxdate=$filter('date')(new Date(),'yyyy-MM-dd');
   if ($scope.House.TransactionPayment.type=="RD")
   {
	  bal =($scope.House.housename.amount * 2);
	  desc="Rent And Deposit";
   }
   else if ($scope.House.TransactionPayment.type=="R")
   {
	   bal =$scope.House.housename.amount ;
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
		 "tenantupdate":{"AgreementStatus":true,"AccessStatus":0,"hsestatus":1,"housename":$scope.House.housename.number,"balance":bal},
		 "houseUpdate":{"status":"rented","tenantid":$scope.Tenant.names._id,"plotname":$scope.Tenant.plot.Plotname},
         "Trxn":{"tenantid":$scope.Tenant.names._id, "housenumber":$scope.House.housename.number,
	             "plotnumber":$scope.Tenant.plot.Plotname,"transactiondate":trxdate,
	              "transactiontype":"Check In Posting", "Description":desc,
	              "tranAmount":bal,"Landlordid":$rootScope.landlordDetails._id,"currentBal":bal,"Month":Month,"balcf":bal,"Charges":null},
		    "details":{"_id":$scope.Tenant.names._id,"number":$scope.House.housename.number}
               }
		  };

  $http.post('/web/Landlord/Rent', data)
	.success(function(data){
	  
      $scope.housetaken=true;
      notificationService.showAlert('Success ','House Occupied Successfully ..');
       
  })
	.error(function(data) {
	  
		$scope.housetakenerror=true;
		$scope.msg=data.error;
		notificationService.showAlert('Error','Ooops Error Occurred ..');
	 });	
	  
   $scope.disableComponents=true;


 }
  
});




//Directives


//////

landlordtmngt.directive("clickToEdit", function() {
    var editorTemplate = '<div class="click-to-edit">' +
        '<div ng-hide="view.editorEnabled">' +
            '{{value}} ' +
            '<a ng-click="enableEditor()">Edit</a>' +
        '</div>' +
        '<div ng-show="view.editorEnabled">' +
            '<input ng-model="view.editableValue">' +
            '<a href="#" ng-click="save()">Save</a>' +
            ' or ' +
            '<a ng-click="disableEditor()">cancel</a>.' +
        '</div>' +
    '</div>';

    return {
        restrict: "A",
        replace: true,
        template: editorTemplate,
        scope: {
            value: "=clickToEdit",
        },
        controller: function($scope) {
            $scope.view = {
                editableValue: $scope.value,
                editorEnabled: false
            };

            $scope.enableEditor = function() {
                $scope.view.editorEnabled = true;
                $scope.view.editableValue = $scope.value;
            };

            $scope.disableEditor = function() {
                $scope.view.editorEnabled = false;
            };

            $scope.save = function() {
                $scope.value = $scope.view.editableValue;
                $scope.disableEditor();
            };
        }
    };
});





landlordtmngt.provider("ngModalDefaults", function() {    return {      options: {        closeButtonHtml: "<span class='ng-modal-close-x'>X</span>"      },      $get: function() {        return this.options;      },      set: function(keyOrHash, value) {        var k, v, _results;        if (typeof keyOrHash === 'object') {          _results = [];          for (k in keyOrHash) {            v = keyOrHash[k];            _results.push(this.options[k] = v);          }          return _results;        } else {          return this.options[keyOrHash] = value;        }      }    };  });
landlordtmngt.directive('modalDialog', [    'ngModalDefaults', '$sce', function(ngModalDefaults, $sce) {      return {        restrict: 'E',        scope: {          show: '=',          dialogTitle: '@',          onClose: '&?'        },        replace: true,        transclude: true,        link: function(scope, element, attrs) {          var setupCloseButton, setupStyle;          setupCloseButton = function() {            return scope.closeButtonHtml = $sce.trustAsHtml(ngModalDefaults.closeButtonHtml);          };          setupStyle = function() {            scope.dialogStyle = {};            if (attrs.width) {              scope.dialogStyle['width'] = attrs.width;            }            if (attrs.height) {              return scope.dialogStyle['height'] = attrs.height;            }          };          scope.hideModal = function() {            return scope.show = false;          };          scope.$watch('show', function(newVal, oldVal) {            if (newVal && !oldVal) {              document.getElementsByTagName("body")[0].style.overflow = "hidden";            } else {              document.getElementsByTagName("body")[0].style.overflow = "";            }            if ((!newVal && oldVal) && (scope.onClose != null)) {              return scope.onClose();            }          });          setupCloseButton();          return setupStyle();        }, template: "<div class='ng-modal' ng-show='show'>\n  <div class='ng-modal-overlay' ng-click='hideModal()'></div>\n  <div class='ng-modal-dialog' ng-style='dialogStyle'>\n    <span class='ng-modal-title' ng-show='dialogTitle && dialogTitle.length' ng-bind='dialogTitle'></span>\n    <div class='ng-modal-close' ng-click='hideModal()'>\n      <div ng-bind-html='closeButtonHtml'></div>\n    </div>\n    <div class='ng-modal-dialog-content' ng-transclude></div>\n  </div>\n</div>"      };    }  ]);


//Services
//{

landlordtmngt.factory('tenantcreation', function($resource) {
  return $resource('/web/Landlord/createTenant', {}, {
      create: {method:'POST', params:{}}
   });
});

landlordtmngt.factory('tenantlist', function($resource) {
  return $resource('/web/Landlord/tenantList/:crit', {}, {
      query: {method:'GET', params:{"plot.name":"kahawa_2"}, isArray:true}
   });
});




landlordtmngt.controller('pwdchangectrl', function($scope,$http) {

$scope.busy=false;
$scope.pwdchanged=false;
$scope.disableComponents=true;
$scope.SubmitPwd=function(){
	
	var dat={"newPwd":$scope.newpassword};
    $http.post('/web/ChangePwd',dat )
		   .success(function(data) {
		    
		    $scope.pwdchanged=true;
			$scope.disableComponents=true;
		     }) 
			.error(function(data) {
				 
				 $scope.pwderror=true;	 
				});	
}


$scope.CheckPwd=function(){
	$scope.busy=true;
     $http.post('/web/CheckPwd',$scope.pwd )
		   .success(function(data) {
		     if (data.status)
		     {
				 $scope.busy=false; 
				 $scope.btnStatus=false;
				 $scope.invalidcredential=false;
				 $scope.disableComponents=false;
				 
		     }
			 else{$scope.invalidcredential=true;$scope.busy=false;$scope.disableComponents=true}
				
							 }) 
			.error(function(data) {
					  $scope.invalidcredential=true;
					  $scope.msg=data.error
				});	
}
     
});
landlordtmngt.directive('pwCheck', function() {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var firstPassword = '#' + attrs.pwCheck;
                $(elem).add(firstPassword).on('keyup', function () {
                    scope.$apply(function () {
                        var v = elem.val()===$(firstPassword).val();
                        ctrl.$setValidity('pwcheck', v);
                    });
                });
            }
        }
    });


landlordtmngt.controller('TenantPaidReportctrl', function($scope,$http,$rootScope,$window) {
  
	         $scope.landlordplots=$rootScope.plot;
   $scope.PaidTenant=[];
   $scope.numPerPage=6;
  $scope.showData=false;
  $scope.showError=false;
  $scope.ViewReport=false;
  $scope.ViewDownloadReport=false;
$scope.disablebtn=true;

  $scope.selectReport=function(name){
	  $scope.pname=name;
	  $scope.disablebtn=false;
  };

   $scope.ShowReport=function(){
	    
	    $scope.reportData={
	                   "plot":$scope.pname,
                       "option":"view"
                    };
	  
               $http.post('/web/Reports/Tenantpaid', $scope.reportData)
						 .success(function(data) {
				    
                       $scope.ViewReport=true;
					   $scope.ViewDownloadReport=false;
                       $scope.content=data.result;
					
								
							 }) 
						 .error(function(data) {

							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 
								  $scope.showData=false;
							 });
							   
	
   }


    $scope.DownloadReport=function(){
            

			$scope.reportData={
	                   "plot":$scope.pname,
                       "option":"download"
                    };
               $http.post('/web/Reports/Tenantpaid', $scope.reportData)
						 .success(function(data) {
				    
                      $scope.ViewReport=false;
		         	$scope.ViewDownloadReport=true;
					    $scope.file=data;
								
							 }) 
						 .error(function(data) {
							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 
								  $scope.showData=false;
							 });
        

	};

 
});
landlordtmngt.controller('TenantUnpaidReportctrl', function($scope,$http,$rootScope,$window) {

         $scope.landlordplots=$rootScope.plot;
   $scope.PaidTenant=[];
  $scope.showData=false;
  $scope.showError=false;
  $scope.ViewReport=false;
  $scope.ViewDownloadReport=false;
$scope.disablebtn=true;

  $scope.selectReport=function(name){
	  $scope.pname=name;
	  $scope.disablebtn=false;
  };

   $scope.ShowReport=function(){
	    
	    $scope.reportData={
	                   "plot":$scope.pname,
                       "option":"view"
                    };
	  
               $http.post('/web/Reports/TenantUnpaid', $scope.reportData)
						 .success(function(data) {
				    
                       $scope.ViewReport=true;
					   $scope.ViewDownloadReport=false;
                       $scope.content=data.result;

								
							 }) 
						 .error(function(data) {

							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 
								  $scope.showData=false;
							 });
							   
	
   }


    $scope.DownloadReport=function(){
            

			$scope.reportData={
	                   "plot":$scope.pname,
                       "option":"download"
                    };
               $http.post('/web/Reports/TenantUnpaid', $scope.reportData)
						 .success(function(data) {
				    
                      $scope.ViewReport=false;
		         	$scope.ViewDownloadReport=true;
					    $scope.file=data;
								
							 }) 
						 .error(function(data) {
							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 
								  $scope.showData=false;
							 });
        

	};
});

landlordtmngt.controller('TenantListReportctrl', function($scope,$http,$rootScope,$window) {

     $scope.landlordplots=$rootScope.plot;
   $scope.PaidTenant=[];
   $scope.numPerPage=6;
  $scope.showData=false;
  $scope.showError=false;
  $scope.ViewReport=false;
  $scope.ViewDownloadReport=false;
$scope.disablebtn=true;

  $scope.selectReport=function(name){
	  $scope.pname=name;
	  $scope.disablebtn=false;
  };
   $scope.ShowReport=function(){
	    
	    $scope.reportData={
	                   "plot":$scope.pname,
                       "option":"view"
                    };
	  
               $http.post('/web/Reports/TenantList', $scope.reportData)
						 .success(function(data) {
				    
                       $scope.ViewReport=true;
					   $scope.ViewDownloadReport=false;
                       $scope.content=data.result;
	
								
							 }) 
						 .error(function(data) {
	
							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 
								  $scope.showData=false;
							 });
							   
	
   }


    $scope.DownloadReport=function(){
            

			$scope.reportData={
	                   "plot":$scope.pname,
                       "option":"download"
                    };
               $http.post('/web/Reports/TenantList', $scope.reportData)
						 .success(function(data) {
				    
                      $scope.ViewReport=false;
		         	$scope.ViewDownloadReport=true;
					    $scope.file=data;
								
							 }) 
						 .error(function(data) {
							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 
								  $scope.showData=false;
							 });
        

	};

});


landlordtmngt.controller('OverpaidHousectrl', function($scope,$http,$rootScope,$window) {


   $scope.landlordplots=$rootScope.plot;
   $scope.PaidTenant=[];
  $scope.showData=false;
  $scope.showError=false;
  $scope.ViewReport=false;
  $scope.ViewDownloadReport=false;
$scope.disablebtn=true;

  $scope.selectReport=function(name){
	  $scope.pname=name;
	  $scope.disablebtn=false;
  };

   $scope.ShowReport=function(){
	    
	    $scope.reportData={
	                   "plot":$scope.pname,
                       "option":"view"
                    };
	  
               $http.post('/web/Reports/TenantOverpaid', $scope.reportData)
						 .success(function(data) {
				    
                       $scope.ViewReport=true;
					   $scope.ViewDownloadReport=false;
                       $scope.content=data.result;

								
							 }) 
						 .error(function(data) {

							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 
								  $scope.showData=false;
							 });
							   
	
   }


    $scope.DownloadReport=function(){
            

			$scope.reportData={
	                   "plot":$scope.pname,
                       "option":"download"
                      };
               $http.post('/web/Reports/TenantOverpaid', $scope.reportData)
						 .success(function(data) {
				    
                      $scope.ViewReport=false;
		         	$scope.ViewDownloadReport=true;
					    $scope.file=data;
								
							 }) 
						 .error(function(data) {
							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 
								  $scope.showData=false;
							 });
        

	};


});

landlordtmngt.controller('OccupiedHousectrl', function($scope,$http,$rootScope,$window) {
	 
	         $scope.landlordplots=$rootScope.plot;
   $scope.numPerPage=6;
  $scope.showData=false;
  $scope.showError=false;
  $scope.ViewReport=false;
  $scope.ViewDownloadReport=false;
$scope.disablebtn=true;

  $scope.selectReport=function(name){
	  $scope.pname=name;
	  $scope.disablebtn=false;
  };

   $scope.ShowReport=function(){
	    
	    $scope.reportData={
	                   "plot":$scope.pname,
                       "option":"view"
                    };
	  
               $http.post('/web/Reports/OccupiedHouses', $scope.reportData)
						 .success(function(data) {
				    
                       $scope.ViewReport=true;
					   $scope.ViewDownloadReport=false;
                       $scope.content=data.result;
					
								
							 }) 
						 .error(function(data) {

							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 
								  $scope.showData=false;
							 });
							   
	
   }


    $scope.DownloadReport=function(){
            

			$scope.reportData={
	                   "plot":$scope.pname,
                       "option":"download"
                    };
               $http.post('/web/Reports/OccupiedHouses', $scope.reportData)
						 .success(function(data) {
				    
                      $scope.ViewReport=false;
		         	$scope.ViewDownloadReport=true;
					    $scope.file=data;
								
							 }) 
						 .error(function(data) {
							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 
								  $scope.showData=false;
							 });
        

	};

});



landlordtmngt.controller('AllHousectrl', function($scope,$http,$rootScope,$window) {


                    $scope.landlordplots=$rootScope.plot;
   $scope.numPerPage=6;
  $scope.showData=false;
  $scope.showError=false;
  $scope.ViewReport=false;
  $scope.ViewDownloadReport=false;
$scope.disablebtn=true;

  $scope.selectReport=function(name){
	  $scope.pname=name;
	  $scope.disablebtn=false;
  };

   $scope.ShowReport=function(){
	    
	    $scope.reportData={
	                   "plot":$scope.pname,
                       "option":"view"
                    };
	  
               $http.post('/web/Reports/AllHouses', $scope.reportData)
						 .success(function(data) {
				    
                       $scope.ViewReport=true;
					   $scope.ViewDownloadReport=false;
                       $scope.content=data.result;
					
								
							 }) 
						 .error(function(data) {

							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 
								  $scope.showData=false;
							 });
							   
	
   }


    $scope.DownloadReport=function(){
            

			$scope.reportData={
	                   "plot":$scope.pname,
                       "option":"download"
                    };
               $http.post('/web/Reports/AllHouses', $scope.reportData)
						 .success(function(data) {
				    
                      $scope.ViewReport=false;
		         	$scope.ViewDownloadReport=true;
					    $scope.file=data;
								
							 }) 
						 .error(function(data) {
							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 
								  $scope.showData=false;
							 });
        

	};


});

landlordtmngt.controller('VacantHousectrl', function($scope,$http,$rootScope,$window) {
                    $scope.landlordplots=$rootScope.plot;
   $scope.numPerPage=6;
  $scope.showData=false;
  $scope.showError=false;
  $scope.ViewReport=false;
  $scope.ViewDownloadReport=false;
$scope.disablebtn=true;

  $scope.selectReport=function(name){
	  $scope.pname=name;
	  $scope.disablebtn=false;
  };

   $scope.ShowReport=function(){
	    
	    $scope.reportData={
	                   "plot":$scope.pname,
                       "option":"view"
                    };
	  
               $http.post('/web/Reports/VacantHouses', $scope.reportData)
						 .success(function(data) {
				    
                       $scope.ViewReport=true;
					   $scope.ViewDownloadReport=false;
                       $scope.content=data.result;
					
								
							 }) 
						 .error(function(data) {

							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 
								  $scope.showData=false;
							 });
							   
	
   }


    $scope.DownloadReport=function(){
            

			$scope.reportData={
	                   "plot":$scope.pname,
                       "option":"download"
                    };
               $http.post('/web/Reports/VacantHouses', $scope.reportData)
						 .success(function(data) {
				    
                      $scope.ViewReport=false;
		         	$scope.ViewDownloadReport=true;
					    $scope.file=data;
								
							 }) 
						 .error(function(data) {
							$scope.ViewReport=false;
							$scope.ViewDownloadReport=false;
							 
								  $scope.showData=false;
							 });
        

	};
});


//Services



landlordtmngt.factory('tenant', function($http) {
    var tenant={}    
    var url='/web/Landlord';

	
	 tenant.gethouse = function (Houseid) {
		return $http.post(url + '/tenantDataHseName', Houseid);
      };
      tenant.getTenantid = function (Tenantid) {
		return $http.post(url + '/tenantDataID', Tenantid);
    };

    tenant.Search = function (search) {
		return $http.post(url + '/GeneralSearch', search);
    };

	tenant.statement = function (search) {
		return $http.post(url + '/statement', search);
    };
    tenant.list = function () {
		return $http.get(url + '/LandlordTenants',{ cache: true });
    }; 
   tenant.SendSms = function (data) {
		return $http.post(url + '/LandlordSendSms',data);
    };
	 

	return tenant;
});


landlordtmngt.service('TrxnService', function ($http) {
    var transaction={};
    var url='/web/Landlord';
	  this.getTransaction = function (receipt) {
		return $http.post(url + '/SearchReceipt', receipt);
    };

	  this.getpaymentSummary = function () {
		return $http.get(url + '/PaymentDateAggregation');
    };
      this.DeleteReceipt = function (details) {
		return $http.post(url + '/DeleteReceipt',details);   
    };

});




  landlordtmngt.service('GoogleMapApi', ['$window', '$q', 
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


landlordtmngt.directive('myMap', function(GoogleMapApi,$rootScope ) {
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


landlordtmngt.directive('clickOnce', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var replacementText = attrs.clickOnce;

            element.bind('click', function() {
                $timeout(function() {
                    if (replacementText) {
                        element.html(replacementText);
                    }
                    element.attr('disabled', true);
                }, 0);
            });
        }
    };
});


landlordtmngt.service('notificationService', function( $mdDialog) {
  var alert = '';
  this.showAlert = function(title,content) {
    $mdDialog.show(
      $mdDialog.alert(title)
        .title()
        .content(content)
        .ariaLabel('notification')
        .ok('Got it!')
     
    );
  };
  this.showConfirm = function() {
    var confirm = $mdDialog.confirm()
      .title('Would you like to delete your debt?')
      .content('All of the banks have agreed to forgive you your debts.')
      .ariaLabel('Lucky day')
      .ok('Please do it!')
      .cancel('Sounds like a scam')
   
    $mdDialog.show(confirm).then(function() {
      alert = 'You decided to get rid of your debt.';
    }, function() {
      alert = 'You decided to keep your debt.';
    });
  };
  this.showAdvanced = function() {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'tenant.tmpl.html',
    
    })
    .then(function(answer) {
      alert = 'You said the information was "' + answer + '".';
    }, function() {
      alert = 'You cancelled the dialog.';
    });
  };
});


function DialogController( $mdDialog) {
  this.hide = function() {
    $mdDialog.hide();
  };
  this.cancel = function() {
    $mdDialog.cancel();
  };
  this.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}






landlordtmngt.factory('notificationFactory', function () {

	
	return {
        success: function (text) {
			
			alert("");
        },
        error: function (text) {
		alert("");
        },
        inprogress: function (text) {
		alert("");
        },
         clear: function () {
		  alert("");
        },
    };
});

landlordtmngt.factory('authService',[ '$http','LandlordFactory',function ($http,LandlordFactory) {



   

   var userRoleRouteMap=[];
	LandlordFactory.getLordDetails()
		.success(function(data) { 
		       userRoleRouteMap=data.allowedPath; 	      
			  })
		.error(function(data) {});

		
    return {

        userHasRole: function (role) {
            for (var j = 0; j < userRole.length; j++) {
                if (role == userRole[j]) {
                    return true;
                }
            }
            return false;
        },

           isUrlAccessibleForUser: function (route) {
                var validUrlsForRole = userRoleRouteMap;
                if (validUrlsForRole) {
                    for (var j = 0; j < validUrlsForRole.length; j++) {
                        if (validUrlsForRole[j].path == route)
                            return true;
                    }
                }
            return false;
        }
    };
}]);


landlordtmngt.factory('LandlordFactory', ['$http','$rootScope','notificationFactory', function($http,notificationFactory) {
	var url='/web/Landlord';
	var data = {

		//tenant 

		  	checkTenant:function (tenantid) {
		     return $http.get(url + '/Tenant/id/'+ tenantid);
            },
            checkTenantContact:function (contact) {
		     return $http.get(url + '/Tenant/contact/'+ contact);
            },
            createTenant:function (data) {
		     return $http.post(url + '/Tenant',data); 
            },
             tenantLookup:function (searchid,lookup) {
		     return $http.get(url + '/Tenant/lookup/?searchid='+searchid+'&lookup='+lookup);
            },
            tenantUpdate:function (details) {
		     return $http.put(url + '/Tenant',details); 
            },
           tenantList:function () {
		     return $http.get(url + '/Tenant'); 
            },
            DeleteTenant:function (tenantid) {
		     return $http.delete(url + '/Tenant/'+tenantid); 
            },

           
				
		//

        GetLandlordNotice: function() {
			var promise = $http.get(url+ '/GetLandlordNotice',{ cache: true })
			return promise;
		},

       //
         plotExist: function(plotname) {
			var promise = $http.get(url+ '/plot/check/'+plotname)
			return promise;
		 },

         addPlot: function(details) {
			var promise =  $http.post(url + '/plot',details); 
			return promise;
		 },
        getPlotDetails: function(details) {
			var promise =  $http.get(url + '/plot/'+details); 
			return promise;
		 },
         updateProperty: function(details) {
			var promise =  $http.put(url + '/plot',details); 
			return promise;
		 },
         deleteProperty: function(property) {
			var promise =  $http.delete(url + '/plot/'+property); 
			return promise;
		 },
         //
		  CheckHseNoExists: function(hsename,plotname) {
			var promise =  $http.get(url + '/House/check/data?hsename='+hsename+'&plotname='+plotname); 
			return promise;
		 },
          createHouse: function(data) {
			var promise =  $http.post(url + '/House',data); 
			return promise;
		 },
          updateHse: function(details) {
			var promise =  $http.put(url + '/House',details); 
			return promise;
		 },
			 
		  getmyHouses: function(data) {
			var promise =  $http.get(url + '/House'); 
			return promise;
		 },
           deleteHse: function(hseno) {
			var promise =  $http.delete(url + '/House/'+hseno); 
			return promise;
		 },
      //      

       GetUnverifiedTransactions: function() {
			var promise = $http.get(url+ '/UnverifiedTransactions',{ cache: true })
			return promise;
		},
		getLordDetails: function() {
			var promise = $http.get(url+ '/LandLordDetails',{ cache: true })
			return promise;
		},
		getLandLordConfiguration: function() {
			var promise = $http.get(url+'/LandLordConfiguration',{ cache: true })
			return promise;
		},

        getEmail: function() {
			var promise = $http.get('/web/Viewmail',{ cache: true })
			return promise;
		} ,
        getTotals: function() {
			var promise = $http.get(url+'/TotalUnpaid');
			return promise;
		}  ,
        createUser: function(details) {
			var promise =  $http.post(url + '/LandlordCreateUser',details); 
			return promise;
		}  ,	

    
		getMessages:function(){
  
           var promise = $http.get('/web/Sms/getMsg')
			return promise;
		},

       getUsage:function(){
             
                    var promise = $http.get('/web/Sms/getUsage')
			return promise;
		}
        


	}
	return data;
}]);

 landlordtmngt.service('MasterDetails', function ($rootscope) {
	
     this.save = function (landlord) {
		 $rootscope.iza=landlord;
	      
         }
	this.get = function () {
        return $rootscope;
        }
 });

  landlordtmngt.service('BatchTrxnService', function () {

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





//Routes 

landlordtmngt.config(function($routeProvider,$locationProvider)	{

  $locationProvider.hashPrefix("!");

  $routeProvider
  .when('/LandlordHome', {
      templateUrl: 'views/Landlord/LandlordHome.html',   
      controller: 'HomeLandlordctrl',
      resolve: {
			
            Email: function(LandlordFactory) {
				return LandlordFactory.getEmail();
			},
            Totals: function(LandlordFactory) {
				return LandlordFactory.getTotals();
			}
	       }
        })	
  
 .when('/tenantsmngt', {
     templateUrl: 'views/Landlord/landlordTenantmngt.html',   
      controller: 'tenantctrl'
        })
  .when('/housemngt', {
     templateUrl: 'views/Landlord/Houseselect.html',   
     controller: 'housemngtctrl'
        })

    .when('/landlordHousemngt', {
     templateUrl: 'views/Landlord/landlordHousemngt.html',   
     controller: 'housemngtctrl'
        })
     .when('/landlordEditHousemngt', {
     templateUrl: 'views/Landlord/landlordEditHousemngt.html',   
     controller: 'housemngtEditctrl'
        })
			
   .when('/plotmngt', {
       templateUrl: 'views/Landlord/landlordPlotmngt.html',   
       controller: 'plotmngtctrl'  
        })
   .when('/trxnmngt', {
       templateUrl: 'views/Landlord/TransactionSelect.html',   
       controller: 'trxntypectrl'
        })
    .when('/Singletransaction', {
       templateUrl: 'views/Landlord/landlordTrxnmgt.html',   
       controller: 'trxnmngtctrl'
        })
    .when('/Edittransaction', {
       templateUrl: 'views/Landlord/Edittransaction.html',   
       controller: 'Edittransactiontctrl'
        })

    .when('/Batchtransaction', {
       templateUrl: 'views/Landlord/LandlordBatchTrxn.html',   
       controller: 'trxnmngtctrl'
        })

    .when('/expensemngt', {
       templateUrl: 'views/Landlord/landlordExpensemngt.html',   
       controller: 'expensemngtctrl'
        })
	.when('/summarymngt', {
       templateUrl: 'views/Landlord/landlordSummarymngt.html',   
       controller: 'summarymngtctrl'
        })
    .when('/documentmngt', {
       templateUrl: 'views/Landlord/landlordDocumentmngt.html',   
       controller: 'documentmngtctrl'
        })
    .when('/inbox', {
       templateUrl: 'views/Landlord/landlordMessageInbox.html',   
       controller: 'inboxctrl'
        })

    .when('/rent', {
       templateUrl: 'views/Landlord/landlordRent.html',   
       controller: 'rentctrl'
        })

      .when('/vacate', {
       templateUrl: 'views/Landlord/LandlordVacate.html',   
       controller: 'vacatectrl'
        })

    .when('/pwdchange', {
     templateUrl: 'views/Landlord/PwdChange.html',   
     controller: 'pwdchangectrl'
        })

    .when('/profile', {
     templateUrl: 'views/Landlord/LandlordProfile.html',   
     controller: 'LandlordProfilectrl'
        })
	.when('/ReportsPortal', {
     templateUrl: 'views/Landlord/ReportsViews/ReportsPortal.html',   
     controller: 'ReportsPortalctrl'
        })		
	.when('/Settings', {
     templateUrl: 'views/Landlord/LandlordDashboard.html',   
     controller: 'Settingsctrl'
        })

	.when('/RentPosting', {
     templateUrl: 'views/Landlord/RentPosting.html',   
     controller: 'RentPostingctrl'
        })
	.when('/TenantPaidReport', {
     templateUrl: 'views/Landlord/ReportsViews/TenantPaidReport.html',   
     controller: 'TenantPaidReportctrl'
        })	
 .when('/TenantUnPaidReport', {
     templateUrl: 'views/Landlord/ReportsViews/TenantUnpaidReport.html',   
     controller: 'TenantUnpaidReportctrl'
        })	
 .when('/TenantListReport', {
     templateUrl: 'views/Landlord/ReportsViews/TenantListReport.html',   
     controller: 'TenantListReportctrl'
        })
    .when('/OccupiedHouseReport', {
     templateUrl: 'views/Landlord/ReportsViews/OccupiedHouseReport.html',   
     controller: 'OccupiedHousectrl'
        })	
    .when('/OverpaidHouseReport', {
     templateUrl: 'views/Landlord/ReportsViews/TenantOverpaidReport.html',   
     controller: 'OverpaidHousectrl'
        })
  .when('/VacantHouseReport', {
     templateUrl: 'views/Landlord/ReportsViews/VacantHouseReport.html',   
     controller: 'VacantHousectrl'
        })
    .when('/AllHouseReport', {
     templateUrl: 'views/Landlord/ReportsViews/AllHouseReport.html',   
     controller: 'AllHousectrl'
        })
   .when('/Notice', {
     templateUrl: 'views/Landlord/LandlordNotice.html',   
     controller: 'Noticectrl'
        })
    .when('/VacateNotice', {
     templateUrl: 'views/Landlord/LandlordVacateNotice.html',   
     controller: 'VacateNoticectrl'
        })			
	.when('/PaymentSummaryDate', {
     templateUrl: 'views/Landlord/SummaryPaymentDate.html',   
     controller: 'PaymentSummaryDatectrl'
        })	
	.when('/map', {
     templateUrl: 'views/Landlord/mapView.html',   
     controller: 'mapViewctrl'		
        })
   .when('/messages', {
     templateUrl: 'views/Landlord/LandlordMessages.html',   
     controller: 'Messagesctrl',
	  resolve: {		
            smsmessages: function(LandlordFactory) {
				return LandlordFactory.getMessages();
	                    }
	            }
        })	
     
    .when('/TenantTrxn', {
     templateUrl: 'views/Landlord/LandlordTenantTrxn.html',   
     controller: 'TenantTrxnctrl'	 
       })
    .when('/ComposeSms', {
     templateUrl: 'views/Landlord/LandlordComposeSms.html',   
     controller: 'ComposeSmsctrl'	 
       })
    .when('/CreateUser', {
     templateUrl: 'views/Landlord/CreateUser.html',   
     controller: 'CreateUserctrl'	 
       })
     .when('/authError', {
     templateUrl: 'views/Landlord/authError.html'   
  	 
       })
        .when('/transactionVerification', {
         templateUrl: 'views/Landlord/transactionVerification.html',   
  	     controller: 'transactionVerificationctrl',
          resolve: {		
            unverifiedTransactions: function(LandlordFactory) {
				return LandlordFactory.GetUnverifiedTransactions();
	                    }
	            }
        })	   

	.otherwise({
         redirectTo: 'plotmngt'
      });

});