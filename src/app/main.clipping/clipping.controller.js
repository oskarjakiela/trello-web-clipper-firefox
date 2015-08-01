(function() {
  'use strict';

  angular
    .module('oj.trelloClipper')
    .controller('ClippingController', ClippingController);

  /** @ngInject */
  function ClippingController($log, boards, $card, $scope, $state, $addon, Trello) {
    var vm = this;

    $card.fromTab($addon.tabs.activeTab);

    vm.add = add;
    vm.boards = boards;
    vm.card = $card;

    function add(card) {
      Trello.post('/cards', card.toApi(), function (res) {
        Trello.post('/cards/' + res.id + '/attachments', {
          name: card.name,
          url: card.url
        });

        $addon.defaults.set({
          idBoard: card.board.id,
          idList: card.list.id
        });

        $state.go('main.success');
      }, function () {
        $state.go('main.error');
      });
    }

    $scope.$watch('clipping.card.board', function () {
      if (vm.card.board) {
        vm.lists = vm.card.board.lists;
      }
    });

    $addon.tabs.onChange(function () {
      $card.fromTab($addon.tabs.activeTab);
      $scope.$digest();
    });

    $addon.defaults.onChange(function () {
      $card.board = vm.boards.find(function(board) {
        return board.id === $addon.defaults.idBoard;
      });

      $card.list = vm.lists.find(function(list) {
        return list.id === $addon.defaults.idList;
      });

      $scope.$digest();
    });

    $log.debug('ClippingController: %o', vm);
  }
})();
