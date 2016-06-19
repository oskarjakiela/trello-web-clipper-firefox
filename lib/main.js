var { ToggleButton } = require('sdk/ui/button/toggle');
var pageMod = require("sdk/page-mod");
var panel = require('sdk/panel');
var self = require('sdk/self');
var tabs = require('sdk/tabs');
var simplePrefs = require('sdk/simple-prefs');
var simpleStorage = require("sdk/simple-storage");
var pkg = require('./../package.json');

var isUndefined = function isUndefined(value) {
  return typeof value === 'undefined';
};

var isDefined = function isDefined(value) {
  return ! isUndefined(value);
};

var isString = function isString(value) {
  return typeof value === 'string';
};

var isObject = function isObject(value) {
  return value === Object(value);
};

var button = ToggleButton({
  id: pkg.name,
  label: pkg.title,
  icon: {
    '16': './icons/trello-16.png',
    '32': './icons/trello-32.png',
    '64': './icons/trello-64.png'
  },

  onChange: onChangeToggleButton
});

var popup = panel.Panel({
  width: 300,
  height: 430,
  contextMenu: true,
  contentURL: self.data.url('panel/panel.html'),
  contentScriptFile: [
    self.data.url('bower_components/trello-web-clipper/dist/trello-web-clipper.min.js'),
  ],
  contentStyleFile: [
    self.data.url('bower_components/trello-web-clipper/dist/trello-web-clipper.min.css')
  ],

  onHide: onHidePanel,
  onShow: onShowPanel
});

popup.port.on('$addon', requestListener);


tabs.on('activate', function () {
  popup.port.emit('$addon', { id: '$addon:reload' });
});

function onChangeToggleButton(state) {
  if (! state.checked) { return; }

  popup.show({ position: button });
}

function onHidePanel() {
  button.state('window', { checked: false });
  popup.port.emit('$addon', { id: '$addon:popup:hide' });
}

function onShowPanel() {
  popup.port.emit('$addon', { id: '$addon:popup:show' });
}

function requestListener(request) {
  function sendResponse(data) {
    popup.port.emit('$addon', {
      id: request.id,
      data: data
    });
  };

  switch(request.id) {
    case '$addon:storage':
      var data = request.data;

      if (isObject(data)) {
        Object.keys(data).forEach(function(key) {
          simpleStorage.storage[key] = data[key];
        });
      }

      sendResponse(simpleStorage.storage)
      break;
    case '$addon:manifest':
      var manifest = require('./../package.json');

      sendResponse({
        name: manifest.name,
        title: manifest.title,
        version: manifest.version
      });
      break;
    case '$addon:popup:hide':
      popup.hide();
      sendResponse();
      break;
    case '$addon:popup:show':
      popup.show({ position: button });
      sendResponse();
      break;
    case '$addon:tabs:active':
      sendResponse({
        title: tabs.activeTab.title,
        url: tabs.activeTab.url
      });
      break;
    case '$addon:tabs:open':
      tabs.open({
        url: request.data.url,
        onReady: sendResponse
      });
      break;
    case '$addon:token':
      if (isString(request.data)) {
        simpleStorage.storage.token = request.data;
      }

      sendResponse(simpleStorage.storage.token)
      break;
  }
}
