'use strict';
window.Somrsault.modules = {};
window.Somrsault.modules.Module = (function ($) {

  var registeredModules = {};
  var moduleList = [];

  var defaults = {
    name: null,
    id: null,
    options: []
  };

  function Module(config) {
    $.extend(this, defaults, config);
    if (this.id == null || this.id == '') {
      this.id = this.name.replace(/\W/g, '_');
    } else if (!/^\w+$/.test(this.id)) {
      throw 'Invalid module ID: "' + this.id + '"';
    }

    this.serializers = [];

    var me = this;
    this.options = this.options.map(function (optionDef) {
      return new Somrsault.options.Option(me, optionDef);
    });
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

  return Module;
})(jQuery);
