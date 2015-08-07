angular.module('Acompanho').factory('loginInterceptor', function($location, $q) {
  var interceptor = {};

  interceptor.responseError = function(response) {
    if (response.status == 401) {
      //$location.path('/login');
      window.location = '/login';
    }
    return $q.reject(response);
  };

  return interceptor;
});
