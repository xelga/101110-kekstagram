'use strict';
(function () {
  var resizeStep = 25;
  var step = 4;

  window.initializeScale = function (element, callback, direction) {
    direction = direction ? 1 : -1;
    var scale = parseInt(element.value, 10);
    var currentResizeControlsValue = parseInt(element.value, 10);
    var currentResizeControlsValueModified = currentResizeControlsValue + resizeStep * direction;

    if (currentResizeControlsValueModified <= resizeStep * step && currentResizeControlsValueModified >= resizeStep) {
      scale = currentResizeControlsValueModified;
    }

    if (typeof callback === 'function') {
      callback(scale);
    }
  };
})();
