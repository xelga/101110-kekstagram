'use strict';
(function () {
  var uploadOverlay = document.querySelector('.upload-overlay');
  var uploadForm = document.querySelector('.upload-form');
  var uploadFormCancel = uploadOverlay.querySelector('.upload-form-cancel');
  var uploadSelectImage = document.querySelector('#upload-select-image');
  var uploadEffectControls = uploadOverlay.querySelector('.upload-effect-controls');
  var uploadImagePreview = uploadOverlay.querySelector('.effect-image-preview');
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
    if (event.keyCode === window.util.ESC_KEYCODE) {
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

  var resizeStep = 25;

  var currentResizeControlsValue;
  var currentResizeControlsValueModified;

  uploadResizeButtonDec.addEventListener('click', function () {
    currentResizeControlsValue = parseInt(uploadResizeControlsValue.value, 10);
    currentResizeControlsValueModified = currentResizeControlsValue - resizeStep;

    if (currentResizeControlsValue >= 50 && currentResizeControlsValue <= 100) {
      uploadResizeControlsValue.value = currentResizeControlsValueModified + '%';
      uploadImagePreview.style.transform = 'scale(' + currentResizeControlsValueModified / 100 + ')';
    }
  });

  uploadResizeButtonInc.addEventListener('click', function () {
    currentResizeControlsValue = parseInt(uploadResizeControlsValue.value, 10);
    currentResizeControlsValueModified = currentResizeControlsValue + resizeStep;

    if (currentResizeControlsValue >= 25 && currentResizeControlsValue < 100) {
      uploadResizeControlsValue.value = currentResizeControlsValueModified + '%';
      uploadImagePreview.style.transform = 'scale(' + currentResizeControlsValueModified / 100 + ')';
    }
  });

  var sliderWrapper = uploadForm.querySelector('.upload-effect-level');
  var sliderContainer = uploadForm.querySelector('.upload-effect-level-line');
  var sliderHandle = sliderWrapper.querySelector('.upload-effect-level-pin');
  var sliderProgressBar = sliderWrapper.querySelector('.upload-effect-level-val');
  var sliderInput = sliderWrapper.querySelector('.upload-effect-level-value');
  var sliderContainerWidth;

  sliderWrapper.classList.add('hidden');

  var FILTERS = {
    chrome: {
      name: 'grayscale',
      min: 0,
      max: 1,
      measures: ''
    },
    sepia: {
      name: 'sepia',
      min: 0,
      max: 1,
      measures: ''
    },
    marvin: {
      name: 'invert',
      min: 0,
      max: 100,
      measures: '%'
    },
    phobos: {
      name: 'blur',
      min: 0,
      max: 5,
      measures: 'px'

    },
    heat: {
      name: 'brightness',
      min: 0,
      max: 3,
      measures: ''
    }
  };

  var currentFilterName;
  var filterMax;
  var filterMin;

  var getCurrentFilter = function (params, filterName, sliderValue) {
    var currentFilter = params[filterName].name + '(' + sliderValue + params[filterName].measures + ')';
    return currentFilter;
  };

  uploadEffectControls.addEventListener('change', function (event) {
    if (event.target.tagName.toLowerCase() === 'input') {
      currentFilterName = event.target.value;

      sliderWrapper.classList.add('hidden');
      uploadImagePreview.style.filter = 'none';

      if (currentFilterName !== 'none') {
        sliderWrapper.classList.remove('hidden');

        filterMax = FILTERS[currentFilterName].max;
        filterMin = FILTERS[currentFilterName].min;
        sliderContainerWidth = sliderContainer.offsetWidth;
        sliderHandle.style.left = sliderContainerWidth + 'px';
        sliderProgressBar.style.width = sliderContainerWidth + 'px';
        uploadImagePreview.style.filter = getCurrentFilter(FILTERS, currentFilterName, filterMax);
        sliderInput.value = filterMax;

        sliderHandle.addEventListener('mousedown', function (handleEvent) {
          handleEvent.preventDefault();

          var minHandleX = Math.round(handleEvent.target.parentNode.getBoundingClientRect().x);

          var onMouseMove = function (moveEvent) {
            moveEvent.preventDefault();

            var moveHandleX = moveEvent.clientX;
            var currentHandleX = moveHandleX - minHandleX;
            var sliderValue = Math.round((currentHandleX / sliderContainerWidth) * 100) / 100;
            var filterValue = ((filterMax - filterMin) * sliderValue) + filterMin;

            if (filterValue <= filterMax && filterValue >= filterMin) {
              sliderHandle.style.left = currentHandleX + 'px';
              sliderProgressBar.style.width = currentHandleX + 'px';
              uploadImagePreview.style.filter = getCurrentFilter(FILTERS, currentFilterName, filterValue);
              sliderInput.value = filterValue;
            }
          };

          var onMouseUp = function (upEvent) {
            upEvent.preventDefault();

            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
          };

          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
        });
      }
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

    for (var i = 0; i < splittedFormHashtagsValue.length; i++) {
      hashtagsItem = splittedFormHashtagsValue[i].toLowerCase();

      for (var j = i + 1; j < splittedFormHashtagsValue.length; j++) {
        if (hashtagsItem === splittedFormHashtagsValue[j].toLowerCase()) {
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
})();
