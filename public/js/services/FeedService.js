angular.module('Acompanho').factory('FeedService', function($http) {
  'use strict';

  return {
    feeds: [],

    findFeeds: function(callback) {
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
    },

    findEntries: function(feedId, currentPage, itemsPerPage, callback) {

      $http.get('/entries/find/' + feedId + '/' + currentPage + '/' + itemsPerPage + '?d=' + Date.now()).then(function(resp) {
        callback(resp.data);
      });
    },

    getFeedById: function(id) {
      return $http.get('/feeds/' + id + '?d=' + Date.now()).then(function(response) {
				return response.data;
			});
    },

    addFeed: function(feed, onError) {
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
    },

    updateFeed: function(feed, onSuccess, onError) {
      $http.post('/feeds/update', feed).then(function(resp) {
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
    },

    deleteFeed: function(feed) {
      return $http.delete('/feeds/'+ feed._id).then(function(resp) {
        return resp.data;
      });
    },

    updateAll: function() {
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
    },

    readEntry: function(entry, onReady) {
      $http.get('/entries/read/' + entry._id).then(function(resp) {
        onReady(resp.data.description);
      });
    },

    updateCount: function(feed) {
      $http.get('/feeds/unread_count/' + feed._id).then(function(resp) {
        feed.unreadCount = resp.data;
      });
    }
  };
});
