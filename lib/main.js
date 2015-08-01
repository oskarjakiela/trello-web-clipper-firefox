'use strict';

var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require('sdk/panel');
var self = require('sdk/self');
var tabs = require('sdk/tabs');

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

tabs.on('activate', emitTabs);
tabs.on('deactivate', function(tab) {
  tab.removeListener('ready', emitTabs);
});

emitTabs(tabs.activeTab);
