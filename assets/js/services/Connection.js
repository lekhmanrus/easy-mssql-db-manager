'use strict';

angular
.module('EMSSQLDBMApp.services')
.service('Connection', [ 'MSSQL', function(sql) {

  var connection = { };  

  connection.config = require('./config/connection.json');

  connection.open = function(username, password, errorCb) {
    connection.config.user     = username;
    connection.config.password = password;
    connection.conn = new sql.Connection(connection.config);
    connection.conn.connectAsync()
    .catch(function(e) {
      errorCb(e);
    });
  };

  connection.get = function() {
    if(!connection.conn) {
      throw new Error("Not exists open connections.");
    }
    return connection.conn;
  };

  return connection;

}]);