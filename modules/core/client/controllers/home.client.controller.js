'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$location',
  function ($scope, Authentication, $location) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    if ($scope.authentication.user) {
      $location.path('/pictures');
    }

    $scope.message = ['Add a memory...',
      'Add memories to your Instagram.',
      'Keep it private, and share it with your closest circle.',
      'Invite people to add memories.',
      ''];
  }
]);
