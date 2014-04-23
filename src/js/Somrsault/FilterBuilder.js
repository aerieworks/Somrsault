'use strict';
window.Somrsault.FilterBuilder = (function () {
  function addNewRule() {
    addRuleToList.bind(this)(this.newRule.val());
    this.newRule.val('');
    this.addRule.disable();
  }

  function addRuleToList(rule) {
    this.ruleList.append($('<option />').val(rule).text(rule));
  }

  function deleteSelectedRules(ev) {
    var selected = $(this.ruleList[0].selectedOptions);
    selected.remove();
    this.delRule.disable();
  }

  function newRule_onKeyUp(ev) {
    if (this.newRule.val() == '') {
      this.addRule.disable();
    } else if (ev.which == 13) {
      // User pressed Enter, so add the rule.
      addNewRule.bind(this)();
    } else {
      this.addRule.enable();
    }
  }

  function ruleList_onChange(ev) {
    var selected = this.ruleList[0].selectedOptions;
    if (selected.length == 0) {
      this.delRule.disable();
    } else {
      this.delRule.enable()
    }
  }

  function FilterBuilder(option) {
    this.option = option;

    var prefix = option.name;
    var node = option.optionsPage;
    this.newRule = $('#' + prefix + '-new', node);
    this.addRule = $('#' + prefix + '-add', node);
    this.delRule = $('#' + prefix + '-del', node);
    this.newRule = $('#' + prefix + '-new', node);
    this.ruleList = $('#' + prefix + '-list', node);

    this.addRule.disable();
    this.delRule.disable();

    this.addRule.click(addNewRule.bind(this));
    this.delRule.click(deleteSelectedRules.bind(this));
    this.newRule.keyup(newRule_onKeyUp.bind(this));
    this.ruleList.change(ruleList_onChange.bind(this));
  }

  FilterBuilder.prototype = {
    getOption: function getOption() {
      return this.option;
    },

    get: function get() {
      var rules = [];
      this.ruleList.children().each(function () {
        rules.push(this.value);
      });
      return rules;
    },

    set: function set(rules) {
      this.delRule.disable();
      this.ruleList.empty();

      for (var i = 0; i < rules.length; i++) {
        addRuleToList.bind(this)(rules[i]);
      }
    }
  };

  return FilterBuilder;
})();
