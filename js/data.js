'use strict';

(function () {
  var COMMENT_TEXTS = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  var photos = [];

  for (var i = 0; i < 25; i++) {
    var comments = [];
    for (var a = 0; a < window.util.getRandomNumber(1, 3); a++) {
      comments.push(COMMENT_TEXTS[window.util.getRandomNumber(0, COMMENT_TEXTS.length - 1)]);
    }

    photos.push({
      url: 'photos/' + (i + 1) + '.jpg',
      likes: window.util.getRandomNumber(15, 200),
      comments: comments
    });
  }

  window.data = photos;
})();

