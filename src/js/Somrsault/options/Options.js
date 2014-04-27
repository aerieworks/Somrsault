'use strict';
Somrsault.util.define('Somrsault.options.Options', (function () {
  var OPTIONS_KEY = 'Somrsault.Options.options';

  function crawlOptions(modules, source, callback) {
    modules.forEach(function (module) {
      var sourceValues = source.hasOwnProperty(module.id) ? source[module.id] : {};
      module.options.forEach(function (optionDef) {
        var sourceValue = sourceValues.hasOwnProperty(optionDef.id) ? sourceValues[optionDef.id] : null;
        callback(module, optionDef, sourceValue);
      });
    });
  }

  return {
    load: function load(modules, onLoad) {
      // Load options from storage.
      Somrsault.Storage.load(OPTIONS_KEY, function (serialized) {
        Somrsault.util.debug("Loading options: " + JSON.stringify(serialized));
        var options = {};
        crawlOptions(modules, serialized, function (module, optionDef, source) {
          if (!options.hasOwnProperty(module.id)) {
            options[module.id] = {};
          }

          options[module.id][optionDef.id] = optionDef.deserialize(source);
        });

        Somrsault.util.safeInvoke(onLoad, [ options ]);
      });
    },

    save: function save(modules, options, onSave) {
      var serialized = {};
      crawlOptions(modules, options, function (module, optionDef, source) {
        if (!serialized.hasOwnProperty(module.id)) {
          serialized[module.id] = {};
        }

        serialized[module.id][optionDef.id] = optionDef.serialize(source);
      });

      Somrsault.util.debug("Saving options: " + JSON.stringify(serialized));
      Somrsault.Storage.save(OPTIONS_KEY, serialized, onSave);
    }
  };
})());
