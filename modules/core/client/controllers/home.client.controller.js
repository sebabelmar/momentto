'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.message = ['Add a memory...',
      'Add memories to your Instagram.',
      'Keep it private, and share it with your closest circle.',
      'Invite people to add memories.',
      ''];
  }
]);
