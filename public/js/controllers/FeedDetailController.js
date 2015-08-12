angular.module('Acompanho').controller('FeedDetailController', function($scope, $stateParams, $state, FeedService, DialogService, CategoryService) {
  'use strict';

  $scope.save = function() {
    FeedService.updateFeed($scope.editFeed).then(function() {
      $state.go('feeds.entries', {
        id: $scope.editFeed._id
      });
      $scope.updateFeedList();
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
				$state.go('feeds');
        $scope.updateFeedList();
      });
    });
  };

  var init = function() {
    CategoryService.list().then(function(categories) {
      $scope.categories = categories;
    });
    FeedService.getFeedById($stateParams.id).then(function(feed) {
      $scope.editFeed = feed;
    });
  };

  init();
});
