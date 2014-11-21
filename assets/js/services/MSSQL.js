'use strict';

angular
.module('EMSSQLDBMApp.services')
.service('MSSQL', [ function() {

  var sql = require('mssql'),
      Promise = require("bluebird");
  Promise.promisifyAll(sql);

  return sql;

}]);
