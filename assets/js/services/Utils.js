'use strict';

angular
.module('EMSSQLDBMApp.services')
.service('Utils', [ function() {

  return {
    getInputType: function(dbType) {
      if(dbType == 'text' ||
         dbType == 'binary' ||
         dbType == 'varbinary' ||
         dbType == 'image' ||
         dbType == 'xml' ||
         dbType == 'ntext' ||
         dbType == 'geography' ||
         dbType == 'geometry') {
        return 'textarea';
      }
      else if(dbType == 'int' ||
              dbType == 'bigint' ||
              dbType == 'tinyint' ||
              dbType == 'smallint' ||
              dbType == 'float' ||
              dbType == 'numeric' ||
              dbType == 'decimal' ||
              dbType == 'real' ||
              dbType == 'uniqueidentifier' ||
              dbType == 'smallmoney' ||
              dbType == 'money') {
        return 'number';
      }
      else if(dbType == 'bit') {
        return 'checkbox';
      }
      else if(dbType == 'date' ||
              dbType == 'datetime' ||
              dbType == 'datetime2' ||
              dbType == 'datetimeoffset' ||
              dbType == 'smalldatetime' ||
              dbType == 'time' ||
              dbType == 'decimal' ||
              dbType == 'real' ||
              dbType == 'uniqueidentifier' ||
              dbType == 'smallmoney' ||
              dbType == 'money') {
        return 'date';
      }
      return 'text';
    },

    isExpress: function() {
      return typeof(require) === 'undefined';
    }
  };

}]);