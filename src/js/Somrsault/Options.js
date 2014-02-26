'use strict';
window.Somrsault.Options = (function () {
  var OPTIONS_KEY = 'Somrsault.Options.options';

  var defaults = {
    expandTagList: true,
    warnIfLosingPlace: true,
    filterDashboard: true,
    rejectTags: [],
    acceptUsers: [],
    rejectUsers: [],
    acceptTags: []
  };

  function Options() {
    // Initialize options to defaults.
    $.extend(this, defaults);
  }

  function load(onLoad) {
    var me = this;

    // Load options from storage.
    Somrsault.Storage.load(OPTIONS_KEY, function (deserialized) {
      $.extend(me, deserialized);
      Somrsault.util.safeInvoke(onLoad);
    });
  }

  function save(onSave) {
    Somrsault.Storage.save(OPTIONS_KEY, this, onSave);
  }

  Options.prototype = {
    load: load,
    save: save
  };

  return Options;
})();
