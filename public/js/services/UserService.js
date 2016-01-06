angular.module('AcompanhoServices').factory('UserService', ['Restangular', function(Restangular) {
  'use strict';

  var service = {};

  service.getUser = function() {
    return Restangular.one('user').get();
  };

  return service;
}]);
