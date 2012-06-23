"use strict";
(function () {
    var OPTIONS_KEY = "options";

    $.extend(window.Somr, {
        Options: function Options() {
            // Initialize options to defaults.
            this.expandTagList = true;
        }
    });

    window.Somr.Options.prototype = {
        save: function (onSave) {
            Somr.Storage.save(OPTIONS_KEY, this, onSave);
        },

        load: function (onLoad) {
            var me = this;

            // Load options from storage.
            Somr.Storage.load(OPTIONS_KEY, function (deserialized) {
                $.extend(me, deserialized);
                Somr.util.safeInvoke(onLoad);
            });
        }
    };
})();
