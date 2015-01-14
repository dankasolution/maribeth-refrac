(function(){
  "use strict";

  angular.module('authModule', ['ui.router'])
    .controller('welcomeCtrl', ['authUrl', '$http', '$state', 'broadcastUserFactory', '$scope',
      function welcomeCtrl(authUrl, $http, $state, broadcastUserFactory, $scope){
        var vm = this;
        
        vm.userDetails = function(){
          this.userid="";
          this.username="";
          this.userrole="";
          this.companyid="";
          this.companyname="";
          this.msg="";
        };

        vm.logMeIn = function(){
          //console.log('logMeIn');
          $http.post(authUrl, {
            username: vm.username,
            password: vm.password
          },{withCredentials: true})
            .success(function(data){
              vm.userDetails = data;

              broadcastUserFactory.prepForBroadcast(vm.userDetails);

              if(vm.userDetails.userrole==="Manager"){
                $state.go('manager.home') //goto Manager route               
              }else if(vm.userDetails.userrole==="Crew"){
                $state.go('crewhome')//goto Crew route
              }else{
                //stay in the page
                vm.userDetails.msg = "User has no valid role. Please contact the admin.";           
              }
              //console.log('success', vm.userDetails);
            })
            .error(function(error){         
              vm.userDetails.msg = error.msg;
              //console.log('error', error);
            });
        }        
      }])  
  
    .controller('signupCtrl', ['$http', 'signupUrl', function signupCtrl($http, signupUrl){
          var vm = this;          
          vm.userdetails = {};
          vm.signMeUp = function(){

            $http.post(signupUrl, vm.userdetails)
                .success(function(results){
                    console.log(results);
                })
                .error(function(error){
                    console.log(error.msg);
                });
          }
        }])

  .directive('ngEnter', function () {
      return function (scope, element, attrs) {
          element.on("keydown keypress", function (event) {
              if(event.which === 13) {
                  scope.$apply(function (){
                      scope.$eval(attrs.ngEnter);
                  });

                  event.defaultPrevented;
              }
          });
      };
  })
}());