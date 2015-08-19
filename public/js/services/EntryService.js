angular.module('AcompanhoServices').factory('EntryService', function(Restangular) {
  'use strict';

  var service = {};

  service.find = function(entryId, read) {
    return Restangular.one('entries', entryId).get({
      read: read
    });
  };

  return service;
});
