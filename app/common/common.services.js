/**
 * Created by daniel on 9/12/2014.
 */
(function () {
    "use strict"

    angular.module("common.services", [])
        .factory('broadcastUserFactory', function($rootScope){
            var userService = {};

            userService.username = "";

            userService.prepForBroadcast = function(userdetails){
                this.userdetails = userdetails;
                this.broadcastItem();
            }

            userService.broadcastItem = function(){
                $rootScope.$broadcast('userdetailsUpdated');
            }

            return userService;
        })
}());
