angular.module('Acompanho').controller('FeedsController', function($scope, $stateParams, $sce, FeedService) {
  'use strict';
  $scope.itemsPerPage = 20;

  $scope.toggleEntry = function(entry) {
    if (!entry.description) {
      entry.description = "Loading...";
      FeedService.readEntry(entry, function(data) {
        entry.description = data;
        entry.unread = false;
        $scope.acompanho.currentFeed.unreadCount--;
      });
    }
  };

  $scope.pageChanged = function() {

    FeedService.findEntries($stateParams.id, $scope.currentPage, $scope.itemsPerPage, function(data) {
      $scope.entries = data.entries;
      $scope.entries.forEach(function(entry) {
        $sce.trustAsHtml(entry.description);
      });

      $scope.totalEntries = data.total;
    });
  };

  var processRequest = function() {
    FeedService.getFeedById($stateParams.id).then(function(feed) {
      $scope.acompanho.currentFeed = feed;
      $scope.selectFeed(feed);
    });

    $scope.currentPage = 1;
    $scope.pageChanged();
  };

  processRequest();
});
