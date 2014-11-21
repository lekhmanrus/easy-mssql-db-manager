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
    try {
      Authentication.signIn($scope.user.username, $scope.user.password);
    }
    catch(e) {
      $modal({
        title: 'Error',
        content: e.message,
        show: true
      });
    };
  };
  
  $scope.signOut = function() {
    $scope.authenticated = Authentication.signOut();
    $scope.user.password = '';
  };

}]);