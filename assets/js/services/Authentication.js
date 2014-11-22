'use strict';

angular
.module('EMSSQLDBMApp.services')
.factory('Authentication', [ '$injector', function($injector) {

  if(typeof(require) !== 'undefined') {
    return $injector.get('AuthenticationNative');
  }
  return $injector.get('AuthenticationExpress');

}]);