angular.module('Acompanho', [
  'ngAnimate',
  'ui.bootstrap',
  'ngSanitize',
  'ngTouch',
  'ui.router'
]).config(function($httpProvider, $stateProvider, $urlRouterProvider) {

  'use strict';

  $stateProvider
    .state('feeds', {
      url: '/',
      templateUrl: 'partials/feeds.html',
      controller: 'AcompanhoController'
    })
    .state('feeds.detail', {
      url: ':id',
      templateUrl: 'partials/feed_detail.html',
      controller: 'FeedDetailController'
    })
    .state('feeds.entries', {
      url: ':id/entries',
      templateUrl: 'partials/entries.html',
      controller: 'EntriesController'
    });

  $urlRouterProvider.otherwise('/');

  $httpProvider.interceptors.push('ResponseStatusInterceptorService');
});
