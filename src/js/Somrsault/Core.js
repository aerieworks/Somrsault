'use strict';
(function ($) {
  window.Somrsault = {};

  window.Somrsault.util = {
    debug: function (message) {
      Somrsault.util.log('[DEBUG] ' + message);
    },

    log: function (message) {
      console.log('Somrsault: [' + Date.now() + '] ' + message);
    },

    safeInvoke: function (method, args) {
      if (typeof method == 'function') {
        method.apply(null, args);
      }
    }
  };

  $.fn.extend({
    disable: function () {
      this.attr('disabled', 'disabled');
    },

    enable: function () {
      this.removeAttr('disabled');
    }
  });
})(jQuery);
