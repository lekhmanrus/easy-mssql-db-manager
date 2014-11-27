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

  var clearTable = function() {
    $scope.table = {
      cols: [ ],
      rows: [ ],
      addCollapseState: -1,
      searchText: '',
      predicate: '',
      reverse: false,
      newRow: { },
      updRow: { }
    };
  };

  $scope.selectObject = function(type, obj) {
    try {
      $scope.deleteId = undefined;
      $scope.updateId = undefined;
      $scope.loading = true;
      $scope.curObject = {
        type: type,
        data: obj
      };
      clearTable();
      $scope.params = [ ];
      if(type === 'table' || type === 'view') {
        Backend.dbQuery("SELECT * FROM [" + obj.gist + "]", function(row) {
            $scope.table.rows.push(row);
          }, function(columns) {
            var buf = [ ];
            for(var i in columns) {
              var tmp = columns[i];
              tmp.inputType = Utils.getInputType(columns[i].type.declaration);
              buf.push(tmp);
              $scope.table.newRow[columns[i].name] = {
                type: tmp.inputType
              };
              $scope.table.updRow[columns[i].name] = {
                type: tmp.inputType
              };
            }
            $scope.table.cols = buf;
          }, function(ret) {
            $scope.loading = false;
            $timeout(angular.noop);
          }, function(err) {
            throw err;
          }
        );
      }
      else if(type === 'function' || type === 'procedure') {
        var q = "SELECT [PARAMETER_NAME], [DATA_TYPE] ";
        q += "FROM [INFORMATION_SCHEMA].[PARAMETERS] ";
        q += "WHERE [SPECIFIC_NAME] = '" + obj.gist + "';"
        Backend.dbQuery(q, function(row) {
            row.inputType = Utils.getInputType(row.DATA_TYPE);
            row.name = row.PARAMETER_NAME.substring(1);
            $scope.params.push(row);
          }, null, function(ret) {
            $scope.loading = false;
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

  $scope.execProc = function() {
    try {
      $scope.loading = true;
      clearTable();
      var rowCb = function(row) {
        $scope.table.rows.push(row);
      };
      var recordSetCb = function(columns) {
        var buf = [ ];
        for(var i in columns) {
          var tmp = columns[i];
          tmp.inputType = Utils.getInputType(columns[i].type.declaration);
          buf.push(tmp);
          $scope.table.newRow[columns[i].name] = {
            type: tmp.inputType
          };
          $scope.table.updRow[columns[i].name] = {
            type: tmp.inputType
          };
        }
        $scope.table.cols = buf;
      };
      var doneCb = function(ret) {
        $scope.loading = false;
        $timeout(angular.noop);
      };
      var errorCb = function(err) {
        throw err;
      };
      if($scope.curObject.type == 'procedure') {
        Backend.dbExec(
          $scope.curObject.data.gist,
          angular.copy($scope.params),
          rowCb,
          recordSetCb,
          doneCb,
          errorCb
        );
      }
      else if($scope.curObject.type == 'function') {
        Backend.dbFuncCall(
          $scope.curObject.data.gist,
          angular.copy($scope.params),
          rowCb,
          recordSetCb,
          doneCb,
          errorCb
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
    Backend.dbInsert($scope.curObject.data.gist, angular.copy($scope.table.newRow), function() {
      refresh();
    }, function(e) {
      refresh();
      showError(e.message);
    });
  };

  $scope.showModalDeleteRow = function(id) {
    $scope.deleteId = id;
    $modal({
      scope: $scope,
      template: 'partials/modal/delete-row.html',
      show: true
    });
  };

  $scope.deleteRow = function(id) {
    var del = id;
    if(!del) {
      del = $scope.deleteId;
    }
    $scope.loading = true;
    Backend.dbDelete($scope.curObject.data.gist, del, function() {
      refresh();
    }, function(e) {
      refresh();
      showError(e.message);
    });
  };

  $scope.showModalUpdateRow = function(id, row) {
    $scope.updateId = id;
    var b = angular.copy(row);
    for(var key in b) {
      $scope.table.updRow[key].val = b[key];
    }
    $modal({
      scope: $scope,
      template: 'partials/modal/update-row.html',
      show: true
    });
  };

  $scope.updateRow = function(id) {
    var upd = id;
    if(!upd) {
      upd = $scope.updateId;
    }
    $scope.loading = true;
    Backend.dbUpdate($scope.curObject.data.gist, upd, $scope.table.updRow, function() {
      refresh();
    }, function(e) {
      refresh();
      showError(e.message);
    });
  };

  $scope.clearUpdateForm = function() {
    angular.forEach($scope.table.updRow, function(value, key) {
      $scope.table.updRow[key].val = '';
    });
  };

  if(typeof(require) === 'undefined') {
    Config.get({ type: 'express-connection' }, function(config) {
      Authentication.signIn(config.user, config.password)
        .catch(function(e) {
          showError(e.message)
        });
    });
  }

  $scope.signIn = function() {
    $scope.loading = true;
    Authentication
      .signIn($scope.user.username, $scope.user.password)
      .then(function(authenticated) {
        $scope.authenticated = authenticated;
        loadNames();
        $scope.loading = false;
        $scope.permissions = Authentication.getPermission();
        console.log($scope.permissions);
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