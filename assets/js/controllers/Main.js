'use strict';

angular
.module('EMSSQLDBMApp.controllers')
.controller('MainCtrl', [ '$scope', '$timeout', '$modal', 'Authentication', 'Backend', 'Config', function($scope, $timeout, $modal, Authentication, Backend, Config) {

  $scope.authenticated = Authentication.isAuthenticated();
  $scope.user = {
    username: Authentication.getUsername() ? Authentication.getUsername() : '',
    password: ''
  };
  $scope.loading = false;
  $scope.curObject = undefined;
  $scope.objects = [ ];
  $scope.activePanel = 0;
  $scope.table = { };
  $scope.predicate = '';
  $scope.reverse = false;

  var loadNames = function() {
    Config.query({ type: 'table' }, function(tables) {
      $scope.objects.push({
        name: 'Tables',
        type: 'table',
        data: tables
      });
    });
    Config.query({ type: 'view' }, function(views) {
      $scope.objects.push({
        name: 'Views',
        type: 'view',
        data: views
      });
    });
    Config.query({ type: 'procedure' }, function(procedures) {
      $scope.objects.push({
        name: 'Procedures',
        type: 'procedure',
        data: procedures
      });
    });
    Config.query({ type: 'function' }, function(functions) {
      $scope.objects.push({
        name: 'Functions',
        type: 'function',
        data: functions
      });
    });
  };

  $scope.sortBy = function(predicate) {
    if($scope.predicate == predicate) {
      $scope.reverse = !$scope.reverse;
    }
    else {
      $scope.predicate = predicate;
    }
  };

  $scope.selectObject = function(type, obj) {
    try {
      $scope.loading = true;
      $scope.curObject = {
        type: type,
        data: obj
      };
      console.log(Authentication.getPermission());
      if(type === 'table' || type === 'view') {
        $scope.table.cols = [ ];
        $scope.table.rows = [ ];
        Backend.dbQuery("SELECT * FROM [" + obj.gist + "]", function(row) {
            $scope.table.rows.push(row);
          }, function(columns) {
            var buf = [ ];
            for(var i in columns) {
              buf.push(columns[i]);
            }
            $scope.table.cols = buf;
          }, function(ret) {
            $scope.loading = false;
            console.log($scope.table);
            $timeout(angular.noop);
          }, function(err) {
            throw err;
          }
        );
      }
    }
    catch(e) {
      $scope.loading = false;
      $modal({
        title: 'Error',
        content: e.message,
        show: true
      });
    };
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