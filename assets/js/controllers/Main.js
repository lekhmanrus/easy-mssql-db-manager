'use strict';

angular
.module('EMSSQLDBMApp.controllers')
.controller('MainCtrl', [ '$scope', '$modal', 'Authentication', function($scope, $modal, Authentication) {

  console.log(Authentication.getMethodName());

  $scope.authenticated = Authentication.isAuthenticated();
  $scope.user = {
    username: Authentication.getUsername() ? Authentication.getUsername() : '',
    password: ''
  };

  $scope.signIn = function() {
    if(!$scope.user.username) {
      $modal({
        title: 'Error',
        content: 'Login is empty.',
        show: true
      });
      return false;
    }
    if(!$scope.user.password) {
      $modal({
        title: 'Error',
        content: 'Password is empty.',
        show: true
      });
      return false;
    }
    $scope.authenticated = Authentication.signIn($scope.user.username, $scope.user.password);
    if(!$scope.authenticated) {
      $modal({
        title: 'Error',
        content: 'Login or password is incorrect. Check it and try again',
        show: true
      });
      return false;
    }
    $scope.user.username = Authentication.getUsername();
  };
  
  $scope.signOut = function() {
    $scope.authenticated = Authentication.signOut();
    $scope.user.password = '';
  };

}]);