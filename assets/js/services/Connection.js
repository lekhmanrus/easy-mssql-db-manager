'use strict';

angular
.module('EMSSQLDBMApp.services')
.service('Connection', [ '$q', function($q) {

  var sql = require('mssql'),
      connection = { };  

  connection.config = require('./config/connection.json');

  var asyncOpen = function(username, password) {
    var deferred = $q.defer();
    connection.config.user     = username;
    connection.config.password = password;
    connection.conn = new sql.Connection(connection.config);
    connection.conn.connect(function(err) {
      if(err) {
        deferred.reject(err);
      }
      deferred.resolve();
    });
    return deferred.promise;
  };

  connection.open = function(username, password) {
    return asyncOpen(username, password);
  };

  connection.get = function() {
    if(!connection.conn) {
      throw new Error("Not exists open connections.");
    }
    return connection.conn;
  };

  return connection;

}]);