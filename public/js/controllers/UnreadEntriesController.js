angular.module('Acompanho').controller('UnreadEntriesController', [
  '$scope',
  'FeedService',
  function($scope, FeedService) {
    'use strict';

    $scope.pageSize = 10;

    $scope.pageChanged = function(pageNumber) {
      FeedService.allUnreadEntries(pageNumber, $scope.pageSize).then(function(entries) {
        $scope.entries = entries.entries;
        $scope.totalEntries = entries.total;
      });
    };

    var init = function() {

      if ($scope.categories) {
        $scope.categories.forEach(function(cat) {
          cat.feeds.forEach(function(item) {
            item.selected = false;
          });
        });
      }

      $scope.acompanho.currentFeed = null;
      $scope.pageChanged(1);
    };

    init();
  }
]);
