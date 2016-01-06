angular.module('AcompanhoServices').factory('FeedService', ['Restangular', '$q', function(Restangular, $q) {
  'use strict';

  var service = {};

  service.findEntries = function(feedId, currentPage, pageSize) {
    return Restangular.one('feeds', feedId).one('entries').get({page: currentPage, pageSize: pageSize});
  };

  service.allUnreadEntries = function(currentPage, pageSize) {
    return Restangular.one('entries').get({page: currentPage, pageSize: pageSize, unread: true});
  };

  service.getFeedById = function(id) {
    return Restangular.one('feeds', id).get();
  };

  service.addFeed = function(feed) {
    return Restangular.all('feeds').post(feed);
  };

  service.updateFeed = function(feed) {
    return feed.put();
  };

  service.deleteFeed = function(feed) {
    return feed.remove();
  };

  service.updateAll = function(categories) {
    var deferrer = $q.defer();
    var promises = [];
    categories.forEach(function(cat) {
      cat.feeds.forEach(function(feed) {
        feed.updating = true;
        promises.push(service.refreshEntries(feed).then(function() {
          feed.updating = false;
        }));
      });
    });

    $q.all(promises).then(function() {
      deferrer.resolve();
    });

    return deferrer.promise;
  };

  service.refreshEntries = function(feed) {
    return Restangular.one('feeds', feed._id).one('entries').one('update').get().then(function(resp) {
      if (resp.error) {
        feed.failedUpdate = true;
      } else {
        feed.failedUpdate = false;
        service.updateCount(feed);
      }
    });
  };

  service.readEntry = function(entry) {
    return Restangular.one('entries', entry._id).one('read').get().then(function(entry) {
      return entry.description;
    });
  };

  service.updateCount = function(feed) {
    Restangular.one('feeds', feed._id).one('unread_count').get().then(function(unreadCount) {
      feed.unreadCount = unreadCount;
    });
  };

  return service;
}]);
