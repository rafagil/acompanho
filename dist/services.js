angular.module('AcompanhoServices').factory('CategoryService', function(Restangular) {
  'use strict';
  var service = {};

  service.list = function() {
    return Restangular.all('categories').getList();
  };

  service.listWithFeeds = function() {
    return Restangular.all('categories').getList({feeds: true});
  };

  service.add = function(categoryName) {
    return Restangular.all('categories').post({name: categoryName});
  };

  return service;
});

angular.module('AcompanhoServices').factory('DialogService', function($modal) {
  'use strict';
  var service = {};

  service.showConfirmDialog = function(message, onOK) {
    this.confirmMessage = message;
    var modalInstance = $modal.open({
      templateUrl: 'partials/confirm_dialog.html',
      controller: 'ConfirmDialogController',
      animation: true
    });

    modalInstance.result.then(onOK);
  };

  return service;
});

angular.module('AcompanhoServices').factory('FeedService', function(Restangular) {
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
    categories.forEach(function(cat) {
      cat.feeds.forEach(function(feed) {
        feed.updating = true;
        Restangular.one('feeds', feed._id).one('entries').one('update').get().then(function(resp) {
          feed.updating = false;
          if (resp.error) {
            feed.failedUpdate = true;
          } else {
            feed.failedUpdate = false;
            service.updateCount(feed);
          }
        });
      });
    });

  };

  service.readEntry = function(entry) {
    return Restangular.one('entries', entry._id).get().then(function(entry) {
      return entry.description;
    });
  };

  service.updateCount = function(feed) {
    Restangular.one('feeds', feed._id).one('unread_count').get().then(function(unreadCount) {
      feed.unreadCount = unreadCount;
    });
  };

  return service;
});

angular.module('AcompanhoServices').factory('ResponseStatusInterceptorService', function($q) {
  'use strict';
  var interceptor = {};

  interceptor.responseError = function(response) {
    if (response.status === 401) {
      window.location = '/login';
    } else if (response.status === 500) {
      var msg = 'Ocorreu um erro';
      if (response.data.error) {
        msg += ': ' + response.data.error;
      }
      alert(msg + '.');
    } else if (response.status === 404) {
      console.log('Not found');
    }
    return $q.reject(response);
  };

  return interceptor;
});

angular.module('AcompanhoServices', []);

angular.module('AcompanhoServices').factory('UserService', function(Restangular) {
  'use strict';

  var service = {};

  service.getUser = function() {
    return Restangular.one('user').get();
  };

  return service;
});
