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

var uploadOverlay = document.querySelector('.upload-overlay');
var uploadForm = document.querySelector('.upload-form');
var uploadFormCancel = uploadOverlay.querySelector('.upload-form-cancel');
var uploadSelectImage = document.querySelector('#upload-select-image');
var uploadEffectControls = uploadOverlay.querySelector('.upload-effect-controls');
var uploadImagPreview = uploadOverlay.querySelector('.effect-image-preview');
var uploadFormHashtags = uploadOverlay.querySelector('.upload-form-hashtags');
var uploadFormDescription = uploadOverlay.querySelector('.upload-form-description');
var uploadResizeButtonDec = uploadOverlay.querySelector('.upload-resize-controls-button-dec');
var uploadResizeButtonInc = uploadOverlay.querySelector('.upload-resize-controls-button-inc');
var uploadResizeControlsValue = uploadOverlay.querySelector('.upload-resize-controls-value');

var showUploadOverlay = function () {
  uploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', onUploadOverlayEscPress);
};

var hiddenUploadOverlay = function () {
  uploadOverlay.classList.add('hidden');
  document.removeEventListener('keydown', onUploadOverlayEscPress);
};

var onUploadOverlayEscPress = function (event) {
  if (event.keyCode === ESC_KEYCODE) {
    if (document.activeElement !== uploadFormHashtags && document.activeElement !== uploadFormDescription) {
      hiddenUploadOverlay();
    }
  }
};

uploadSelectImage.addEventListener('change', function () {
  showUploadOverlay();
});

uploadFormCancel.addEventListener('click', function () {
  hiddenUploadOverlay();
});

var currentEffectName;
var resizeStep = 25;

uploadEffectControls.addEventListener('click', function (event) {
  if (event.target.tagName === 'INPUT') {
    var currentEffectControl = event.target.value;
    if (uploadImagPreview.classList.contains(currentEffectName)) {
      uploadImagPreview.classList.remove(currentEffectName);
    }
    currentEffectName = 'effect-' + currentEffectControl;
    uploadImagPreview.classList.add(currentEffectName);
  }
  return currentEffectName;
});

var currentResizeControlsValue;
var currentResizeControlsValueModified;

uploadResizeButtonDec.addEventListener('click', function () {
  currentResizeControlsValue = parseInt(uploadResizeControlsValue.value, 10);
  currentResizeControlsValueModified = currentResizeControlsValue - resizeStep;

  if (currentResizeControlsValue >= 50 && currentResizeControlsValue <= 100) {
    uploadResizeControlsValue.value = currentResizeControlsValueModified + '%';
    uploadImagPreview.style.transform = 'scale(' + currentResizeControlsValueModified / 100 + ')';
  }
});

uploadResizeButtonInc.addEventListener('click', function () {
  currentResizeControlsValue = parseInt(uploadResizeControlsValue.value, 10);
  currentResizeControlsValueModified = currentResizeControlsValue + resizeStep;

  if (currentResizeControlsValue >= 25 && currentResizeControlsValue < 100) {
    uploadResizeControlsValue.value = currentResizeControlsValueModified + '%';
    uploadImagPreview.style.transform = 'scale(' + currentResizeControlsValueModified / 100 + ')';
  }
});

var formHashtagsValue;
var formValid = true;

var splitFormHashtagsValue = function (params) {
  formHashtagsValue = params;
  var splittedFormHashtagsValue = formHashtagsValue.split(' ');
  return splittedFormHashtagsValue;
};

var validateFormHashtags = function (params) {
  if (!params) {
    return true;
  }

  formValid = true;
  var splittedFormHashtagsValue = splitFormHashtagsValue(params);
  var hashtagsItem;

  if (splittedFormHashtagsValue.length > 5) {
    formValid = false;
  }

  for (var b = 0; b < splittedFormHashtagsValue.length; b++) {
    hashtagsItem = splittedFormHashtagsValue[b].toLowerCase();

    for (var c = b + 1; c < splittedFormHashtagsValue.length; c++) {
      if (hashtagsItem === splittedFormHashtagsValue[c].toLowerCase()) {
        formValid = false;
      }
    }

    if (hashtagsItem[0] !== '#') {
      formValid = false;
    }

    if (hashtagsItem.length < 2) {
      formValid = false;
    }

    if (hashtagsItem.length > 20) {
      formValid = false;
    }
  }

  return formValid;
};

uploadFormHashtags.addEventListener('change', function () {
  formHashtagsValue = uploadFormHashtags.value;
  if (formHashtagsValue[formHashtagsValue.length - 1] === ' ') {
    formHashtagsValue = formHashtagsValue.slice(0, -1);
  }

  if (validateFormHashtags(formHashtagsValue)) {
    uploadFormHashtags.style.borderColor = 'inherit';
  } else {
    uploadFormHashtags.style.borderColor = 'red';
  }
});

uploadForm.addEventListener('submit', function (event) {
  if (!validateFormHashtags(formHashtagsValue)) {
    event.preventDefault();
  }
});
