'use strict';

(function () {
  window.util = {
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13,
    getRandomNumber: function (min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
  };
})();

