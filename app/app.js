//ANGULARJS
(function(){
  "use strict";

  angular.module('maribethApp',
      ['ui.router','ui.calendar','common.services','authModule', 'managerModule', 'crewModule', 'publicModule',
        'ui.bootstrap', 'timepicker', 'angularCharts'])
    .constant('authUrl', 'http://localhost:8080/api/login')
    .constant('logoutUrl', 'http://localhost:8080/api/logout')
    .constant('signupUrl', 'http://localhost:8080/api/signup')
    .constant('addCrewUrl', 'http://localhost:8080/api/addcrew')
    .constant('getCrewsUrl', 'http://localhost:8080/api/getcrews')
    .constant('getCrewShiftsUrl', 'http://localhost:8080/api/getcrewshifts')
    .constant('upsertCrewShiftsUrl', 'http://localhost:8080/api/upsertcrewshifts')
    .constant('getUserProfileUrl', 'http://localhost:8080/api/getuser')
    .constant('updateUserProfileUrl', 'http://localhost:8080/api/updateuser')

    .config(['$stateProvider','$urlRouterProvider',
              //i put all routes in the root app here to be easier to track 
              function($stateProvider, $urlRouterProvider){
                $urlRouterProvider.otherwise("/"); //default route

                $stateProvider
                  .state('welcome', {
                    url: '/',
                    templateUrl: 'app/auth/welcomeView.html',
                    controller: 'welcomeCtrl as vm'
                  })
                  .state('signup', {
                    url: '/signup',
                    templateUrl: 'app/auth/signupView.html',
                    controller: 'signupCtrl as vm'
                  })
                  
                  //--- manager module
                  //nested views -> ui.router technique
                  .state('manager', {
                    abstract: true, //parent state property to not activated without any nested state
                    url: '/manager',
                    templateUrl: 'app/managers/managerView.html',
                    controller: 'managerCtrl as vm'
                  })
                  .state('manager.home', {
                    url: '/home',
                    templateUrl: 'app/managers/managerHomeView.html',
                    controller: 'managerCtrl as vm'
                  })
                  .state('manager.profile', {
                      url: '/profile/',
                      templateUrl: 'app/common/profileView.html',
                      controller: 'crewProfCtrl as vm'
                    })
                  .state('manager.reports', {
                      url: '/reports/',
                      templateUrl: 'app/managers/reportsView.html',
                      controller: 'reportsCtrl' //not defined as vm because D3 needs $scope
                    })
                  .state('manager.crews', {
                    url: '/crews',
                    templateUrl: 'app/managers/crewListView.html',
                    controller: 'crewListCtrl as vm'
                  })
                  .state('manager.crewshifts', {
                    url: '/crewshifts/:crewid',
                    templateUrl: 'app/managers/crewShiftsView.html',
                    controller: 'crewShiftsCtrl as vm'
                  })
                  .state('manager.crewcalendar', {
                    url: '/crewcalendar/:crewid',
                    templateUrl: 'app/managers/crewCalendarView.html',
                    controller: 'crewCalendarCtrl as vm'
                  })
                  .state('manager.crewprofile', {
                    url: '/crewprofile/:userid',
                    templateUrl: 'app/common/profileView.html',
                    controller: 'crewProfCtrl as vm'
                  })
                  .state('manager.addcrew', {
                    url: '/addcrew',
                    templateUrl: 'app/managers/addCrewView.html',
                    controller: 'addCrewCtrl as vm'
                  })
                  
                  //--- crew module
                  .state('crewhome', {
                    url: '/crew',
                    templateUrl: 'app/crews/crewHomeView.html',
                    controller: 'crewCtrl as vm'
                  })
                  
              }])

    
    .controller('homeCtrl', ['broadcastUserFactory','$rootScope', '$scope', '$state', '$http', 'logoutUrl', 
      function(broadcastUserFactory, $rootScope, $scope, $state, $http, logoutUrl){

         $rootScope.days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

        var vm = this;
        vm.userdetails = broadcastUserFactory.userdetails;

        $scope.$on('userdetailsUpdated', function(){          
          vm.userdetails = broadcastUserFactory.userdetails;
        })

        vm.logout = function(){
            $http.get(logoutUrl)
              .success(function(data){
                broadcastUserFactory.prepForBroadcast({});
                $state.go('welcome');  
              })
              .error(function(error){})
          };
      }])
}());
  
  	