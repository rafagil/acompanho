angular.module('Acompanho').factory('FeedService', function($http) {
  'use strict';

  var service = {};

  service.findEntries = function(feedId, currentPage, itemsPerPage) {
    return $http.get('/entries/find/' + feedId + '/' + currentPage + '/' + itemsPerPage + '?d=' + Date.now()).then(function(resp) {
      return resp.data;
    });
  };

  service.getFeedById = function(id) {
    return $http.get('/feeds/' + id + '?d=' + Date.now()).then(function(response) {
      return response.data;
    });
  };

  service.addFeed = function(feed) {
    return $http.post('/feeds', feed).then(function(resp) {
      return resp.data;
    });
  };

  service.updateFeed = function(feed) {
    return $http.put('/feeds/' + feed._id, feed).then(function(resp) {
      return resp.data;
    });
  };

  service.deleteFeed = function(feed) {
    return $http.delete('/feeds/' + feed._id).then(function(resp) {
      return resp.data;
    });
  };

  service.updateAll = function(categories) {
    var me = this;
    categories.forEach(function(cat) {
      cat.feeds.forEach(function(feed) {
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
    });

  };

  service.readEntry = function(entry) {
    return $http.get('/entries/read/' + entry._id).then(function(resp) {
      return resp.data.description;
    });
  };

  service.updateCount = function(feed) {
    $http.get('/feeds/' + feed._id + '/unread_count').then(function(resp) {
      feed.unreadCount = resp.data;
    });
  };

  return service;
});
