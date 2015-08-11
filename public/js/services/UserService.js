angular.module('Acompanho').factory('UserService', function($http) {
  'use strict';

  var service = {};

  service.getUser = function() {
    return $http.get('/user').then(function(response) {
      return response.data;
    });
  };

  return service;
});
