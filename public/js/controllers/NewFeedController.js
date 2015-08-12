angular.module('Acompanho').controller('NewFeedController', function($scope, $modalInstance, CategoryService) {
  'use strict';

  $scope.ok = function() {
    $modalInstance.close({newUrl: $scope.newUrl, category: $scope.category});
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
