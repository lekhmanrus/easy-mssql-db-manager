'use strict';

var mssql = require('mssql'),
    express = require('express'),
    router  = express.Router();

module.exports = function(connection) {
  router.post('/', function(req, res) {
    var q = req.body.query,
        f = false,
        request = mssql.Request(connection),
        ret = { };
    //console.log(this);
    //console.log("---------");
    request.query(q);
    request.on('row', function(row) {
      ret.row = row;
    });
    request.on('recordset', function(columns) {
      ret.recordset = columns;
    });
    request.on('done', function(returnValue) {
      ret.done = returnValue;
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
