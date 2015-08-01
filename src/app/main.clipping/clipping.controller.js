(function() {
  'use strict';

  angular
    .module('oj.trelloClipper')
    .controller('ClippingController', ClippingController);

  /** @ngInject */
  function ClippingController($log, boards, $card, $scope, self, $state, $tabs, Trello) {
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

        self.port.emit('defaults.idBoard', card.board.id);
        self.port.emit('defaults.idList', card.list.id);

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

    self.port.on('defaults', function(defaults) {
      defaults = angular.fromJson(defaults);

      $card.board = vm.boards.find(function(board) {
        return board.id === defaults.idBoard;
      });

      $card.list = vm.lists.find(function(list) {
        return list.id === defaults.idList;
      });

      $scope.$digest();
    });

    $log.debug('ClippingController: %o', vm);
  }
})();
