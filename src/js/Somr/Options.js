'use strict';
window.Somr.Options = (function () {
  var OPTIONS_KEY = 'Somr.Options.options';

  var defaults = {
    expandTagList: true,
    warnIfLosingPlace: true,
    doNotWarnOnReblog: true,
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
    Somr.Storage.load(OPTIONS_KEY, function (deserialized) {
      $.extend(me, deserialized);
      Somr.util.safeInvoke(onLoad);
    });
  }

  function save(onSave) {
    Somr.Storage.save(OPTIONS_KEY, this, onSave);
  }

  Options.prototype = {
    load: load,
    save: save
  };

  return Options;
})();
