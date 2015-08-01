(function() {
  'use strict';

  angular
    .module('oj.trelloClipper')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($state, Trello) {
    if (Trello.authorized()) {
      $state.go('main.clipping');
    } else {
      $state.go('main.authorization');
    }
  }
})();
