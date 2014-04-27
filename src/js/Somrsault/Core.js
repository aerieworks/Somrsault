'use strict';
(function ($) {
  function define(typePath, constructor) {
    var pathParts = typePath.split('.');

    var typeName;
    if (constructor) {
      typeName = pathParts.pop();
    }

    var root = window;
    for (var i = 0; i < pathParts.length; i++) {
      var part = pathParts[i];
      if (!root.hasOwnProperty(part)) {
        root[part] = {};
      }
      root = root[part];
    }

    if (constructor) {
      root[typeName] = constructor;
    }
  }

  define('Somrsault.util', {
    debug: function (message) {
      Somrsault.util.log('[DEBUG] ' + message);
    },

    define: define,

    log: function (message) {
      console.log('Somrsault: [' + Date.now() + '] ' + message);
    },

    safeInvoke: function (method, args) {
      if (typeof method == 'function') {
        method.apply(null, args);
      }
    }
  });

  $.fn.extend({
    disable: function () {
      this.attr('disabled', 'disabled');
    },

    enable: function () {
      this.removeAttr('disabled');
    }
  });
})(jQuery);
