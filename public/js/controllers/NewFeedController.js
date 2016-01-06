angular.module('Acompanho').controller('NewFeedController', [
  '$scope',
  '$modalInstance',
  'CategoryService',
  function($scope, $modalInstance, CategoryService) {
    'use strict';

    $scope.ok = function() {
      $modalInstance.close({
        newUrl: $scope.newUrl,
        category: $scope.category,
        newCategory: $scope.nova ? $scope.newCategory : null
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
  }
]);
