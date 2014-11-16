'use strict';

angular.module('EMSSQLDBMApp.controllers', [ ]);
angular.module('EMSSQLDBMApp.directives', [ ]);
angular.module('EMSSQLDBMApp.services', [ ]);

angular
.module('EMSSQLDBMApp', [
  'EMSSQLDBMApp.controllers',
  'EMSSQLDBMApp.directives',
  'EMSSQLDBMApp.services',
  'mgcrea.ngStrap',
  'ngAnimate'
])

.config(function($modalProvider) {
  angular.extend($modalProvider.defaults, {
    animation: 'am-fade-and-scale'
  });
})

.run([function() {

  /*var sql = require('mssql'); 
  var config = {
      user: 'Admin',
      password: 'pwd123^7',
      server: 'COMP-PC', // You can use 'localhost\\instance' to connect to named instance
      database: 'BuildingOrganization',
      stream: true, // You can enable streaming globally

      options: {
          encrypt: true // Use this if you're on Windows Azure
      }
  };

  var connection = new sql.Connection(config);
  connection.connect(function(err) {
      // ... error checks

      var request = new sql.Request();
      request.stream = true; // You can set streaming differently for each request
      request.query('select * from Sex'); // or request.execute(procedure);

      request.on('recordset', function(columns) {
          // Emitted once for each recordset in a query
      });

      request.on('row', function(row) {
        console.log("row");
        console.log(row);
          // Emitted for each row in a recordset
      });

      request.on('error', function(err) {
        console.log("err");
        console.log(err);
          // May be emitted multiple times
      });

      request.on('done', function(returnValue) {
        console.log("returnValue");
        console.log(returnValue);
          // Always emitted as the last one
      });
  });*/

}]);
