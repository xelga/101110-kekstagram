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

  var currentEffectName;
  var uploadEffectLevel = uploadForm.querySelector('.upload-effect-level');
  var uploadEffectLevelPin = uploadEffectLevel.querySelector('.upload-effect-level-pin');
  var uploadEffectLevelVal = uploadEffectLevel.querySelector('.upload-effect-level-val');
  var uploadEffectLevelValue = uploadEffectLevel.querySelector('.upload-effect-level-value');
  var handlerX;
  uploadEffectLevel.classList.add('hidden');

  uploadEffectControls.addEventListener('click', function (event) {
    if (event.target.tagName.toLowerCase() === 'input') {
      var currentEffectControl = event.target.value;
      if (uploadImagePreview.classList.contains(currentEffectName)) {
        uploadImagePreview.classList.remove(currentEffectName);
      }
      currentEffectName = 'effect-' + currentEffectControl;
      uploadImagePreview.classList.add(currentEffectName);
      if (uploadImagePreview.hasAttribute('style')) {
        uploadImagePreview.style.removeProperty('filter');
      }

      uploadEffectLevel.classList.add('hidden');

      if (event.target.value !== 'none') {
        uploadEffectLevel.classList.remove('hidden');

        var effectImage = uploadForm.querySelector('.' + currentEffectName);
        var effectImageStyles = getComputedStyle(effectImage);
        var effectImageStylesFilter = effectImageStyles.filter;
        var splittedEffectImageStylesFilter = effectImageStylesFilter.split('(');
        var effectImageFilterValue = parseInt(splittedEffectImageStylesFilter[1], 10);
        var uploadEffectLevelLine = uploadEffectLevel.querySelector('.upload-effect-level-line');

        uploadEffectLevelPin.style.left = uploadEffectLevelLine.offsetWidth + 'px';
        uploadEffectLevelVal.style.width = uploadEffectLevelLine.offsetWidth + 'px';
        uploadEffectLevelValue.value = effectImageFilterValue;

        uploadEffectLevelPin.addEventListener('mousedown', function (handlerEvent) {
          handlerEvent.preventDefault();

          var uploadEffectLevelLineWidth = uploadEffectLevelLine.offsetWidth;
          var minClientX = Math.round(handlerEvent.target.parentNode.getBoundingClientRect().x);

          var onMouseMove = function (moveEvent) {
            moveEvent.preventDefault();

            var moveClientX = moveEvent.clientX;
            handlerX = moveClientX - minClientX;
            uploadEffectLevelValue.value = handlerX;

            if (handlerX < 0) {
              handlerX = 0;
              uploadEffectLevelValue.value = 0;
            }

            if (handlerX > uploadEffectLevelLineWidth) {
              handlerX = uploadEffectLevelLineWidth;
              uploadEffectLevelValue.value = uploadEffectLevelLineWidth;
            }

            uploadEffectLevelPin.style.left = handlerX + 'px';
            uploadEffectLevelVal.style.width = handlerX + 'px';

            var moveEffectImageFilterValue = effectImageFilterValue * handlerX / uploadEffectLevelLineWidth;

            if (uploadImagePreview.classList.contains('effect-chrome')) {
              uploadImagePreview.style.filter = 'grayscale(' + moveEffectImageFilterValue + ')';
              uploadEffectLevelValue.value = moveEffectImageFilterValue;
            }

            if (uploadImagePreview.classList.contains('effect-sepia')) {
              uploadImagePreview.style.filter = 'sepia(' + moveEffectImageFilterValue + ')';
              uploadEffectLevelValue.value = moveEffectImageFilterValue;
            }

            if (uploadImagePreview.classList.contains('effect-marvin')) {
              uploadImagePreview.style.filter = 'invert(' + moveEffectImageFilterValue * 100 + '%)';
              uploadEffectLevelValue.value = moveEffectImageFilterValue * 100;
            }

            if (uploadImagePreview.classList.contains('effect-phobos')) {
              uploadImagePreview.style.filter = 'blur(' + moveEffectImageFilterValue + 'px)';
              uploadEffectLevelValue.value = moveEffectImageFilterValue;
            }

            if (uploadImagePreview.classList.contains('effect-heat')) {
              uploadImagePreview.style.filter = 'brightness(' + moveEffectImageFilterValue + ')';
              uploadEffectLevelValue.value = moveEffectImageFilterValue;
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

    return currentEffectName;
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
