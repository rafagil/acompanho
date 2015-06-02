angular.module('Acompanho').controller('FeedDetailController', function($scope, $routeParams, $location, FeedService, DialogService) {

	if (FeedService.ready) {
		$scope.editFeed = FeedService.getFeedById($routeParams.feedId);
	} else {
		FeedService.findFeeds(function() {
			$scope.editFeed = FeedService.getFeedById($routeParams.feedId);
		});
	}
	
	$scope.save = function() {
		FeedService.updateFeed($scope.editFeed,function() {
			$location.path('/list/' + $scope.editFeed._id);
		}, function(e) {
			alert(e);
		});
	};
	
	$scope.cancel = function() {
		FeedService.findFeeds(function() {
			$location.path('/list/' + $scope.editFeed._id);
		});
	};
	
	$scope.delete = function() {
		var message = "Deseja realmente excluir o feed " + $scope.editFeed.title + "?";
		DialogService.showConfirmDialog(message, function() {
			FeedService.deleteFeed($scope.editFeed, function() {
				$location.path('/');
			});
		});
	};
});