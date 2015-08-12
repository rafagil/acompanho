angular.module('Acompanho').factory('ResponseStatusInterceptorService', function($q) {
  'use strict';
  var interceptor = {};

  interceptor.responseError = function(response) {
    if (response.status === 401) {
      window.location = '/login';
    } else if (response.status === 500) {
      var msg = 'Ocorreu um erro';
      if (response.data.error) {
        msg += ': ' + response.data.error;
      }
      alert(msg + '.');
    } else if (response.status === 404) {
      console.log('Not found');
    }
    return $q.reject(response);
  };

  return interceptor;
});
