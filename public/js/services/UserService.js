angular.module('Acompanho').factory('UserService', function($http) {
  return {
    getUser: function() {
      return $http.get('/user').then(function(response) {
        return response.data;
      });
    }
  };
});
