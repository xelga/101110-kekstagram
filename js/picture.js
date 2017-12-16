'use strict';
(function () {
  var picturesContainer = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture-template').content.querySelector('.picture');

  var renderPicture = function (params) {
    var picture = pictureTemplate.cloneNode(true);

    picture.querySelector('img').src = params.url;
    picture.querySelector('.picture-likes').textContent = params.likes;
    picture.querySelector('.picture-comments').textContent = params.comments.length.toString();

    return picture;
  };

  window.util.appendErrorContainer();

  var onPicturesLoad = function (data) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < data.length; i++) {
      fragment.appendChild(renderPicture(data[i]));
    }

    picturesContainer.appendChild(fragment);
  };

  var onPicturesError = function (errorMessage) {
    var errorNode = window.util.createErrorNode(errorMessage);
    window.util.removeErrorNode(errorNode);
  };

  window.backend.load(onPicturesLoad, onPicturesError);
})();
