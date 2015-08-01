(function() {
  'use strict';

  angular
    .module('oj.trelloWebClipper')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $addon, Trello) {
    $addon.prefs.onChange(function() {
      Trello.setKey($addon.prefs.key);
    });
  }

})();
