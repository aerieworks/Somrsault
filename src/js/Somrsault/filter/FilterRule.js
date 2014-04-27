'use strict';
Somrsault.util.define('Somrsault.filter.FilterRule', (function () {
  var FilterTypes = {
    Tag: { value: 0, verb: 'tagged' },
    Blog: { value: 1, verb: 'from' },

    getAllTypes:  function getAllTypes() {
      return [ FilterTypes.Tag, FilterTypes.Blog ];
    },

    getType: function getType(value) {
      var types = this.getAllTypes();
      var numericValue = parseInt(value);
      for (var i = 0; i < types.length; i++) {
        if (types[i].value == numericValue) {
          return types[i];
        }
      }

      return null;
    }
  };

  var defaults = {
    filterType: FilterTypes.Tag,
    value: ''
  };

  function FilterRule(value) {
    $.extend(this, defaults, value);
    if ($.isNumeric(this.filterType)) {
      var me = this;
      FilterTypes.getAllTypes().forEach(function (type) {
        if (me.filterType == type.value) {
          me.filterType = type;
          return false;
        }
      });
    }
  }

  FilterRule.prototype = {
    serialize: function serialize() {
      return {
        filterType: this.filterType.value,
        value: this.value
      };
    }
  };

  FilterRule.FilterTypes = FilterTypes;
  return FilterRule;
})());
