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

  onChange: function onChangeButton(state) {
    if (state.checked) {
      popup.show({
        position: button
      });
    }
  }
});

var content = pageMod.PageMod({
  include: /https\:\/\/trello.com\/[0-9]+\/token\/approve/,
  contentScriptFile: self.data.url('content.js'),
  onAttach: function(worker) {
    worker.port.emit('$addon:token');
    worker.port.on('$addon:token', function(token) {
      simpleStorage.storage.token = token;
      worker.port.emit('$addon:notify', 'Authorization has completed successfully. You can close the pop-up window now.');
    });
  }
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

  onHide: function onHidePopup() {
    button.state('window', { checked: false });
    popup.port.emit('$addon:popup:hide');
  },

  onMessage: function onMessagePopup() {
    popup.port.emit('$addon:popup:message');
  },

  onShow: function onShowPopup() {
    popup.port.emit('$addon:popup:show');
  }
});

popup.port.on('$addon:popup:show', function() {
  popup.show({ position: button });
});

popup.port.on('$addon:popup:hide', function() {
  popup.hide();
});

popup.port.on('$addon:options', function(options) {
  var message;

  if (isDefined(options)) {
    if (isString(options)) {
      message = simplePrefs.prefs[options];
    }

    if (isObject(options)) {
      Object.keys(options).forEach(function(key) {
        simplePrefs.prefs[key] = options[key];
      });
    }
  }

  if (isUndefined(message)) {
    message = {
      'key': simplePrefs.prefs.key,
      'desc.template': simplePrefs.prefs['desc.template']
    };
  }

  popup.port.emit('$addon:options', message);
});

popup.port.on('$addon:storage', function(storage) {
  if (isDefined(storage) &&
      isObject(storage)) {
    Object.keys(storage).forEach(function(key) {
      simpleStorage.storage[key] = storage[key];
    });
  }

  popup.port.emit('$addon:storage', {
    idBoard: simpleStorage.storage.idBoard,
    idList: simpleStorage.storage.idList,
    token: simpleStorage.storage.token
  });
});

popup.port.on('$addon:tabs:active', function() {
  popup.port.emit('$addon:tabs:active', {
    title: tabs.activeTab.title,
    url: tabs.activeTab.url
  });
});

popup.port.on('$addon:tabs:open', function(tab) {
  tabs.open({
    url: tab.url,
    onReady: function() {
      popup.port.emit('$addon:tabs:open');
    }
  });

});

popup.port.on('$addon:manifest', function() {
  popup.port.emit('$addon:manifest', {
    name: pkg.name,
    title: pkg.title,
    version: pkg.version
  });
});

