(function(){
	"use strict";

	angular.module('publicModule', [])
		.controller('profileCtrl', ['broadcastUserFactory', profileCtrl])
		.controller('crewProfileCtrl', ['broadcastUserFactory', crewProfileCtrl])
		 
		
		function profileCtrl(broadcastUserFactory){
			var vm = this;
			vm.userdetails = broadcastUserFactory.userdetails;
		};

		function crewProfileCtrl(broadcastUserFactory){
			var vm = this;
			vm.userdetails = broadcastUserFactory.userdetails;
		};

}());