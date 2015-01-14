(function(){
	"use strict";

	angular.module('managerModule', [])
		.controller('managerCtrl', ['broadcastUserFactory','$state', '$rootScope', managerCtrl])
		.controller('crewListCtrl', ['$http','getCrewsUrl', 'broadcastUserFactory', crewListCtrl])
		.controller('addCrewCtrl', ['$http', '$state', 'addCrewUrl', 'broadcastUserFactory', addCrewCtrl])
		.controller('crewShiftsCtrl', ['$http', '$location', '$rootScope', 'getCrewShiftsUrl', 'upsertCrewShiftsUrl', crewShiftsCtrl])
		.controller('crewCalendarCtrl', ['$modal', crewCalendarCtrl])		
		.controller('crewProfCtrl', ['$http', '$location','$state', 'getUserProfileUrl', 'updateUserProfileUrl', 'broadcastUserFactory', crewProfCtrl])
		.controller('modalEventCtrl', ['$scope', '$modalInstance', 'items', modalEventCtrl])
		.controller('reportsCtrl', ['$scope', reportsCtrl])
		
		
		function managerCtrl(broadcastUserFactory, $state, $rootScope){
			var vm = this;
			vm.userdetails = broadcastUserFactory.userdetails;

			vm.managerCalendarSrc = [];

			vm.isActive = function (current) {
				if($state.current.name === current){
					return true;
				}else{
					return false;
				}
			}
		};

		function crewListCtrl($http,getCrewsUrl,broadcastUserFactory){
			var vm = this;
			vm.userdetails = broadcastUserFactory.userdetails;
			vm.crews = {};

			$http.get(getCrewsUrl +"/"+ vm.userdetails.companyid)
		        .success(function(data, status, headers, config){
		          vm.crews = data;
		        })
		        .error(function(data, status, headers, config){
		          vm.crews = [];
		        });		        
		};

		function addCrewCtrl($http, $state, addCrewUrl, broadcastUserFactory){
			var vm = this;
			vm.userdetails = broadcastUserFactory.userdetails;
			vm.crew = {};
			vm.crew.companyid = vm.userdetails.companyid;
			vm.crew.companyname = vm.userdetails.companyname;

			vm.addCrew = function(){
				console.log(vm.crew);
				$http.post(addCrewUrl, vm.crew)
			        .success(function(data, status, headers, config){
			        	$state.go("manager.crews");		
			        })
			        .error(function(data, status, headers, config){
			        	vm.error = data;
			        	console.log('error', vm.error);	        				        	
			        });
		    }
		};

		function crewShiftsCtrl($http, $location, $rootScope, getCrewShiftsUrl, upsertCrewShiftsUrl){
			console.log("crewShiftsCtrl");
			//initial call: get crew shifts based on crewid
			var vm = this;
			
	      	vm.crewid = $location.absUrl().split("/").pop();
	      	vm.shiftrecords = [];
	      	vm.shiftontable = {};
	      	vm.shifts = [];
	      	vm.error = "";
	      	vm.calopened = false;

	      	var generateEmptyShiftHours = function(){
	      		var _shifthours = [];	          		
	      		for(var i=0; i<7; i++){
	      			var ohours = {
		      			status: true,
		      			day: $rootScope.days[i],
		      			startwork: '',
		      			startbreak: '',
		      			finishbreak: '',
		      			finishwork: ''
		      		};
	      			_shifthours.push(ohours);
	      		}
	      		return _shifthours;
	      	}

		    var initShiftTable = function(){
		    	//this object here should get from object model	      	
		      	vm.shiftontable = {
		      		startdate: Date.now(),
		      		shifthours: generateEmptyShiftHours()
		      	}

		      	console.log('vm.shiftontable', vm.shiftontable);
		    }

		    var getShifts = function(){
		    	//call user data -> with id:param
			    $http.get(getCrewShiftsUrl+"/"+ vm.crewid)
			        .success(function(data, status, headers, config){
			        	vm.shifts = data;
			        	// console.log("whole data: " + data);

			        	angular.forEach(vm.shifts, function(item){				
			          		vm.shiftrecords.push(item.shifts[0]);	          	      			
			      		})
			          	vm.error = "";

			        	initShiftTable();
			        })
			        .error(function(data, status, headers, config){
			        	console.log('error get crewshifts data');	        	
			        	vm.shifts = [];
			        	vm.error = data;
			        });
		    }
	      	     		      
		    //function addShift
		    vm.addShift = function(){
		      	//post shift to service with ajax
		      	//validation process happens here as well
		      	//use $http instead!
		      	var data = {}; //this object here should get from object model	 
	            data.crewid = vm.crewid;
	            data.startdate = vm.shiftontable.startdate;
	            data.shifthours = vm.shiftontable.shifthours;

	            //console.log(data);
	            $http.post(upsertCrewShiftsUrl, data)
	            	.success(function(data, status, headers, config){
	            		//$scope.shifts
	            	})
	            	.error(function(data, status, headers, config){})
		    };

		    vm.resetRow = function(el){
		      	el.startwork = '';
	      		el.startbreak = '';
	      		el.finishbreak = '';
	      		el.finishwork = '';      	
		    };

	      	vm.populateTable = function(){
	      		console.log(vm.shiftontable);
	      		//$scope.shift = $scope.shifts.shift[0];

		      	// angular.forEach($scope.todo.items, function(item){
		      	// 	...
	    	  	// })
	      	};

	      	vm.openCalendar = function($event){
	      		$event.preventDefault();
	      		$event.stopPropagation();

	      		vm.calopened = !vm.calopened;
	      	}

	      	getShifts();
		};

		function crewCalendarCtrl($modal){
			var vm = this;
			var date = new Date();
		    var d = date.getDate();
		    var m = date.getMonth();
		    var y = date.getFullYear();

		    vm.newevent = {
		    	id:'',
		    	title: '',
		    	start: '',
		    	end: '',
		    	allDay: false
		    }

		    vm.events = [];

			vm.eventSource = {
		        url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
		        className: 'gcal-event',           // an option!
		        currentTimezone: 'America/Chicago' // an option!
		    };

		    /* alert on eventClick */
		    vm.alertOnEventClick = function( date, jsEvent, view){
		        vm.log += date.title + ' was clicked \n' ;

		    };

		    vm.alertOnDayClick = function( date, jsEvent, view){
		        var modalEvent = $modal.open({
			      templateUrl: 'myEventContent.html',
			      controller: 'modalEventCtrl',
			      size: 'sm',
			      resolve: {
			        items: function () {
			          return vm.newevent;
			        }
			      }
			    });

			    modalEvent.result.then(function (result) {
			      vm.newevent = result;
			      console.log('New event: ', vm.newevent);
			    }, function () {
			      console.log('New event: ', vm.newevent);
			    });
		    };

		    /* alert on Drop */
		    vm.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
		       vm.log = 'Event Droped to make dayDelta ' + delta;
		    };
		    /* alert on Resize */
		    vm.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
		       vm.log = 'Event Resized to make dayDelta ' + delta;
		    };

		    vm.popUpEvent = function($event){
	      		//pop up event dialog
	      	}

		    /* config object */
		   	vm.uiConfig = {
		      calendar:{
		        height: 450,
		        editable: true,
		        header:{
		          left: '',
		          center: 'title',
		          right: 'today prev,next'
		        },
		        eventClick: vm.alertOnEventClick,
		        eventDrop: vm.alertOnDrop,
		        eventResize: vm.alertOnResize,
		        eventRender: vm.eventRender,
		        dayClick: vm.alertOnDayClick
		      }
		    };

		    vm.crewCalendarSrc = [vm.events];
		}

		function modalEventCtrl($scope, $modalInstance, items) {
			$scope.newevent = items;

			$scope.openCalendar = function($event){
	      		$event.preventDefault();
	      		$event.stopPropagation();

	      		$scope.calopened = !$scope.calopened;
	      	}

	  		$scope.ok = function () {
	  			console.log("ok: " , $scope.newevent);
	    		$modalInstance.close($scope.newevent);
	  		};

		  	$scope.cancel = function () {
		    	$modalInstance.dismiss('cancel');
		  	};
		}


		function crewProfCtrl($http, $location, $state, getUserProfileUrl, updateUserProfileUrl, broadcastUserFactory){
			//console.log("crewProfCtrl");
			var vm = this;
			var userdetails = broadcastUserFactory.userdetails;

			vm.crewid = $location.absUrl().split("/").pop();
			if(vm.crewid=="" || vm.crewid==null) vm.crewid = userdetails.userid;
			vm.user = [];

			var getProfile = function(){
				
				$http.get(getUserProfileUrl+"/"+ vm.crewid)
			    	.success(function(data, status, headers, config){
			        	vm.user = data;
			        	//console.log("user data", vm.user);
			          	vm.error = "";
			        })
			        .error(function(data, status, headers, config){
			        	console.log('error get crew profile data');
			        	vm.user = [];
			        	vm.error = data;
			        });
			}

			vm.updateProfile = function(){
				console.log("updateProfile");
				$http.post(updateUserProfileUrl, vm.user)
			        .success(function(data, status, headers, config){
			        	$state.go("manager.crews");		
			        })
			        .error(function(data, status, headers, config){
			        	vm.error = data;
			        	console.log('error', vm.error);	        				        	
			        });
			}

			getProfile();
		};

		function reportsCtrl($scope){

		}
}());