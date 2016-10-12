'use strict';

angular.module('ripple-ui')
  .factory('UserService', function ($http) {

    var findCurrentUser = function () {
       return $http.get('/api/user');
    };

    var logout = function () {
      return $http.get('/api/logout');
    };

    return {
      findCurrentUser: findCurrentUser,
      logout: logout
    };
  });
