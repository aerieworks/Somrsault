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
    values: [],
    unless: null
  };

  function calculateTests(me) {
    me.tests = [];
    for (var i = 0; i < me.values.length; i++) {
      var reSafeValue = me.values[i]
        .replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")
        .replace(/\s+/g, '\\s+');
      if (me.filterType == FilterTypes.Tag) {
        reSafeValue = '#' + reSafeValue;
      }
      me.tests.push(new RegExp('^\\s*(' + reSafeValue + ')\\s*$', 'gi'));
    }
  }

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

    calculateTests(this);

    if (this.unless) {
      this.unless = new FilterRule(this.unless);
    }
  }

  FilterRule.prototype = {
    copy: function copy() {
      var ruleCopy = new FilterRule({
        filterType: this.filterType,
        values: this.values
      });

      if (this.unless) {
        ruleCopy.unless = this.unless.copy();
      }

      return ruleCopy;
    },

    serialize: function serialize() {
      var serialized = {
        filterType: this.filterType.value,
        values: this.values
      };

      if (this.unless) {
        serialized.unless = this.unless.serialize();
      }

      return serialized;
    },

    setValues: function setValues(values) {
      this.values = values;
      calculateTests(this);
    },

    test: function test(postDetails) {
      var items = postDetails[this.filterType.value];
      var matched = false;
      var item;
      for (var i = 0; !matched && i < items.length; i++) {
        item = items[i];
        for (var j = 0; !matched && j < this.tests.length; j++) {
          if (item.match(this.tests[j])) {
            if (!this.unless || this.unless.test(postDetails) == null) {
              return [ item ];
            }
          }
        }
      }

      return null;
    }
  };

  FilterRule.FilterTypes = FilterTypes;
  return FilterRule;
})());
