'use strict';

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
galleryOverlay.classList.remove('hidden');

galleryOverlay.querySelector('.gallery-overlay-image').src = photos[0].url;
galleryOverlay.querySelector('.likes-count').textContent = photos[0].likes;
galleryOverlay.querySelector('.comments-count').textContent = photos[0].comments.length.toString();
