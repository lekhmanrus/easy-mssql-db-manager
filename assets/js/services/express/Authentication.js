'use strict';

angular
.module('EMSSQLDBMApp.services')
.service('AuthenticationExpress', [ '$q', 'Backend', function($q, backend) {

  var authentication = { 
    authenticated: false,
    username: false,
    permissions: [ ]
  };

  authentication.signIn = function(username, password) {
    var deferred = $q.defer();
    if(!username) {
      deferred.reject(new Error("Login is empty."));
    }
    if(!password) {
      deferred.reject(new Error("Password is empty."));
    }
    var q = "SELECT [p].[permission_name] ";
    q += "FROM [sys].[database_principals] [dp] ";
    q += "INNER JOIN [sys].[database_role_members] [drm] ON [drm].[member_principal_id] = [dp].[principal_id] ";
    q += "INNER JOIN [sys].[database_permissions] [p] ON [p].[grantee_principal_id] = [drm].[role_principal_id] ";
    q += "WHERE [dp].[name] = '" + username + "';";
    backend.dbQuery(q, function(row) {
        authentication.permissions.push(row.permission_name);
      }, null, function(res) {
        authentication.authenticated = true;
        authentication.username = username;
        deferred.resolve(authentication.authenticated);
      }, function(err) {
        deferred.reject(err);
      }
    );
    return deferred.promise;
  };

  authentication.signOut = function() {
    authentication.authenticated = false;
    authentication.permissions = [ ];
    return authentication.authenticated;
  };

  authentication.isAuthenticated = function() {
    return authentication.authenticated;
  };

  authentication.getUsername = function() {
    return authentication.username;
  };

  authentication.getPermission = function() {
    return authentication.permissions;
  };

  return authentication;

}]);