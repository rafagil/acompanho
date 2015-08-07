angular.module('Acompanho').controller('FeedDetailController', function($scope, $stateParams, $state, FeedService, DialogService) {

	if (FeedService.ready) {
		$scope.editFeed = FeedService.getFeedById($stateParams.feedId);
	} else {
		FeedService.findFeeds(function() {
			$scope.editFeed = FeedService.getFeedById($stateParams.feedId);
		});
	}

	$scope.save = function() {
		FeedService.updateFeed($scope.editFeed,function() {
			$state.go('feeds.list', {feedId: $scope.editFeed._id});
		}, function(e) {
			alert(e);
		});
	};

	$scope.cancel = function() {
		FeedService.findFeeds(function() {
			$state.go('feeds.list', {feedId: $scope.editFeed._id});
		});
	};

	$scope.delete = function() {
		var message = "Deseja realmente excluir o feed " + $scope.editFeed.title + "?";
		DialogService.showConfirmDialog(message, function() {
			FeedService.deleteFeed($scope.editFeed, function() {
				$state.go('feeds');
			});
		});
	};
});
