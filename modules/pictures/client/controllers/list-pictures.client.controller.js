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
            // 'modules/pictures/client/views/list-pictures.client.view.html'
            templateUrl: 'modules/pictures/client/views/media-modal.client.view.html',
            controller: "MediaModalController",
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
