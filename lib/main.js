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
      position: button
    });
  }
}

function handleHide() {
  button.state('window', {checked: false});
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
  panel.port.emit('prefs', JSON.stringify(simplePrefs.prefs));
}

function emitDefaults() {
  panel.port.emit('defaults', JSON.stringify(simpleStorage.storage.defaults));
}

tabs.on('activate', emitTabs);
tabs.on('deactivate', function(tab) {
  tab.removeListener('ready', emitTabs);
});

simplePrefs.on('', emitPrefs);

emitTabs(tabs.activeTab);
emitPrefs();
emitDefaults();

panel.port.on('defaults.idBoard', function(message) {
  simpleStorage.storage.defaults.idBoard = message;
  emitDefaults();
});

panel.port.on('defaults.idList', function(message) {
  simpleStorage.storage.defaults.idList = message;
  emitDefaults();
});
