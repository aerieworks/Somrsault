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

  function delectSelectedRules(ev) {
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

  function FilterBuilder(newRule, addRule, delRule, ruleList) {
    this.newRule = newRule;
    this.addRule = addRule;
    this.delRule = delRule;
    this.ruleList = ruleList;

    addRule.disable();
    delRule.disable();

    addRule.click(addNewRule.bind(this));
    delRule.click(delectSelectedRules.bind(this));
    newRule.keyup(newRule_onKeyUp.bind(this));
    ruleList.change(ruleList_onChange.bind(this));
  }

  FilterBuilder.prototype = {
    getRules: function() {
      var rules = [];
      this.ruleList.children().each(function () {
        rules.push(this.value);
      });
      return rules;
    },

    setRules: function (rules) {
      this.delRule.disable();
      this.ruleList.empty();

      for (var i = 0; i < rules.length; i++) {
        addRuleToList.bind(this)(rules[i]);
      }
    }
  };

  return FilterBuilder;
})();
