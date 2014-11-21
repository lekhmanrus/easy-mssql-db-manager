'use strict';

angular
.module('EMSSQLDBMApp.services')
.service('AuthenticationNative', [ 'Connection', function(conn) {
  
  var authentication = { };

  authentication.authenticated = false;
  authentication.username = false;
  
  authentication.signIn = function(username, password, errorCb, doneCb) {
    if(!username) {
      errorCb(new Error("Login is empty."));
      return false;
    }
    if(!password) {
      errorCb(new Error("Password is empty."));
      return false;
    }
    conn.open(username, password, function(err) {
      if(err) {
        errorCb(err);
        return false;
      }
      authentication.authenticated = true;
      authentication.username = username;
      doneCb(authentication.authenticated);
    });
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