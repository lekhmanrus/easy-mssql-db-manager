'use strict';

var express    = require('express'),
    path       = require('path'),
    bodyParser = require('body-parser');

var index = require('./api/index'),
    users = require('./api/users');

var app = express()
  .use(bodyParser.json())
  .use(express.static(path.join(__dirname, 'out')))
  .use('/', index)
  .use('/users', users)

  .use(function(req, res, next) {
    res.status = 404;
    //res.sendFile(path.join(__dirname, 'assets/404.html'));
  });

module.exports = app;
