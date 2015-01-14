(function(){
  "use strict";

	angular.module('crewModule', [])		
	 .factory('appFactory4', function(){
        var username = "Bongo";

        this.getBongoname = function(){
          return username;
        }
        
        return this;
      })
    .controller('crewCtrl', ['$http', function(){}])
}());