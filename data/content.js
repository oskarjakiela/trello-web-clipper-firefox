(function() {
  'use strict';

  var port = self.port;

  port.on('$addon:token', function() {
    var regex = /[0-9a-f]{64}/;
    var html = document.documentElement.innerHTML;

    var token = regex.exec(html)[0];

    port.emit('$addon:token', token);
  });

  port.on('$addon:notify', function(notification) {
    var p = document.createElement('p');
    p.textContent = notification;
    document.body.appendChild(p);
  });
}());
