'use strict';
(function () {
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
