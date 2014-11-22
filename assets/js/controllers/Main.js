'use strict';

angular
.module('EMSSQLDBMApp.controllers')
.controller('MainCtrl', [ '$scope', '$modal', 'Authentication', 'Backend', function($scope, $modal, Authentication, Backend) {

  $scope.authenticated = Authentication.isAuthenticated();
  $scope.user = {
    username: Authentication.getUsername() ? Authentication.getUsername() : '',
    password: ''
  };
  $scope.loading = false;

  var loadNames = function() {
    var tableNames = Backend.getTableNames();
    tableNames.on('row', function(row) {
      console.log(row);
    });
  };

  $scope.signIn = function() {
    $scope.loading = true;
    Authentication
      .signIn($scope.user.username, $scope.user.password)
      .then(function(authenticated) {
        $scope.authenticated = authenticated;
        loadNames();
        $scope.loading = false;
      })
      .catch(function(e) {
        $scope.loading = false;
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