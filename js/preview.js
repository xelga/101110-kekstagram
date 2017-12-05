'use strict';
(function () {
  var galleryOverlay = document.querySelector('.gallery-overlay');
  var galleryOverlayClose = galleryOverlay.querySelector('.gallery-overlay-close');
  var picturesContainer = document.querySelector('.pictures');

  var setPictureDate = function (event) {
    var currentPicture = event.target;

    if (event.target.tagName === 'IMG') {
      currentPicture = event.target.parentNode;
    }

    galleryOverlay.querySelector('.gallery-overlay-image').src = currentPicture.querySelector('img').src;
    galleryOverlay.querySelector('.likes-count').textContent = currentPicture.querySelector('.picture-likes').textContent;
    galleryOverlay.querySelector('.comments-count').textContent = currentPicture.querySelector('.picture-comments').textContent;
  };

  var showGalleryOverlay = function (event) {
    setPictureDate(event);
    galleryOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onGalleryOverlayEscPress);
  };

  var hiddenGalleryOverlay = function () {
    galleryOverlay.classList.add('hidden');
    document.removeEventListener('keydown', onGalleryOverlayEscPress);
  };

  var onGalleryOverlayEscPress = function (event) {
    if (event.keyCode === window.util.ESC_KEYCODE) {
      hiddenGalleryOverlay();
    }
  };

  picturesContainer.addEventListener('click', function (event) {
    event.preventDefault();
    showGalleryOverlay(event);
  });

  picturesContainer.addEventListener('keydown', function (event) {
    if (event.keyCode === window.util.ENTER_KEYCODE) {
      showGalleryOverlay(event);
    }
  });

  galleryOverlayClose.addEventListener('click', function () {
    hiddenGalleryOverlay();
  });

  galleryOverlayClose.addEventListener('keydown', function (event) {
    if (event.keyCode === window.util.ENTER_KEYCODE) {
      hiddenGalleryOverlay();
    }
  });
})();
