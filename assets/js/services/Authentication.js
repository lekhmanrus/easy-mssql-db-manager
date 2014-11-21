'use strict';

angular
.module('EMSSQLDBMApp.services')
.factory('Authentication', [ 'AuthenticationExpress', 'AuthenticationNative', function(ae, an) {

  if(typeof(require) !== 'undefined') {
    return an;
  }
  return ae;

}]);