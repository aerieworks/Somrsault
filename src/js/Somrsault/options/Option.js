'use strict';
window.Somrsault.options.Option = (function () {

  var defaults = {
    id: null,
    list: false,
    defaultValue: null,
    type: String
  };

  function Option(module, config) {
    if (config.id == null) {
      throw 'Option.id is required.';
    } else if (config.type != null && !$.isFunction(config.type)) {
      throw 'Option.type must be a function.';
    }

    $.extend(this, defaults, config);
    this.module = module;
    this.onChange = $.Callbacks();
  }

  function deserializeScalar(me, value) {
    return new me.type(value).valueOf();
  }

  function deserialize(value) {
    if (value == null) {
      if (this.defaultValue == null) {
        return null;
      }
      value = this.defaultValue;
    }

    if (this.list) {
      var me = this;
      return value.map(function (item) {
        return deserializeScalar(me, item);
      });
    } else {
      return deserializeScalar(this, value);
    }
  }

  function serializeScalar(value) {
    if (typeof value.serialize == 'function') {
      return value.serialize();
    } else {
      return value;
    }
  }

  function serialize(value) {
    if (value == null) {
      return null;
    }

    if (this.list) {
      var me = this;
      return value.map(function (item) {
        return serializeScalar(item);
      });
    } else {
      return serializeScalar(value);
    }
  }

  Option.prototype = {
    deserialize: deserialize,
    serialize: serialize
  };

  return Option;
})();
