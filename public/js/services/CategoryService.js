angular.module('Acompanho').factory('CategoryService', function($http) {
  'use strict';
  var service = {};

  service.list = function() {
    return $http.get('/categories').then(function(response) {
      return response.data;
    });
  };

  service.listWithFeeds = function() {
    return $http.get('/categories?feeds=true').then(function(response) {
      return response.data;
    });
  };

  service.add = function(categoryName) {
    return $http.post('/categories', {name: categoryName}).then(function(response) {
      return response.data;
    });
  };

  return service;
});
