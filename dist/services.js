angular.module('AcompanhoServices', []);

angular.module('AcompanhoServices').factory('CategoryService', ['Restangular', function(Restangular) {
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
}]);

angular.module('AcompanhoServices').factory('DialogService', ['$modal', function($modal) {
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
}]);

angular.module('AcompanhoServices').factory('EntryService', ['Restangular', function(Restangular) {
  'use strict';

  var service = {};

  service.find = function(entryId, read) {
    return Restangular.one('entries', entryId).get({
      read: read
    });
  };

  return service;
}]);

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

angular.module('AcompanhoServices').factory('ResponseStatusInterceptorService', ['$q', function($q) {
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
}]);

angular.module('AcompanhoServices').factory('UserService', ['Restangular', function(Restangular) {
  'use strict';

  var service = {};

  service.getUser = function() {
    return Restangular.one('user').get();
  };

  return service;
}]);
