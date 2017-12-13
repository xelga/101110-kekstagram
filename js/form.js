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

  var uploadResizeButtonDec = uploadOverlay.querySelector('.upload-resize-controls-button-dec');
  var uploadResizeButtonInc = uploadOverlay.querySelector('.upload-resize-controls-button-inc');
  var uploadResizeControlsValue = uploadOverlay.querySelector('.upload-resize-controls-value');

  var adjustScale = function (scale) {
    uploadResizeControlsValue.value = scale + '%';
    uploadImagePreview.style.transform = 'scale(' + scale / 100 + ')';
  };

  uploadResizeButtonDec.addEventListener('click', function () {
    window.initializeScale.callBack = adjustScale;
    window.initializeScale.scaleDown(uploadResizeControlsValue);
  });

  uploadResizeButtonInc.addEventListener('click', function () {
    window.initializeScale.callBack = adjustScale;
    window.initializeScale.scaleUp(uploadResizeControlsValue);
  });

  var applyFilter = function (filterValue) {
    uploadImagePreview.style.filter = filterValue;
  };

  uploadEffectControls.addEventListener('change', function (event) {
    window.initializeFilters(event.target, applyFilter);
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
