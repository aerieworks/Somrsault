'use strict';
(function ($) {
  window.Somr = {};

  window.Somr.util = {
    log: function (message) {
      console.log('Somrsault: ' + message);
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
