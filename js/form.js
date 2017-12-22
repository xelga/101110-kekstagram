'use strict';
(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var uploadOverlay = document.querySelector('.upload-overlay');
  var uploadForm = document.querySelector('.upload-form');
  var uploadFormCancel = uploadOverlay.querySelector('.upload-form-cancel');
  var uploadSelectImage = document.querySelector('#upload-select-image');
  var uploadInput = uploadSelectImage.querySelector('.upload-input');
  var uploadEffectControls = uploadOverlay.querySelector('.upload-effect-controls');
  var uploadImagePreview = uploadOverlay.querySelector('.effect-image-preview');
  var sliderWrapper = uploadOverlay.querySelector('.upload-effect-level');
  var uploadFormHashtags = uploadOverlay.querySelector('.upload-form-hashtags');
  var uploadFormDescription = uploadOverlay.querySelector('.upload-form-description');

  var resetUploadForm = function () {
    uploadForm.reset();
    uploadImagePreview.removeAttribute('style');
    sliderWrapper.classList.add('hidden');
  };

  var loadPicture = function (callback) {
    var file = uploadInput.files[0];
    var fileName = file.name.toLowerCase();
    var pictureWidth = 586; // px

    uploadImagePreview.style.width = pictureWidth + 'px';

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        uploadImagePreview.src = reader.result;

        if (typeof callback === 'function') {
          callback();
        }
      });

      reader.readAsDataURL(file);
    }
  };

  var showUploadOverlay = function () {
    uploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onUploadOverlayEscPress);
  };

  var hiddenUploadOverlay = function () {
    uploadOverlay.classList.add('hidden');
    resetUploadForm();
    document.removeEventListener('keydown', onUploadOverlayEscPress);
  };

  var onUploadOverlayEscPress = function (event) {
    if (event.keyCode === window.util.ESC_KEYCODE) {
      if (document.activeElement !== uploadFormHashtags && document.activeElement !== uploadFormDescription) {
        hiddenUploadOverlay();
      }
    }
  };

  uploadInput.addEventListener('change', function () {
    loadPicture(showUploadOverlay);
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
    window.initializeScale(uploadResizeControlsValue, adjustScale);
  });

  uploadResizeButtonInc.addEventListener('click', function () {
    window.initializeScale(uploadResizeControlsValue, adjustScale, true);
  });

  var applyFilter = function (filterValue) {
    uploadImagePreview.style.filter = filterValue;
  };

  uploadEffectControls.addEventListener('change', function (event) {
    window.initializeFilters(event.target, applyFilter);
  });

  var formHashtagsValue;

  var splitFormHashtagsValue = function (params) {
    formHashtagsValue = params;
    var splittedFormHashtagsValue = formHashtagsValue.split(' ');
    return splittedFormHashtagsValue;
  };

  var validateFormHashtags = function (params) {
    if (!params) {
      return true;
    }

    var splittedFormHashtagsValue = splitFormHashtagsValue(params);
    var hashtagsItem;
    var matches;

    matches = splittedFormHashtagsValue.some(function (item) {
      return item.length < 2 || item.length > 20 || item[0] !== '#';
    });

    if (matches) {
      return false;
    }

    if (splittedFormHashtagsValue.length > 5) {
      return false;
    }

    for (var i = 0; i < splittedFormHashtagsValue.length; i++) {
      hashtagsItem = splittedFormHashtagsValue[i].toLowerCase();

      for (var j = i + 1; j < splittedFormHashtagsValue.length; j++) {
        if (hashtagsItem === splittedFormHashtagsValue[j].toLowerCase()) {
          return false;
        }
      }
    }

    return true;
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

  var onFormLoad = function () {
    uploadOverlay.classList.add('hidden');
    resetUploadForm();
  };

  var onFormError = function (errorMessage) {
    var errorNode = window.util.createErrorNode(errorMessage);
    window.util.removeErrorNode(errorNode);
  };

  uploadForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (validateFormHashtags(formHashtagsValue)) {
      window.backend.save(new FormData(uploadForm), onFormLoad, onFormError);
    }
  });
})();
