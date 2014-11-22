'use strict';

angular
.module('EMSSQLDBMApp.controllers')
.controller('MainCtrl', [ '$scope', '$modal', 'Authentication', 'Backend', function($scope, $modal, Authentication, Backend) {

  $scope.authenticated = Authentication.isAuthenticated();
  $scope.user = {
    username: Authentication.getUsername() ? Authentication.getUsername() : '',
    password: ''
  };

  var loadNames = function() {
    var tableNames = Backend.getTableNames();
    tableNames.on('row', function(row) {
      console.log(row);
    });
  };

  $scope.signIn = function() {
    Authentication
      .signIn($scope.user.username, $scope.user.password)
      .then(function(authenticated) {
        $scope.authenticated = authenticated;
        loadNames();
      })
      .catch(function(e) {
        $modal({
          title: 'Error',
          content: e.message,
          show: true
        });
      });
  };

  $scope.signOut = function() {
    $scope.authenticated = Authentication.signOut();
    $scope.user.password = '';
  };

}]);