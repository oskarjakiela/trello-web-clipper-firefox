(function() {
  'use strict';

  angular
    .module('oj.trelloClipper')
    .controller('ClippingController', ClippingController);

  /** @ngInject */
  function ClippingController($log, boards, $scope, $state, $tabs, Trello) {
    var vm = this;

    vm.add = add;
    vm.boards = boards;
    vm.card = {
      name: $tabs.activeTab.title,
      desc: [
        '[', $tabs.activeTab.title, ']',
        '(', $tabs.activeTab.url, ')',
        '\n',
        '\n',
        'via Trello Web Clipper'
      ].join(''),
      pos: 'bottom',
      urlSource: $tabs.activeTab.url
    };

    function add(card) {
      var params = {
        idList: card.list.id,
        name: card.name,
        desc: card.desc,
        pos: card.pos
      };

      Trello.post('/cards', params, function () {
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
      vm.card.name = $tabs.activeTab.title;
      $scope.$digest();
    });

    $log.debug('ClippingController: %o', vm);
  }
})();
