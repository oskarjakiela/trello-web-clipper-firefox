(function() {
  'use strict';

  angular
    .module('oj.trelloClipper')
    .run(runBlock);

  /** @ngInject */
  function runBlock() {
    console.log('runBlock end');
  }

})();
