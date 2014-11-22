'use strict';

angular
.module('EMSSQLDBMApp.services')
.factory('Backend', [ 'BackendExpress', 'BackendNative', function(be, bn) {

  if(typeof(require) !== 'undefined') {
    return bn;
  }
  return be;

}]);