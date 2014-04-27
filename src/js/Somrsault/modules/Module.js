'use strict';
window.Somrsault.modules = {};
window.Somrsault.modules.Module = (function ($) {

  var registeredModules = {};
  var moduleList = [];

  var defaults = {
    name: null,
    id: null,
    onPageLoad: $.noop,
    onExecute: $.noop,
    options: []
  };

  function Module(config) {
    $.extend(this, defaults, config);
    if (this.id == null || this.id == '') {
      this.id = this.name.replace(/\W/g, '_');
    } else if (!/^\w+$/.test(this.id)) {
      throw 'Invalid module ID: "' + this.id + '"';
    }

    var me = this;
    this.options = this.options.map(function (optionDef) {
      return new Somrsault.options.Option(me, optionDef);
    });
  }

  Module.prototype = {
    initialize: function initialize(page, options) {
      this.onPageLoad.call(this, page, options);
    },
    execute: function execute(page, options) {
      this.onExecute.call(this, page, options);
    }
  };

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
