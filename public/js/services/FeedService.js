angular.module('Acompanho').factory('FeedService', function($http) {
  'use strict';

  var service = {
    feeds: []
  };

  service.findFeeds = function(callback) {
    var me = this;
    $http.get('/feeds?d=' + Date.now()).then(function(resp) {
      //Clean the array without changing the pointer:
      me.feeds.length = 0;
      me.feeds.push.apply(me.feeds, resp.data);

      if (callback) {
        callback();
      }
      me.updateAll();
      me.feeds.forEach(function(feed) {
        me.updateCount(feed);
      });
    });
  };

  service.findEntries = function(feedId, currentPage, itemsPerPage, callback) {
    $http.get('/entries/find/' + feedId + '/' + currentPage + '/' + itemsPerPage + '?d=' + Date.now()).then(function(resp) {
      callback(resp.data);
    });
  };

  service.getFeedById = function(id) {
    return $http.get('/feeds/' + id + '?d=' + Date.now()).then(function(response) {
      return response.data;
    });
  };

  service.addFeed = function(feed, onError) {
    var me = this;
    $http.post('/feeds', feed).then(function(resp) {
      if (resp.data.error) {
        if (onError) {
          onError(resp.data.error);
        }
      } else {
        me.findFeeds();
      }
    });
  };

  service.updateFeed = function(feed, onSuccess, onError) {
    $http.put('/feeds/' + feed._id, feed).then(function(resp) {
      if (resp.data.error) {
        if (onError) {
          onError(resp.data.error);
        }
      } else {
        if (onSuccess) {
          onSuccess(resp.data);
        }
      }
    });
  };

  service.deleteFeed = function(feed) {
    return $http.delete('/feeds/' + feed._id).then(function(resp) {
      return resp.data;
    });
  };

  service.updateAll = function() {
    var me = this;
    this.feeds.forEach(function(feed) {
      feed.updating = true;
      $http.get('/entries/update/' + feed._id + '?d=' + Date.now()).then(function(resp) {
        feed.updating = false;
        if (resp.data.error) {
          feed.failedUpdate = true;
        } else {
          feed.failedUpdate = false;
          me.updateCount(feed);
        }
      });
    });
  };

  service.readEntry = function(entry, onReady) {
    $http.get('/entries/read/' + entry._id).then(function(resp) {
      onReady(resp.data.description);
    });
  };

  service.updateCount = function(feed) {
    $http.get('/feeds/' + feed._id + '/unread_count').then(function(resp) {
      feed.unreadCount = resp.data;
    });
  };

  return service;
});
