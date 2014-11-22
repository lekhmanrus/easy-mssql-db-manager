#!/usr/bin/env node
'use strict';

var app = require('../app');
var httpPort = require('../package.json').httpPort || process.env.PORT || 3000;
app.set('port', httpPort);
var server = app.listen(app.get('port'), function() {
  console.log('Run http://localhost:' + server.address().port + '/');
});
