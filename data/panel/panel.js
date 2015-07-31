
var Clipper = {};

Clipper.el = {};
Clipper.model = {};

Clipper.el.login = {};
Clipper.el.login.div = '.js-clipper-login';
Clipper.el.login.btn = '.js-clipper-login-btn';

Clipper.el.form = {};
Clipper.el.form.div = '.js-clipper-form';
Clipper.el.form.btn = '.js-clipper-form-btn';
Clipper.el.form.board = '.js-clipper-form-board';
Clipper.el.form.list = '.js-clipper-form-list';
Clipper.el.form.name = '.js-clipper-form-name';
Clipper.el.form.desc = '.js-clipper-form-desc';


Clipper.init = function initClipper() {
  Trello.setKey('e8b6ba838382302e68e9ad90a139bc7a');
  Clipper.check();
};

Clipper.check = function checkClipper() {
  if (Trello.authorized()) {
    Clipper.form();
  } else {
    Clipper.login();
  }
};

Clipper.login = function loginClipper() {
  $(Clipper.el.login.btn).on('click', function() {
    Trello.authorize({
      name: 'Trello Clipper',
      type: 'popup',
      scope: { read: true, write: true, account: false },
      success: Clipper.check
    });
  });

  $(Clipper.el.login.div).show();
  $(Clipper.el.form.div).hide();
};

Clipper.form = function formClipper() {
  $(Clipper.el.form.board).on('change', function() {
    var id = $(this).find('option:selected').val();
    var board = Clipper.model.boards.find(function(board) {
      return board.id = id;
    });

    Clipper.model.board = board;

    $(Clipper.el.form.list).empty();
    Clipper.model.lists = Clipper.model.board.lists;
    Clipper._optionFactory(Clipper.el.form.list)({ id: '', name: 'Select list'});
    Clipper.model.lists.forEach(Clipper._optionFactory(Clipper.el.form.list));

  });

  $(Clipper.el.form.list).on('change', function() {
    var id = $(this).val();
    var list = Clipper.model.lists.find(function(list) {
      return list.id = id;
    });

    Clipper.model.list = list;

  });

  $(Clipper.el.form.btn).on('click', function() {
    var params = {
      idList: Clipper.model.list.id,
      name: $(Clipper.el.form.name).val(),
      desc: $(Clipper.el.form.desc).val(),
      pos: 'bottom'
    };

    Trello.post('/cards', params, function successCards() {
      console.log('/cards success', arguments);
    }, function errorCards() {
      console.log('/cards error', arguments);
    });
  });

  $(Clipper.el.login.div).hide();
  $(Clipper.el.form.div).show();

  Trello.get('/members/me/boards?fields=name&filter=open&lists=open', function(boards) {
    $(Clipper.el.form.board).empty();
    Clipper.model.boards = boards;
    Clipper._optionFactory(Clipper.el.form.board)({ id: '', name: 'Select board'});
    Clipper.model.boards.forEach(Clipper._optionFactory(Clipper.el.form.board));
  });
};

Clipper._optionFactory = function(to) {
  return function(element) {
    $('<option />', {
      val: element.id,
      text: element.name
    })
    .appendTo(to);
  }
};

$(Clipper.init);
