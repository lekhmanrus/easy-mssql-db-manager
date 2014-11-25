'use strict';

angular
.module('EMSSQLDBMApp.services')
.service('BackendExpress', [ function() {

  return {
    /*dbQuery: function(query, onRowCb, onRecordSetCb, onDoneCb, onErrorCb) {
      var res = conn.request(query);
      if(onRowCb) {
        res.on('row', onRowCb);
      }
      if(onRecordSetCb) {
        res.on('recordset', onRecordSetCb);
      }
      if(onDoneCb) {
        res.on('done', onDoneCb);
      }
      if(onErrorCb) {
        res.on('error', onErrorCb);
      }
      return res;
    }*/
  };

}]);