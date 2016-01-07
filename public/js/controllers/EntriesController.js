angular.module('Acompanho').controller('EntriesController', [
  '$scope',
  '$stateParams',
  '$sce',
  '$aside',
  'FeedService',
  function($scope, $stateParams, $sce, $aside, FeedService) {
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

    $scope.openEntry = function(entry) {
      if (!entry.description) {
        entry.loading = true;
        FeedService.readEntry(entry).then(function(description) {
          entry.loading = false;
          entry.description = description;
          entry.unread = false;
          $scope.acompanho.currentFeed.unreadCount--;
        });
      }
      showAside(entry);
    };

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
