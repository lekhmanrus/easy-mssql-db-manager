'use strict';

angular
.module('EMSSQLDBMApp.services')
.service('AuthenticationExpress', [ function() {

  var authentication = { 
    authenticated: false,
    username: false
  };

  authentication.signIn = function(username, password) {
    authentication.authenticated = true;
    authentication.username = username;
    return authentication.authenticated;
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