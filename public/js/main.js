angular.module('Acompanho', [
  'ngAnimate',
  'ui.bootstrap',
  'ngSanitize',
  'ngTouch',
  'ngAside',
  'ui.router',
  'restangular',
  'AcompanhoServices',
]).config([
  '$httpProvider',
  '$stateProvider',
  '$locationProvider',
  '$urlRouterProvider',
  'RestangularProvider',
  function($httpProvider, $stateProvider, $locationProvider, $urlRouterProvider, RestangularProvider) {

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
      })
      .state('feeds.unread', {
        url: 'unread',
        templateUrl: 'partials/unread.html',
        controller: 'UnreadEntriesController'
      });

    $urlRouterProvider.otherwise('/');

    $httpProvider.interceptors.push('ResponseStatusInterceptorService');

    RestangularProvider.setBaseUrl('/api');
    // RestangularProvider.setDefaultHeaders({
    //   token: 'tokenHere'
    // });
    RestangularProvider.setRestangularFields({
      id: "_id"
    });
  }
]);
