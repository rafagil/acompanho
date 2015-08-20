angular.module('Acompanho', [
  'ngAnimate',
  'ui.bootstrap',
  'ngSanitize',
  'ngTouch',
  'ngAside',
  'ui.router',
  'restangular',
  'AcompanhoServices',
]).config(function($httpProvider, $stateProvider, $locationProvider, $urlRouterProvider, RestangularProvider) {

  'use strict';

  var ua = window.navigator.userAgent;
  var isIE = ua.indexOf("MSIE ") >= 0;
  $locationProvider.html5Mode(!isIE);

  $stateProvider
    .state('feeds', {
      url: '/',
      templateUrl: 'partials/feeds.html',
      controller: 'AcompanhoController'
    })
    .state('feeds.detail', {
      url: 'feeds/:id',
      templateUrl: 'partials/feed_detail.html',
      controller: 'FeedDetailController'
    })
    .state('feeds.entries', {
      url: 'feeds/:id/entries',
      templateUrl: 'partials/entries.html',
      controller: 'EntriesController'
    });

  $urlRouterProvider.otherwise('/');

  $httpProvider.interceptors.push('ResponseStatusInterceptorService');

  RestangularProvider.setBaseUrl('/api');
  RestangularProvider.setDefaultHeaders({
    token: 'tokenHere'
  });
  RestangularProvider.setRestangularFields({
    id: "_id"
  });
});

angular.module('Acompanho').filter('limitWordWise', function() {

  'use strict';

  return function(value, max) {
    if (!value) return '';

    max = parseInt(max, 10);
    if (!max) return value;
    if (value.length <= max) return value;

    value = value.substr(0, max);
    var lastspace = value.lastIndexOf(' ');
    if (lastspace != -1) {
      value = value.substr(0, lastspace);
    }

    return value + '…';
  };
});

angular.module('Acompanho').controller('AcompanhoController', function($scope, $modal, $rootScope, $state, $q, $aside, FeedService, UserService, CategoryService) {
  'use strict';

  var TIMEOUT = 3e5;
  $scope.pageSize = 20;
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

  $scope.pageChanged = function(pageNumber) {
    FeedService.allUnreadEntries(pageNumber, $scope.pageSize).then(function(entries) {
      $scope.entries = entries.entries;
      $scope.totalEntries = entries.total;
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

    $scope.pageChanged(1);
  };

  $scope.goHome = function() {
    $scope.acompanho.currentFeed = null;
    $state.go('feeds');
    init();
  };

  init();
});

angular.module('Acompanho').controller('ConfirmDialogController', function($scope, $modalInstance, DialogService) {
	
	$scope.confirmMessage = DialogService.confirmMessage;
	
	$scope.ok = function() {
		$modalInstance.close();
	};
	
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
	
});
angular.module('Acompanho').controller('EntriesController', function($scope, $stateParams, $sce, FeedService) {
  'use strict';
  $scope.pageSize = 20;

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
});

angular.module('Acompanho').controller('FeedDetailController', function($scope, $stateParams, $state, FeedService, DialogService, CategoryService) {
  'use strict';

  $scope.save = function() {
    FeedService.updateFeed($scope.editFeed).then(function() {
      $state.go('feeds.entries', {
        id: $scope.editFeed._id
      });
      $scope.updateFeedList();
    });
  };

  $scope.cancel = function() {
    $state.go('feeds.entries', {
      id: $scope.editFeed._id
    });
  };

  $scope.delete = function() {
    var message = "Deseja realmente excluir o feed " + $scope.editFeed.title + "?";
		var i;
    DialogService.showConfirmDialog(message, function() {
      FeedService.deleteFeed($scope.editFeed).then(function() {
        $scope.acompanho.currentFeed = null;
				$state.go('feeds');
        $scope.updateFeedList();
      });
    });
  };

  var init = function() {
    CategoryService.list().then(function(categories) {
      $scope.categories = categories;
    });
    FeedService.getFeedById($stateParams.id).then(function(feed) {
      $scope.editFeed = feed;
    });
  };

  init();
});

angular.module('Acompanho').controller('NewFeedController', function($scope, $modalInstance, CategoryService) {
  'use strict';

  $scope.ok = function() {
    $modalInstance.close({
      newUrl: $scope.newUrl,
      category: $scope.category,
      newCategory: $scope.nova? $scope.newCategory : null
    });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };

  var init = function() {
    CategoryService.list().then(function(categories) {
      $scope.categories = categories;
    });
  };
  init();
});
