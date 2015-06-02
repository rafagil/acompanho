angular.module('Acompanho').controller('ConfirmDialogController', function($scope, $modalInstance, DialogService) {
	
	$scope.confirmMessage = DialogService.confirmMessage;
	
	$scope.ok = function() {
		$modalInstance.close();
	};
	
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
	
});