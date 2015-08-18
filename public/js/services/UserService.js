angular.module('AcompanhoServices').factory('UserService', function(Restangular) {
  'use strict';

  var service = {};

  service.getUser = function() {
    return Restangular.one('user').get();
  };

  return service;
});
