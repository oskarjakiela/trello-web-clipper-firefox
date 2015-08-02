(function() {
  'use strict';

  angular
    .module('oj.trelloWebClipper')
    .service('$card', $card);

  /** @ngInject */
  function $card() {
    var service = this;

    service.pos = 'bottom';

    service.fromTab = fromTab;
    service.toApi = toApi;

    function fromTab(tab) {
      if (! tab) { return; }

      service.name = tab.title;
      service.attachmentUrl = tab.url;

      service.desc = [
        '[', service.name, ']',
        '(', service.attachmentUrl, ')',
        '\n',
        '\n',
        'via [Trello Web Clipper](https://addons.mozilla.org/en-US/firefox/addon/trello-web-clipper/)'
      ].join('');
    }

    function toApi() {
      return {
        idList: service.list.id,
        name: service.name,
        desc: service.desc,
        pos: service.pos
      };
    }
  }
})();
