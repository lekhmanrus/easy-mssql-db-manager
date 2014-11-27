'use strict';

var express = require('express'),
    app   = express(),
    path  = require('path'),
    mssql = require('mssql'),
    bodyParser = require('body-parser'),
    connectCfg = require('./out/config/express-connection.json'),
    connection = new mssql.Connection(connectCfg);

connection.connect(function(err) {
  if(err) {
    throw err;
  }

  var query = require('./api/query'),
      users = require('./api/users');

  app
    .use(bodyParser.json())
    .use(express.static(path.join(__dirname, 'out')))
    .use('/query', query(connection))
    .use('/users', users(connection))

    .use(function(req, res, next) {
      res.status = 404;
      //res.sendFile(path.join(__dirname, 'assets/404.html'));
    });

});

module.exports = app;
