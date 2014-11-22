'use strict';

angular
.module('EMSSQLDBMApp.services')
.service('Connection', [ '$q', function($q) {

  var sql = require('mssql'),
      connection = { };  

  connection.config = require('./config/connection.json');

  connection.open = function(username, password) {
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

  connection.close = function() {
    if(!connection.conn) {
      throw new Error("Not exists open connections.");
    }
    connection.conn.close();
  };

  connection.getSql = function() {
    return sql;
  };

  connection.get = function() {
    if(!connection.conn) {
      throw new Error("Not exists open connections.");
    }
    return connection.conn;
  };

  connection.request = function(q) {
    var request = new sql.Request(conn.get());
    request.query(q);
    return request;
  };

  return connection;

}]);