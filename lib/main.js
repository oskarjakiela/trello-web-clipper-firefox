var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require('sdk/panel');
var self = require('sdk/self');

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
    self.data.url('bower_components/jquery/dist/jquery.js'),
    self.data.url('bower_components/angular/angular.js'),
    self.data.url('vendor/trello.js'),
    self.data.url('panel/panel.js')
  ],
  contentStyleFile: self.data.url('panel/panel.css'),
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
