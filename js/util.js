'use strict';

(function () {
  var ERROR_INTERVAL = 5000; // ms
  var DEBOUNCE_INTERVAL = 500; // ms
  var lastTimeout;

  window.util = {
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13,
    appendErrorContainer: function () {
      var errorContainer = document.createElement('div');
      errorContainer.classList.add('error-container');
      errorContainer.style = 'position: fixed; top: 25px; left: 25px; z-index: 10;';
      document.body.appendChild(errorContainer);
    },
    createErrorNode: function (errorMessage) {
      var errorContainer = document.querySelector('.error-container');
      var errorNode = document.createElement('div');
      errorNode.textContent = errorMessage;
      errorNode.style = 'background: #f00; max-width: 300px; padding: 15px 20px; margin-bottom: 15px; color: #fff;';
      errorContainer.appendChild(errorNode);

      return errorNode;
    },
    removeErrorNode: function (element) {
      setTimeout(function () {
        element.parentNode.removeChild(element);
      }, ERROR_INTERVAL);
    },
    debounce: function (fun) {
      if (lastTimeout) {
        clearTimeout(lastTimeout);
      }

      lastTimeout = setTimeout(fun, DEBOUNCE_INTERVAL);
    }
  };
})();

