angular.module('Acompanho').controller('AcompanhoController', [
  '$scope',
  '$modal',
  '$rootScope',
  '$state',
  '$q',
  '$aside',
  'FeedService',
  'UserService',
  'CategoryService',
  function($scope, $modal, $rootScope, $state, $q, $aside, FeedService, UserService, CategoryService) {
    'use strict';

    var TIMEOUT = 3e5;
    $scope.acompanho = {
      currentFeed: null
    };

    $scope.showMenuAside = function() {
      $aside.open({
        placement: 'left',
        scope: $scope,
        controller: function($modalInstance) {
          $scope.showEntriesAndDismiss = function(feed) {
            $scope.showEntries(feed);
            $modalInstance.dismiss('cancel');
          };
        },
        templateUrl: 'partials/feeds_aside.html',
        size: 'lg'
      });
    };

    var getCategory = function(dialogScope) {
      var deferrer = $q.defer();
      if (dialogScope.newCategory) {
        CategoryService.add(dialogScope.newCategory).then(function(cat) {
          deferrer.resolve(cat._id);
        });
      } else {
        deferrer.resolve(dialogScope.category);
      }

      return deferrer.promise;
    };

    $scope.updateAll = function() {
      FeedService.updateAll($scope.categories);
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

      modalInstance.result.then(function(dialogScope) {
        getCategory(dialogScope).then(function(category) {
          FeedService.addFeed({
            url: dialogScope.newUrl,
            category: category
          }).then(function() {
            $scope.updateFeedList();
          });
        });
      });
    };

    $scope.selectFeed = function(feed) {
      if ($scope.categories) {
        $scope.categories.forEach(function(cat) {
          cat.feeds.forEach(function(item) {
            item.selected = false;
            if (feed._id === item._id) {
              $scope.acompanho.currentFeed = item;
              item.selected = true;
            }
          });
        });
      } else {
        $scope.feedSelectedBeforeCat = true;
        $scope.acompanho.currentFeed = feed;
      }
    };

    $scope.showEntries = function(feed) {
      $state.go('feeds.entries', {
        id: feed._id
      });
    };

    $scope.updateFeedList = function() {
      CategoryService.listWithFeeds().then(function(categories) {
        $scope.categories = categories;
        $scope.updateAll();
      });
    };

    var showAside = function(entry) {
      $aside.open({
        placement: 'right',
        controller: function($scope, $modalInstance) {
          $scope.entry = entry;
          $scope.close = function() {
            $modalInstance.dismiss('cancel');
          };
        },
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
          if ($scope.acompanho.currentFeed) {
            $scope.acompanho.currentFeed.unreadCount--;
          } else {
            $scope.pageChanged(1);
          }
        });
      }
      showAside(entry);
    };

    var init = function() {

      CategoryService.listWithFeeds().then(function(categories) {
        $scope.categories = categories;

        $rootScope.hideSplash = true;
        //In case of currentFeed loading faster than the feed list;
        if ($scope.feedSelectedBeforeCat) {
          $scope.selectFeed($scope.acompanho.currentFeed);
        }

        $scope.updateAll();
        setInterval($scope.updateAll, TIMEOUT);
      });

      UserService.getUser().then(function(user) {
        $scope.user = user;
      });

      if ($state.is('feeds')) {
        $state.go('feeds.unread');
      }
    };

    $scope.goHome = function() {
      $scope.acompanho.currentFeed = null;
      $state.go('feeds');
      init();
    };

    init();
  }
]);
