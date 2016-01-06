angular.module('Acompanho').controller('EntriesController', [
  '$scope',
  '$stateParams',
  '$sce',
  'FeedService',
  function($scope, $stateParams, $sce, FeedService) {
    'use strict';
    $scope.pageSize = 10;

    $scope.pageChanged = function(newPage) {

      FeedService.findEntries($stateParams.id, newPage, $scope.pageSize).then(function(data) {
        $scope.entries = data.entries;
        $scope.entries.forEach(function(entry) {
          $sce.trustAsHtml(entry.description);
          $sce.trustAsHtml(entry.summary);
        });

        $scope.totalEntries = data.total;
      });
    };

    var processRequest = function() {
      FeedService.getFeedById($stateParams.id).then(function(feed) {
        $scope.selectFeed(feed);
      });

      $scope.pageChanged(1);
    };

    processRequest();
  }
]);
