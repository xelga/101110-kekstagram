'use strict';
(function () {
  var filters = document.querySelector('.filters');
  var pictures = [];

  window.util.appendErrorContainer();

  var onPicturesLoad = function (data) {
    pictures = data;
    window.render(pictures);
    window.sort(pictures);
    filters.classList.remove('filters-inactive');
  };

  var onPicturesError = function (errorMessage) {
    var errorNode = window.util.createErrorNode(errorMessage);
    window.util.removeErrorNode(errorNode);
  };

  window.backend.load(onPicturesLoad, onPicturesError);
})();
