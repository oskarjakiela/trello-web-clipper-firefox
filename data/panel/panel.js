/* jshint browser: true */

(function() {
  'use strict';

  angular
    .module('Trello', [])
    .constant('Trello', Trello);

  angular
    .module('oj.trelloClipper', [
      'Trello',
      'oj.trelloClipper.main'
    ])

    .config(['Trello', function(Trello) {
      Trello.setKey('e8b6ba838382302e68e9ad90a139bc7a');
    }])

    .run([function() {
      console.log('run');
    }]);

  angular
    .module('oj.trelloClipper.main', [
      'Trello'
    ])
    .controller('MainController', ['$log', '$scope', 'Trello', function($log, $scope, Trello) {
      var vm = this;

      vm.card = {};

      vm.isAuthorized = function isAuthorized() {
        return Trello.authorized();
      };

      vm.addCard = function addCard(card) {
        var params = {
          idList: card.list.id,
          name: card.name,
          desc: card.desc,
          pos: 'bottom'
        };

        Trello.post('/cards', params, function successCards() {
          console.log('/cards success', arguments);
        }, function errorCards() {
          console.log('/cards error', arguments);
        });
      };

      vm.authorize = function authorize() {
        Trello.authorize({
          name: 'Trello Clipper',
          type: 'popup',
          scope: { read: true, write: true, account: false },
          success: function() {
            $scope.$digest();
          }
        });
      };

      $scope.$watch('main.isAuthorized()', function() {
        Trello.get('/members/me/boards?fields=name&filter=open&lists=open', function(boards) {
          vm.boards = boards;
        });
      });

      $scope.$watch('main.card.board', function() {
        if (vm.card.board) {
          vm.lists = vm.card.board.lists;
        }
      });

      console.log('MainController:', vm);
    }]);
})();
