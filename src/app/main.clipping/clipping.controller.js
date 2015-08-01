(function() {
  'use strict';

  angular
    .module('oj.trelloClipper')
    .controller('ClippingController', ClippingController);

  /** @ngInject */
  function ClippingController($log, boards, $scope, $state, Trello) {
    var vm = this;

    vm.add = add;
    vm.boards = boards;
    vm.card = {
      pos: 'bottom'
    };

    function add(card) {
      var params = {
        idList: card.list.id,
        name: card.name,
        desc: card.desc,
        pos: card.pos
      };

      Trello.post('/cards', params, function (card) {
        $state.go('main.success', {
          card: {
            url: card.url
          }
        });
      }, function () {
        $state.go('main.error');
      });
    }

    $scope.$watch('clipping.card.board', function () {
      if (vm.card.board) {
        vm.lists = vm.card.board.lists;
      }
    });

    $log.debug('ClippingController: %o', vm);
  }
})();
