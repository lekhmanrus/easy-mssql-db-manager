'use strict';

angular
.module('EMSSQLDBMApp.services')
.service('BackendExpress', [ '$http', function($http) {

  return {
    dbQuery: function(query, onRowCb, onRecordSetCb, onDoneCb, onErrorCb) {

      $http.post('/query', { query: query })
      .success(function(data, status, headers, config) {
        console.log("success");
        console.log(data, status, headers, config);
      })
      .error(function(data, status, headers, config) {
        console.log("error");
        console.log(data, status, headers, config);
      });
    }
  };

}]);