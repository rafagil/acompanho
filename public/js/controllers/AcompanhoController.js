angular.module('Acompanho').controller('AcompanhoController', function($scope, $modal, $rootScope, $state, $urlRouter, FeedService, UserService, CategoryService) {
  'use strict';

  var TIMEOUT = 3e5;
  $scope.acompanho = {
    currentFeed: null
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
      FeedService.addFeed({
        url: dialogScope.newUrl,
        category: dialogScope.category
      }).then(function() {
        $scope.updateFeedList();
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

  var init = function() {
    CategoryService.listWithFeeds().then(function(categories) {
      $scope.categories = categories;

      $rootScope.hideSplash = true;
      //In case of currentFeed loading faster than the feed list;
      if ($scope.acompanho.currentFeed) {
        $scope.selectFeed($scope.acompanho.currentFeed);
      }
      $scope.updateAll();
      setInterval($scope.updateAll, TIMEOUT);
    });

    UserService.getUser().then(function(user) {
      $scope.user = user;
    });

  };

  init();
});
