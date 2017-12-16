'use strict';

(function () {
  window.util = {
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13,
    createErrorNode: function (errorMessage) {
      var div = document.createElement('div');
      div.textContent = errorMessage;
      div.style = 'position: fixed; top: 25px; right: 25px; background: #f00; color: #fff; max-width: 300px; padding: 15px 20px; z-index: 10;';

      return div;
    }
  };
})();

