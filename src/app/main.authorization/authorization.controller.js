(function() {
  'use strict';

  angular
    .module('oj.trelloWebClipper')
    .value('expirations', {
      '1hour': 'for 1 hour',
      '1day': 'for 1 day',
      '30days': 'for 30 days',
      'never': 'forever'
    })
    .controller('AuthorizationController', AuthorizationController);

  /** @ngInject */
  function AuthorizationController($log, $addon, expirations, $state, Trello) {
    var vm = this;

    vm.expiration = '30days';
    vm.expirations = expirations;
    vm.logIn = logIn;

    function logIn() {
      Trello.authorize({
        name: $addon.pkg.title,
        type: 'popup',
        scope: {
          read: true,
          write: true,
          account: false
        },
        expiration: vm.expiration,
        success: function() {
          $addon.storage.save('token', Trello.token());
          $state.go('main', {}, { reload: true });
        }
      });
    }
  }
})();
