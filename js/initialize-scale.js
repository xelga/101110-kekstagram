'use strict';
(function () {
  var resizeStep = 25;

  window.initializeScale = {
    scaleDown: function (element) {
      var scale = parseInt(element.value, 10);
      var currentResizeControlsValue = parseInt(element.value, 10);
      var currentResizeControlsValueModified = currentResizeControlsValue - resizeStep;

      if (currentResizeControlsValue >= 50 && currentResizeControlsValue <= 100) {
        scale = currentResizeControlsValueModified;
      }

      if (typeof window.initializeScale.callBack === 'function') {
        window.initializeScale.callBack(scale);
      }
    },
    scaleUp: function (element) {
      var scale = parseInt(element.value, 10);
      var currentResizeControlsValue = parseInt(element.value, 10);
      var currentResizeControlsValueModified = currentResizeControlsValue + resizeStep;

      if (currentResizeControlsValue >= 25 && currentResizeControlsValue < 100) {
        scale = currentResizeControlsValueModified;
      }

      if (typeof window.initializeScale.callBack === 'function') {
        window.initializeScale.callBack(scale);
      }
    },
    callBack: null
  };
})();
