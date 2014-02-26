'use strict';
(function () {
  window.Somrsault.Storage = {
    save: function save(key, obj, callback) {
      var serialized = JSON.stringify(obj);
      localStorage[key] = serialized;

      Somrsault.util.safeInvoke(callback);
    },

    load: function load(key, callback) {
      var deserialized = null;
      var serialized = localStorage[key];
      if (typeof serialized == 'string') {
        deserialized = JSON.parse(serialized);
      }

      callback(deserialized);
    }
  };
})();
