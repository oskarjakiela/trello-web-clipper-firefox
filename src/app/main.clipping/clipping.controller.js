(function() {
  'use strict';

  angular
    .module('oj.trelloClipper')
    .controller('ClippingController', ClippingController);

  /** @ngInject */
  function ClippingController($log, boards, $card, $scope, $state, $tabs, Trello) {
    var vm = this;

    $card.fromTab($tabs.activeTab);

    vm.add = add;
    vm.boards = boards;
    vm.card = $card;

    function add(card) {
      Trello.post('/cards', card.toApi(), function (res) {
        Trello.post('/cards/' + res.id + '/attachments', {
          name: card.name,
          url: card.url
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

    $tabs.onChange(function() {
      $card.fromTab($tabs.activeTab);
      $scope.$digest();
    });

    $log.debug('ClippingController: %o', vm);
  }
})();
