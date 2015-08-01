(function() {
  'use strict';

  angular
    .module('oj.trelloClipper')
    .service('$prefs', $prefs);

  /** @ngInject */
  function $prefs() {
    var service = this;
    var callback = angular.noop;

    service.extend = extend;
    service.onChange = onChange;

    function extend(source) {
      angular.extend(service, source);
      callback();
    }

    function onChange(newCallback) {
      callback = newCallback;
    }
  }
})();
