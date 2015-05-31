angular.module('Acompanho').controller('NewFeedController', function($scope, $modalInstance) {
	
	$scope.ok = function() {
		$modalInstance.close($scope.newUrl);
	};
	
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
	
});