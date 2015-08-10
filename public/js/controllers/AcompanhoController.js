angular.module('Acompanho').controller('AcompanhoController', function($scope, $modal, $rootScope, $state, FeedService, UserService) {
  'use strict';

  var TIMEOUT = 3e5;
  $scope.acompanho = {
    currentFeed: null
  };

  $scope.updateAll = function() {
    FeedService.updateAll();
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

    modalInstance.result.then(function(newUrl) {
      FeedService.addFeed({
        url: newUrl
      }, function() {
        alert("Erro ao adicionar o feed.\nVerifique se a URL está correta.");
      });
    });
  };

  $scope.selectFeed = function(feed) {
    feed.selected = true;
    if ($scope.feeds) {
      $scope.feeds.forEach(function(item) {
        if (feed._id !== item._id) {
          item.selected = false;
        }
      });
    }
  };

  $scope.showEntries = function(feed) {
    $scope.selectFeed(feed);
    $state.go('feeds.entries', {
      id: feed._id
    });
  };

  var init = function() {
    FeedService.findFeeds(function() {
      $scope.feeds = FeedService.feeds;
      $rootScope.hideSplash = true;
      //In case of currentFeed loading faster than the feed list;
      if ($scope.acompanho.currentFeed) {
        $scope.selectFeed($scope.acompanho.currentFeed);
      }
      setInterval($scope.updateAll, TIMEOUT);
    });

    UserService.getUser().then(function(user) {
      $scope.user = user;
    });

  };

  init();
});
