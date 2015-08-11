angular.module('Acompanho').factory('CategoryService', function($http) {
  'use strict';
  var service = {};

  service.list = function() {
    return $http.get('/categories').then(function(response) {
      return response.data;
    });
  };

  return service;
});
