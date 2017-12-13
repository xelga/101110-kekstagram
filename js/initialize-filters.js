'use strict';

(function () {
  var uploadForm = document.querySelector('.upload-form');
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

  window.initializeFilters = function (element, callback) {
    if (element.tagName.toLowerCase() === 'input') {
      currentFilterName = element.value;

      sliderWrapper.classList.add('hidden');
      if (typeof callback === 'function') {
        callback('none');
      }

      if (currentFilterName !== 'none') {
        sliderWrapper.classList.remove('hidden');

        filterMax = FILTERS[currentFilterName].max;
        filterMin = FILTERS[currentFilterName].min;
        sliderContainerWidth = sliderContainer.offsetWidth;
        sliderHandle.style.left = sliderContainerWidth + 'px';
        sliderProgressBar.style.width = sliderContainerWidth + 'px';
        if (typeof callback === 'function') {
          callback(getCurrentFilter(FILTERS, currentFilterName, filterMax));
        }
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
              if (typeof callback === 'function') {
                callback(getCurrentFilter(FILTERS, currentFilterName, filterValue));
              }
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
  };
})();
