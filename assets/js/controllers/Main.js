'use strict';

angular
.module('EMSSQLDBMApp.controllers')
.controller('MainCtrl', [ '$scope', '$timeout', '$modal', 'Authentication', 'Backend', 'Config', 'Utils', function($scope, $timeout, $modal, Authentication, Backend, Config, Utils) {

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

  var showError = function(message) {
    $modal({
      title: 'Error',
      content: message,
      show: true
    });
  };

  var refresh = function() {
    $scope.selectObject($scope.curObject.type, $scope.curObject.data);
  };

  $scope.sortBy = function(predicate) {
    if($scope.table.predicate == predicate) {
      $scope.table.reverse = !$scope.table.reverse;
    }
    else {
      $scope.table.predicate = predicate;
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
        $scope.table = {
          cols: [ ],
          rows: [ ],
          addCollapseState: -1,
          searchText: '',
          predicate: '',
          reverse: false,
          newRow: { }
        };
        Backend.dbQuery("SELECT * FROM [" + obj.gist + "]", function(row) {
            $scope.table.rows.push(row);
          }, function(columns) {
            var buf = [ ];
            for(var i in columns) {
              var tmp = columns[i];
              tmp.inputType = Utils.getInputType(columns[i].type.declaration);
              buf.push(tmp);
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
      showError(e.message);
    };
  };

  $scope.addNewRow = function() {
    $scope.loading = true;
    Backend.dbInsert($scope.curObject.data.gist, $scope.table.newRow, function(a, e) {
      refresh();
    }, function(e) {
      refresh();
      showError(e.message);
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
        showError(e.message)
      });
  };

  $scope.signOut = function() {
    $scope.authenticated = Authentication.signOut();
    $scope.user.password = '';
  };

}]);