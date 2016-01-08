angular.module('Acompanho').controller('UnreadEntriesController', [
  '$scope',
  '$aside',
  'FeedService',
  function($scope, $aside, FeedService) {
    'use strict';

    $scope.pageSize = 10;

    var showAside = function(entry) {
      $aside.open({
        placement: 'right',
        controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
          $scope.entry = entry;
          $scope.close = function() {
            $modalInstance.dismiss('cancel');
          };
        }],
        templateUrl: 'partials/entry.html',
        size: 'lg'
      });
    };

    var updateUnreadCount = function(entryFeed) {
      $scope.categories.forEach(function(cat) {
        cat.feeds.forEach(function(feed) {
          if (feed._id === entryFeed._id) {
            feed.unreadCount--;
          }
        });
      });
    };

    $scope.openEntry = function(entry) {
      if (!entry.description) {
        entry.loading = true;
        FeedService.readEntry(entry).then(function(description) {
          entry.loading = false;
          entry.description = description;
          entry.unread = false;
          updateUnreadCount(entry.feed);
          $scope.pageChanged(1);
        });
      }
      showAside(entry);
    };

    $scope.pageChanged = function(pageNumber) {
      $scope.loading = true;
      FeedService.allUnreadEntries(pageNumber, $scope.pageSize).then(function(entries) {
        $scope.entries = entries.entries;
        $scope.totalEntries = entries.total;
        $scope.loading = false;
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
