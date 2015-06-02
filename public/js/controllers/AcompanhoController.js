angular.module('Acompanho').controller('AcompanhoController', function($scope, $modal, FeedService) {
	
	var TIMEOUT = 1000;
	
	$scope.updateAll = function() {
		FeedService.updateAll();
	};
	
	$scope.addFeed = function() {

		var modalInstance = $modal.open({
			templateUrl: 'partials/new_feed.html',
			controller: 'NewFeedController',
			animation: true
		});
		
		modalInstance.rendered.then(function() {
			document.querySelector('#url').focus();
		});
		
		modalInstance.result.then(function(newUrl) {
			FeedService.addFeed({
				url: newUrl
			}, function(err) {
				alert("Erro ao adicionar o feed.\nVerifique se a URL está correta.");
			});
		});
	};

	$scope.$on('feedSelected', function() {
		if ($scope.feeds && $scope.feeds.length > 0) {
			$scope.feeds.forEach(function(feed) {
				feed.selected = false;
			});
			FeedService.currentFeed.selected = true;
			$scope.currentFeed = FeedService.currentFeed;
		}
	});
	
	$scope.$on('read', function() {
		FeedService.currentFeed.unreadCount--;
	});
	
	var init = function() {
		FeedService.findFeeds(function() {
			$scope.feeds = FeedService.feeds;

			//Fires the event after the first request
			if (FeedService.feedsReady) {
				FeedService.feedsReady();
			}
			FeedService.ready = true;
			
			setInterval($scope.updateAll, 3e5);
		});
	};

	init();
});