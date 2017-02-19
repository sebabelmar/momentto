(function () {
  'use strict';

  angular
    .module('pictures')
    .controller('PicturesListController', PicturesListController);

  PicturesListController.$inject = ['$scope', '$modal', 'PicturesService'];

  function PicturesListController($scope, $modal, PicturesService) {
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
    }

  }
})();
