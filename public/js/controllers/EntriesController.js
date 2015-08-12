angular.module('Acompanho').controller('EntriesController', function($scope, $stateParams, $sce, FeedService) {
  'use strict';
  $scope.itemsPerPage = 20;

  $scope.toggleEntry = function(entry) {
    if (!entry.description) {
      entry.description = "Loading...";
      FeedService.readEntry(entry).then(function(data) {
        entry.description = data;
        entry.unread = false;
        $scope.acompanho.currentFeed.unreadCount--;
      });
    }
  };

  $scope.pageChanged = function() {

    FeedService.findEntries($stateParams.id, $scope.currentPage, $scope.itemsPerPage).then(function(data) {
      $scope.entries = data.entries;
      $scope.entries.forEach(function(entry) {
        $sce.trustAsHtml(entry.description);
      });

      $scope.totalEntries = data.total;
    });
  };

  var processRequest = function() {
    FeedService.getFeedById($stateParams.id).then(function(feed) {
      $scope.selectFeed(feed);
    });

    $scope.currentPage = 1;
    $scope.pageChanged();
  };

  processRequest();
});
