'use strict';
(function () {
  var picturesContainer = document.querySelector('.pictures');
  var filters = document.querySelector('.filters');

  window.sort = function (data) {
    var pictures = data;

    filters.addEventListener('change', function (event) {
      var sortedPictures = data;

      if (event.target.value === 'popular') {
        sortedPictures = pictures.slice(0).sort(function (first, second) {
          return second.likes - first.likes;
        });
      }

      if (event.target.value === 'discussed') {
        sortedPictures = pictures.slice(0).sort(function (first, second) {
          return second.comments.length - first.comments.length;
        });
      }

      if (event.target.value === 'random') {
        sortedPictures = pictures.slice(0).sort(function () {
          return Math.random() - 0.5;
        });
      }

      var renderPicters = function () {
        picturesContainer.innerHTML = '';
        window.render(sortedPictures);
      };

      window.util.debounce(renderPicters);
    });
  };
})();
