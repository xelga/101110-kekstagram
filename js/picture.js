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

  var createFragment = function () {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < window.data.length; i++) {
      fragment.appendChild(renderPicture(window.data[i]));
    }

    return fragment;
  };

  picturesContainer.appendChild(createFragment());
})();
