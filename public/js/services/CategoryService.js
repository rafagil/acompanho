angular.module('AcompanhoServices').factory('CategoryService', function(Restangular) {
  'use strict';
  var service = {};

  service.list = function() {
    return Restangular.all('categories').getList();
  };

  service.listWithFeeds = function() {
    return Restangular.all('categories').getList({feeds: true});
  };

  service.add = function(categoryName) {
    return Restangular.all('categories').post({name: categoryName});
  };

  return service;
});
