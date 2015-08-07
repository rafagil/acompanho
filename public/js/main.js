angular.module('Acompanho', [
  'ngAnimate',
  'ui.bootstrap',
  'ngSanitize',
  'ui.router'
]).config(function($locationProvider, $httpProvider, $stateProvider, $urlRouterProvider) {

	'use strict';

  $stateProvider
    .state('feeds', {
      url: '/',
      templateUrl: 'partials/feeds.html',
      controller: 'AcompanhoController'
    })
    .state('feeds.list', {
      url: 'list/:feedId',
      templateUrl: 'partials/entries.html',
      controller: 'FeedsController'
    }).
  state('feeds.detail', {
    url: 'detail/:feedId',
    templateUrl: 'partials/feed_detail.html',
    controller: 'FeedDetailController'
  });

	$urlRouterProvider.otherwise('/');

  $httpProvider.interceptors.push('loginInterceptor');
});
