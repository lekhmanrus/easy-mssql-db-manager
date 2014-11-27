'use strict';

angular
.module('EMSSQLDBMApp.services')
.service('BackendExpress', [ '$filter', '$http', function($filter, $http) {

  var backend = { };

  backend.dbQuery = function(query, onRowCb, onRecordSetCb, onDoneCb, onErrorCb) {
    $http.post('/query', { query: query })
    .success(function(data) {
      if(data.error && onErrorCb) {
        onErrorCb(data.error);
      }
      if(data.row && onRowCb) {
        for(var r in data.row) {
          onRowCb(data.row[r]);
        }
      }
      if(data.recordset && onRecordSetCb) {
        onRecordSetCb(data.recordset);
      }
      if(data.done.status && onDoneCb) {
        onDoneCb(data.done.val);
      }
    })
    .error(function() {
      if(onErrorCb) {
        onErrorCb(new Error("Connection error. Try again."));
      }
    });
  };

  backend.dbInsert = function(table, obj, doneCb, errorCb) {
    var q = "INSERT INTO [" + table + "] ",
        p = "",
        v = "";
    for(var index in obj) {
      p += "[" + index +"],";
      v += "'";
      if(obj[index].type == 'date') {
        v += $filter('date')(obj[index].val, "dd/MM/yyyy");
      }
      else {
        v += obj[index].val;
      }
      v += "',";
    }
    q += "(" + p.substring(0, p.length - 1) + ") ";
    q += "VALUES (" + v.substring(0, v.length - 1) + ");";
    return backend.dbQuery(q, null, null, doneCb, errorCb);
  };

  backend.dbDelete = function(table, id, doneCb, errorCb) {
    var q = "DELETE FROM [" + table + "] WHERE [id] = '" + id + "';";
    return backend.dbQuery(q, null, null, doneCb, errorCb);
  };

  backend.dbUpdate = function(table, id, obj, doneCb, errorCb) {
    var q = "UPDATE [" + table + "] SET ",
        v = "",
        f = false;
    for(var index in obj) {
      if(obj[index].val != null) {
        v += "[" + index + "] = '";
        if(obj[index].type == 'date') {
          v += $filter('date')(obj[index].val, "MM/dd/yyyy");
        }
        else {
          v += obj[index].val;
        }
        v += "',";
        f = true;
      }
    }
    if(f) {
      q += v.substring(0, v.length - 1) + " WHERE [id] = '" + id + "';";
      return backend.dbQuery(q, null, null, doneCb, errorCb);
    }
    else {
      errorCb(new Error("No data for update."));
    }
  };

  backend.dbExec = function(proc, params, rowCb, recordSetCb, doneCb, errorCb) {
    var q = "EXECUTE [" + proc + "] ",
        v = "";
    for(var index in params) {
      if(params[index].val == null) {
        v += "NULL,";
      }
      else if(params[index].inputType === 'date') {
        v += "'" + $filter('date')(params[index].val, "MM/dd/yyyy") + "',";
      }
      else {
        v += "'" + params[index].val + "',";
      }
    }
    q += v.substring(0, v.length - 1) + ";";
    return backend.dbQuery(q, rowCb, recordSetCb, doneCb, errorCb);
  };

  backend.dbFuncCall = function(func, params, rowCb, recordSetCb, doneCb, errorCb) {
    var q = "SELECT * FROM " + func,
        v = "";
    for(var index in params) {
      if(params[index].val == null) {
        v += "NULL,";
      }
      else if(params[index].inputType === 'date') {
        v += "'" + $filter('date')(params[index].val, "MM/dd/yyyy") + "',";
      }
      else {
        v += "'" + params[index].val + "',";
      }
    }
    q += " (" + v.substring(0, v.length - 1) + ");";
    return backend.dbQuery(q, rowCb, recordSetCb, doneCb, errorCb);
  };
  
  return backend;

}]);