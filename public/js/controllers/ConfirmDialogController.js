angular.module('Acompanho').controller('ConfirmDialogController', [
  '$scope',
  '$modalInstance',
  'DialogService',
  function($scope, $modalInstance, DialogService) {
		'use strict';
		
    $scope.confirmMessage = DialogService.confirmMessage;

    $scope.ok = function() {
      $modalInstance.close();
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  }
]);
