'use strict';

angular
.module('EMSSQLDBMApp.services')
.service('AuthenticationNative', [ '$q', 'Connection', function($q, conn) {
  
  var authentication = { 
    authenticated: false,
    username: false
  };

  authentication.signIn = function(username, password) {
    var deferred = $q.defer();
    if(!username) {
      deferred.reject(new Error("Login is empty."));
    }
    if(!password) {
      deferred.reject(new Error("Password is empty."));
    }
    conn
      .open(username, password)
      .then(function() {
        authentication.authenticated = true;
        authentication.username = username;
        deferred.resolve(authentication.authenticated);
      })
      .catch(function(e) {
        deferred.reject(e);
      });
    return deferred.promise;
  };

  authentication.signOut = function() {
    conn.close();
    authentication.authenticated = false;
    return authentication.authenticated;
  };

  authentication.isAuthenticated = function() {
    return authentication.authenticated;
  };

  authentication.getUsername = function() {
    return authentication.username;
  };

  return authentication;

}]);