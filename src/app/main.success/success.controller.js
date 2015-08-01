(function() {
  'use strict';

  angular
    .module('oj.trelloClipper')
    .controller('SuccessController', SuccessController);

  /** @ngInject */
  function SuccessController($log, $stateParams) {
    var vm = this;

    $log.debug('$stateParams', $stateParams);

    vm.cardUrl = $stateParams.cardUrl;
  }
})();
