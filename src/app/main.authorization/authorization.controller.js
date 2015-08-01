(function() {
  'use strict';

  angular
    .module('oj.trelloClipper')
    .controller('AuthorizationController', AuthorizationController);

  /** @ngInject */
  function AuthorizationController($log, $addon, $state, Trello) {
    var vm = this;

    vm.logIn = logIn;

    function logIn() {
      Trello.authorize({
        name: $addon.pkg.title,
        type: 'popup',
        scope: { read: true, write: true, account: false },
        success: function() {
          $state.go('main.clipping');
        }
      });
    }
  }
})();
