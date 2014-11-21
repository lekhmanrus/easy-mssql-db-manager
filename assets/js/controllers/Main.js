'use strict';

angular
.module('EMSSQLDBMApp.controllers')
.controller('MainCtrl', [ '$scope', '$modal', 'Authentication', function($scope, $modal, Authentication) {

  $scope.authenticated = Authentication.isAuthenticated();
  $scope.user = {
    username: Authentication.getUsername() ? Authentication.getUsername() : '',
    password: ''
  };

  $scope.signIn = function() {
    Authentication.signIn(
      $scope.user.username, $scope.user.password, function(e) {
        $modal({
          title: 'Error',
          content: e.message,
          show: true
        });
      }, function(authenticated) {
        $scope.authenticated = authenticated;
      }
    );
  };
  
  $scope.signOut = function() {
    $scope.authenticated = Authentication.signOut();
    $scope.user.password = '';
  };

}]);