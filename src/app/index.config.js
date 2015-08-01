(function() {
  'use strict';

  angular
    .module('oj.trelloClipper')
    .config(config);

  /** @ngInject */
  function config(Trello) {
    Trello.setKey('e8b6ba838382302e68e9ad90a139bc7a');
  }

})();
