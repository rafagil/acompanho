angular.module('AcompanhoServices').factory('DialogService', function($modal) {
  'use strict';
  var service = {};

  service.showConfirmDialog = function(message, onOK) {
    this.confirmMessage = message;
    var modalInstance = $modal.open({
      templateUrl: 'partials/confirm_dialog.html',
      controller: 'ConfirmDialogController',
      animation: true
    });

    modalInstance.result.then(onOK);
  };

  return service;
});
