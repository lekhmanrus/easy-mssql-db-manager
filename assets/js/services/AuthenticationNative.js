'use strict';

angular
.module('EMSSQLDBMApp.services')
.service('AuthenticationNative', [ '$q', 'Connection', function($q, conn) {
  
  var authentication = { };

  authentication.authenticated = false;
  authentication.username = false;
  
  var asyncSignIn = function(username, password) {
    var deferred = $q.defer();
    if(!username) {
      throw new Error("Login is empty.");
    }
    if(!password) {
      throw new Error("Password is empty.");
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

  authentication.signIn = function(username, password) {
    return asyncSignIn(username, password);
  };

  authentication.signOut = function() {
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