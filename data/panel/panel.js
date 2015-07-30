Trello.setKey('e8b6ba838382302e68e9ad90a139bc7a');

var App = {};

App.init = function appInit() {

  var elements = [];
  var btn = document.createElement('button');

  if (Trello.authorized()) {
    btn.appendChild(document.createTextNode('Logout'));
    btn.addEventListener('click', function() {
      Trello.deauthorize();
    });
  } else {
    btn.appendChild(document.createTextNode('Login'));
    btn.addEventListener('click', function() {
      Trello.authorize({
        name: 'Trello Clipper',
        type: 'popup',
        success: function success() {
          App.reinit();
        }
      });
    });
  }

  elements.push(btn);

  elements.forEach(function(element) {
    document.body.appendChild(element);
  });
};

App.reinit = function appReinit() {
  document.body.innerHTML = '';
  App.init();
};

$(App.init);
