'use strict';

angular
.module('EMSSQLDBMApp.services')
.factory('Backend', [ '$injector', function($injector) {

  if(typeof(require) !== 'undefined') {
    return $injector.get('BackendNative');
  }
  return $injector.get('BackendExpress');

}]);