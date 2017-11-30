'use strict';

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var COMMENT_TEXTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var photos = [];

for (var i = 0; i < 25; i++) {
  var comments = [];
  for (var a = 0; a < getRandomNumber(1, 3); a++) {
    comments.push(COMMENT_TEXTS[getRandomNumber(0, COMMENT_TEXTS.length - 1)]);
  }

  photos.push({
    url: 'photos/' + (i + 1) + '.jpg',
    likes: getRandomNumber(15, 200),
    comments: comments
  });
}

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

  for (var j = 0; j < photos.length; j++) {
    fragment.appendChild(renderPicture(photos[j]));
  }

  return fragment;
};

picturesContainer.appendChild(createFragment());

var galleryOverlay = document.querySelector('.gallery-overlay');
var galleryOverlayClose = galleryOverlay.querySelector('.gallery-overlay-close');

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
  if (event.keyCode === ESC_KEYCODE) {
    hiddenGalleryOverlay();
  }
};

picturesContainer.addEventListener('click', function (event) {
  event.preventDefault();
  showGalleryOverlay(event);
});

picturesContainer.addEventListener('keydown', function (event) {
  if (event.keyCode === ENTER_KEYCODE) {
    showGalleryOverlay(event);
  }
});

galleryOverlayClose.addEventListener('click', function () {
  hiddenGalleryOverlay();
});

galleryOverlayClose.addEventListener('keydown', function (event) {
  if (event.keyCode === ENTER_KEYCODE) {
    hiddenGalleryOverlay();
  }
});
