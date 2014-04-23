'use strict';
window.Somrsault.DefaultSerializer = (function () {

  function DefaultSerializer(option) {
    this.option = option;
  }

  function getOptionNode(option) {
    return $('#' + option.name);
  }

  DefaultSerializer.prototype = {
    getOption: function getOption() {
      return this.option;
    },

    get: function get() {
      var node = getOptionNode(this.option);
      if (node.attr('type') == 'checkbox') {
        return !!node.attr('checked');
      }

      throw 'Unsupported field type: ' + node[0].nodeName + ', ' + node.attr('type');
    },

    set: function set(value) {
      var node = getOptionNode(this.option);
      if (node.attr('type') == 'checkbox') {
        node.attr('checked', !!value);
        return;
      }

      throw 'Unsupported field type: ' + node[0].nodeName + ', ' + node.attr('type');
    }
  };

  return DefaultSerializer;
})();

