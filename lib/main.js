'use strict';

var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require('sdk/panel');
var self = require('sdk/self');
var tabs = require('sdk/tabs');
var simplePrefs = require('sdk/simple-prefs');
var simpleStorage = require("sdk/simple-storage");
var pkg = require('./../package.json');

var button = ToggleButton({
  id: pkg.name,
  label: pkg.title,
  icon: {
    '16': './icons/trello-16.png',
    '32': './icons/trello-32.png',
    '64': './icons/trello-64.png'
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

function onTabReady(tab) {
  panel.port.emit('tabs', JSON.stringify({
    activeTab: {
      title: tab.title,
      url: tab.url
    }
  }));
}

function emitTabs(tab) {
  onTabReady(tab);
  tab.on('ready', onTabReady);
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

function emitStorage() {
  panel.port.emit('storage', JSON.stringify({
    idBoard: simpleStorage.storage.idBoard,
    idList: simpleStorage.storage.idList,
    token: simpleStorage.storage.token
  }));
}

tabs.on('activate', emitTabs);
tabs.on('deactivate', function(tab) {
  tab.removeListener('ready', emitTabs);
});

panel.port.on('storage.idBoard', function(message) {
  simpleStorage.storage.idBoard = message;
});

panel.port.on('storage.idList', function(message) {
  simpleStorage.storage.idList = message;
});

panel.port.on('storage.token', function(message) {
  simpleStorage.storage.token = message;
});


panel.port.on('close', function() {
  panel.hide();
});

simplePrefs.on('', emitPrefs);


emitTabs(tabs.activeTab);
emitPrefs();
emitStorage();
emitPkg();

panel.port.on('openCard', function(message) {
  panel.hide();
  tabs.open(message, {
    inNewWindow: true,
  });
});
