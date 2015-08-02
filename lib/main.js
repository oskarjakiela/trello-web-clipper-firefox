'use strict';

var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require('sdk/panel');
var self = require('sdk/self');
var tabs = require('sdk/tabs');
var simplePrefs = require('sdk/simple-prefs');
var simpleStorage = require("sdk/simple-storage");
var pkg = require('./../package.json');

if (! simpleStorage.storage.defaults) {
  simpleStorage.storage.defaults = {};
}

var extend = function extend(dst) {
  for (var i = 1, ii = arguments.length; i < ii; i++) {
    var obj = arguments[i];
    if (obj) {
      var keys = Object.keys(obj);
      for (var j = 0, jj = keys.length; j < jj; j++) {
        var key = keys[j];
        dst[key] = obj[key];
      }
    }
  }
  return dst;
};

var button = ToggleButton({
  id: 'my-button',
  label: 'my button',
  icon: {
    '16': './icon-16.png',
    '32': './icon-32.png',
    '64': './icon-64.png'
  },
  onChange: handleChange
});

var panel = panels.Panel({
  width: 300,
  height: 430,
  contextMenu: true,
  contentURL: self.data.url('panel/panel.html'),
  contentScriptFile: [
    self.data.url('dist/scripts/vendor.js'),
    self.data.url('dist/scripts/app.js'),
  ],
  contentStyleFile: [
    self.data.url('dist/styles/vendor.js'),
    self.data.url('dist/styles/app.css')
  ],
  onHide: handleHide
});

function handleChange(state) {
  if (state.checked) {
    panel.show({
      position: {
        top: 10,
        right: 30
      }
    });
  }
}

function handleHide() {
  button.state('window', { checked: false });
  panel.port.emit('go', 'main');
}

function emitTabs(tab) {
  tab.on('ready', function() {
    panel.port.emit('tabs', JSON.stringify({
      activeTab: {
        title: tab.title,
        url: tab.url
      }
    }));
  });
}

function emitPrefs() {
  panel.port.emit('prefs', JSON.stringify({
    key: simplePrefs.prefs.key,
    secret: simplePrefs.prefs.secret
  }));
}

function emitPkg() {
  panel.port.emit('pkg', JSON.stringify({
    title: pkg.title
  }));
}

function emitDefaults() {
  panel.port.emit('defaults', JSON.stringify(
    simpleStorage.storage.defaults
  ));
}

tabs.on('activate', emitTabs);
tabs.on('deactivate', function(tab) {
  tab.removeListener('ready', emitTabs);
});

panel.port.on('defaults.set', function(message) {
  var source = JSON.parse(message);
  simpleStorage.storage.defaults = extend(simpleStorage.storage.defaults, source);
});

panel.port.on('defaults.idList', function(message) {
  simpleStorage.storage.defaults.idList = message;
});

panel.port.on('close', function() {
  panel.hide();
});

simplePrefs.on('', emitPrefs);


emitTabs(tabs.activeTab);
emitPrefs();
emitDefaults();
emitPkg();

panel.port.on('openCard', function(message) {
  panel.hide();
  tabs.open(message, {
    inNewWindow: true,
  });
});
