'use strict';

var mssql = require('mssql'),
    express = require('express'),
    router  = express.Router();

module.exports = function(connection) {
  router.post('/', function(req, res) {
    var q = req.body.query,
        f = false,
        request = new mssql.Request(connection);
    var ret = {
      row: [ ],
      recordset: undefined,
      done: {
        status: undefined,
        val: undefined
      },
      error: undefined
    };
    request.query(q);
    request.on('row', function(row) {
      ret.row.push(row);
    });
    request.on('recordset', function(columns) {
      ret.recordset = columns;
      for(var i in columns) {
        if(columns[i].type) {
          ret.recordset[i].type = {
            declaration: columns[i].type.declaration
          };
        }
        else {
          ret.recordset[i].type.declaration = "";
        }
      }
    });
    request.on('done', function(returnValue) {
      ret.done.status = true;
      ret.done.val = returnValue;
      if(!f) {
        res.json(ret);
        f = true;
      }
    });
    request.on('error', function(err) {
      ret.error = err;
      if(!f) {
        res.json(ret);
        f = true;
      }
    });
  });
  return router;
};
