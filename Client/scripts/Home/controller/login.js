'use strict';

var LoginMngt= angular.module('RentmngtAppLogin', [] ); 

 LoginMngt.controller('loginCtrl', function ($scope,$http,$window) {
	 $scope.noFullyConfigured=false;
    $scope.showSpinner=false;
       $scope.Userlogin=function(){
            $scope.showSpinner=true;
                $http.post('web/Login',$scope.user)
				 		 .success(function(data) {
								     $scope.invalidcredential=false;
									 $window.sessionStorage.token = data.token;
								     $window.location.href=data.homepage;
									   
							 }) 
						 .error(function(data) {
							   $scope.invalidcredential=true;
							    $scope.showSpinner=false;
							    delete $window.sessionStorage.token;
							 });	
      };


      $scope.forgotPassword=function(){
             $http.post('web/sendmail',$scope.user)
				 .success(function(data) {
					 })
				.error(function(data) {
						  })
	  
	  };

	   });