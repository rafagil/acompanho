angular.module('AcompanhoServices').factory('DialogService', ['$modal', '$q', function($modal, $q) {
  'use strict';
  var service = {};

  service.showConfirmDialog = function(message) {
    var d = $q.defer();
    this.confirmMessage = message;
    var modalInstance = $modal.open({
      templateUrl: 'partials/confirm_dialog.html',
      controller: 'ConfirmDialogController',
      animation: true
    });

    modalInstance.result.then(function() {
      d.resolve();
    });

    return d.promise;
  };

  return service;
}]);
