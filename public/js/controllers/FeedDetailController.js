angular.module('Acompanho').controller('FeedDetailController', function($scope, $stateParams, $state, FeedService, DialogService) {
  'use strict';
  FeedService.getFeedById($stateParams.id).then(function(feed) {
    $scope.editFeed = feed;
  });

  $scope.save = function() {
    FeedService.updateFeed($scope.editFeed, function() {
      $state.go('feeds.entries', {
        id: $scope.editFeed._id
      });
    }, function(e) {
      alert(e);
    });
  };

  $scope.cancel = function() {
    $state.go('feeds.entries', {
      id: $scope.editFeed._id
    });
  };

  $scope.delete = function() {
    var message = "Deseja realmente excluir o feed " + $scope.editFeed.title + "?";
		var i;
    DialogService.showConfirmDialog(message, function() {
      FeedService.deleteFeed($scope.editFeed).then(function() {
        $scope.acompanho.currentFeed = null;
				for (i = 0; i < $scope.feeds.length; i++) {
					if ($scope.feeds[i]._id === $scope.editFeed._id) {
						$scope.feeds.splice(i, 1);
						break;
					}
				}
				$state.go('feeds');
      });
    });
  };
});
