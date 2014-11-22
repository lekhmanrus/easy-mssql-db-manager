'use strict';

angular
.module('EMSSQLDBMApp.directives')
.directive('inputPassword', [function() {
  return {
    restrict: 'E',
    scope: {
      passwordModel: '=ngModel',
      passwordDisabled: '=ngDisabled'
    },
    templateUrl: 'partials/directives/inputPassword.html',
    link: function(scope, elm) {
      elm.find('button').on('mousedown', function() {
        elm.find('input').attr('type', 'text');
      });
      elm.find('button').on('mouseup', function() {
        elm.find('input').attr('type', 'password');
      });
    }
  }
}])