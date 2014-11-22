'use strict';

angular
.module('EMSSQLDBMApp.services')
.factory('Config', [ '$resource', function($resource) {

  return $resource('config/:type.json');

}]);