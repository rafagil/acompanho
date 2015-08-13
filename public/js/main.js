angular.module('Acompanho', [
  'ngAnimate',
  'ui.bootstrap',
  'ngSanitize',
  'ngTouch',
  'ui.router'
]).config(function($httpProvider, $stateProvider, $locationProvider, $urlRouterProvider) {

  'use strict';

  // var ua = window.navigator.userAgent;
  // var isIE = ua.indexOf("MSIE ") >= 0;
  $locationProvider.html5Mode(false); // HTML5 mode Not working properly:

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
});
