(function() {
  'use strict';

  angular
    .module('oj.trelloClipper')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $addon, Trello) {
    $addon.prefs.onChange(function() {
      Trello.setKey($addon.prefs.key);
    });
  }

})();
