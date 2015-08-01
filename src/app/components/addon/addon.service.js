(function() {
  'use strict';

  angular
    .module('oj.trelloClipper')
    .service('$addon', $addon);

  /** @ngInject */
  function $addon($log, self) {
    var service = this;

    var callbacks = {
      defaults: angular.noop,
      prefs: angular.noop,
      tabs: angular.noop
    };

    service.defaults = {};
    service.defaults.set = function(source) {
      service.defaults = angular.extend(service.defaults, source);
      self.port.emit('defaults.set', angular.toJson(source));
      callbacks.defaults();
    };

    service.defaults.onChange = function (callback) {
      callbacks.defaults = callback;
    };

    service.pkg = {};

    service.prefs = {};
    service.prefs.onChange = function (callback) {
      callbacks.prefs = callback;
    };

    service.tabs = {};
    service.tabs.onChange = function (callback) {
      callbacks.tabs = callback;
    };

    self.port.on('defaults', function(message) {
      service.defaults = angular.extend(service.defaults, angular.fromJson(message));
      callbacks.defaults();
    });

    self.port.on('pkg', function(message) {
      service.pkg = angular.extend(service.pkg, angular.fromJson(message));
    });

    self.port.on('prefs', function(message) {
      service.prefs = angular.extend(service.prefs, angular.fromJson(message));
      callbacks.prefs();
    });

    self.port.on('tabs', function(message) {
      service.tabs = angular.extend(service.tabs, angular.fromJson(message));
      callbacks.tabs();
    });
  }
})();
