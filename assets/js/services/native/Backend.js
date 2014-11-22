'use strict';

angular
.module('EMSSQLDBMApp.services')
.service('BackendNative', [ 'Connection', function(conn) {
  
  return {
    getTableNames: function() {
      return conn.request('select * from Sex');
    }
  };

}]);