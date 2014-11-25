'use strict';

angular
.module('EMSSQLDBMApp.services')
.service('BackendNative', [ 'Connection', function(conn) {

  var backend = { };

  backend.dbQuery = function(query, onRowCb, onRecordSetCb, onDoneCb, onErrorCb) {
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
  };

  backend.dbInsert = function(table, obj, doneCb, errorCb) {
    var q = "INSERT INTO [" + table + "] ",
        p = "",
        v = "";
    for(var index in obj) {
      p += "[" + index +"],";
      v += "'" + obj[index] + "',";
    }
    q += "(" + p.substring(0, p.length - 1) + ") ";
    q += "VALUES (" + v.substring(0, v.length - 1) + ");";
    return backend.dbQuery(q, null, null, doneCb, errorCb);
  };

  return backend;

}]);