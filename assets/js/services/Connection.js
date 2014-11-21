'use strict';

angular
.module('EMSSQLDBMApp.services')
.service('Connection', [ function() {

  var connection = { };  
  connection.config = require('./config/connection.json');

  connection.open = function(username, password) {
    connection.config.user     = username;
    connection.config.password = password;
  };


}]);