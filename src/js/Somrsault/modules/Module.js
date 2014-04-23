'use strict';
window.Somrsault.Module = (function ($) {

  var registeredModules = {};
  var moduleList = [];

  var defaults = {
    name: null,
    id: null,
    optionsPageContent: null,
    optionsPage: null,
    onBind: $.noop,
    onLoad: $.noop,
    options: []
  };

  function Module(config) {
    $.extend(this, defaults, config);
    if (this.id == null || this.id == '') {
      this.id = this.name.replace(/\s/g, '-').toLowerCase();
    }

    this.serializers = [];
  }

  Module.register = function register(config) {
    var module = new Module(config);
    if (registeredModules.hasOwnProperty(module.id)) {
      throw "Module '" + module.id + '" already exists.';
    }

    registeredModules[module.id] = module;
    moduleList.push(module);
    return module;
  };

  Module.getModules = function getModules() {
    return moduleList;
  };

  Module.prototype = {
    bind: function bind(optionsPage, options) {
      this.optionsPage = optionsPage;

      var me = this;
      Object.getOwnPropertyNames(this.options).forEach(function (optionName) {
        var option = me.options[optionName];
        if (option.hasOwnProperty('serializer')) {
          me.serializers.push(new option.serializer(option));
        }

        if (option.hasOwnProperty('defaultValue')) {
          options[optionName] = option.defaultValue;
        }
      });

      this.onBind(optionsPage);
    },

    save: function save(options) {
      this.serializers.forEach(function (serializer) {
        options[serializer.getOption().name] = serializer.get();
      });
    },

    load: function load(options) {
      this.serializers.forEach(function (serializer) {
        serializer.set(options[serializer.getOption().name]);
      });

      this.onLoad();
    }
  };

  return Module;
})(jQuery);
