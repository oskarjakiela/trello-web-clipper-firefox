(function() {
  'use strict';

  angular
    .module('oj.trelloClipper')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, $prefs, self, $tabs) {
    self.port.on('tabs', function(message) {
      $tabs.extend(angular.fromJson(message));
    });

    self.port.on('prefs', function(message) {
      $prefs.extend(angular.fromJson(message));
    });
  }

})();
