'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus', '$window','$http',
  function ($scope, $state, Authentication, Menus, $window, $http) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;
      
    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };

    // I need to move this to the User service
    // This hits users route and users.profile.controller
    var loadPics = function(user_id, instagram_id, token){
        $http({
            method: "GET",
            url: "/api/picture/import_pictures"
        }).then(function(res){
            console.log(res)
        });
    };

    // Exec on LOAD
    // Need a find a way to hit API one time.
    $scope.getPicsYo = function (){
        var instagram_id = user.providerData.id;
        var token = user.providerData.accessToken;
        loadPics(user._id, instagram_id, token);
    };

  }
]);
