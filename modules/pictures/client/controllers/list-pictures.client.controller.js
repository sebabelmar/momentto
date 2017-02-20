(function () {
  'use strict';

  angular
    .module('pictures')
    .controller('PicturesListController', PicturesListController);

  PicturesListController.$inject = ['$scope', '$modal', 'PicturesService', '$http', '$window'];

  function PicturesListController($scope, $modal, PicturesService, $http, $window) {
    var vm = this;

    vm.pictures = PicturesService.query();

    // Pop-up the modal
    $scope.showInfoModal = function(pic){
        console.log('Scope in pictures working');

        var modalInstance = $modal.open({
            templateUrl: 'modules/pictures/client/views/modal-picture.client.view.html',
            controller: "ModalPictureController",
            size: 'lg',
            resolve: {
                user: function(){
                    return user
                },
                pic: function(){
                    return pic
                }
            }
        })
    };

    $scope.importInstagramPictures = function (){
        console.log("YEAHAAA");
      $http({
          method: "GET",
          url: "/api/picture/import"
      }).then(function(res){
          $window.location.reload();
      });
    };

  }
})();
