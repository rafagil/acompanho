angular.module('Acompanho').controller('FeedsController', function($scope, $stateParams, $sce, FeedService) {

	$scope.itemsPerPage = 20;

	$scope.toggleEntry = function(entry) {
		if (!entry.description) {
			entry.description = "Loading...";
			FeedService.readEntry(entry, function(data) {
				entry.description = data;
				entry.unread = false;
				$scope.$emit('read');
			});
		}
	};

	$scope.pageChanged = function() {

		FeedService.findEntries($stateParams.feedId, $scope.currentPage, $scope.itemsPerPage, function(data) {
			$scope.entries = data.entries;
			$scope.entries.forEach(function(entry) {
				$sce.trustAsHtml(entry.description);
			});

			$scope.totalEntries = data.total;
		});
	};

	var processRequest = function() {
		//Here we have to find the feed in database and put it on the return object;
		//This object will be useful to mark wich one is currently selected
		FeedService.setCurrentFeed($stateParams.feedId);

		//Fires the event to update AcompanhoController:
		$scope.$emit('feedSelected');

		$scope.currentPage = 1;
		$scope.pageChanged();
	};

	//Created this to prevent errors on the first request:
	//Only do the controller stuff if the first request is completed
	//Maybe there is a better way to do this
	if (FeedService.ready) {
		processRequest();
	}

	FeedService.feedsReady = function() {
		processRequest();
	};
});
