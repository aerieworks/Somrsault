'use strict';
window.Somrsault.options.ui.FilterRuleListEditor = (function ($, E) {

  function showNewRuleEditor(ev) {
    var ruleNode = renderRule();
    ruleNode.addClass('editing');
    this.list.append(ruleNode);
  }

  function editRule(ev) {
    $(ev.target).closest('.filter-rule-container').addClass('editing');
  }

  function deleteRule(ev) {
    $(ev.target).closest('.filter-rule-container').remove();
  }

  function saveRule(ev) {
    var ruleNode = $(ev.target).closest('.filter-rule-container');
    var rule = ruleNode.data('rule');
    if (rule == null) {
      rule = new Somrsault.FilterRule();
    }

    var selectedTypeValue = ruleNode.find('.filter-rule-part-editor.filter-rule-type').val();
    rule.filterType = Somrsault.FilterRule.FilterTypes.getType(selectedTypeValue);
    rule.value = ruleNode.find('.filter-rule-part-editor.filter-rule-value').val();
    updateRule(ruleNode, rule);
    ruleNode.removeClass('editing');
  }

  function cancelRule(ev) {
    var ruleNode = $(ev.target).closest('.filter-rule-container');
    var rule = ruleNode.data('rule');
    if (rule == null) {
      ruleNode.remove();
    } else {
      updateRule(ruleNode, rule);
      ruleNode.removeClass('editing');
    }
  }

  function renderRule() {
    var filterTypeEditor = $('<select class="filter-rule-part-editor filter-rule-type"></select>');
    Somrsault.FilterRule.FilterTypes.getAllTypes().forEach(function (type) {
      filterTypeEditor.append($('<option></option>')
        .attr('value', type.value)
        .text(type.verb)
      );
    });

    return $('<li class="filter-rule-container"></li>')
      .append($('<div class="filter-rule-description"></div>')
        .append('Block posts <span class="filter-rule-part filter-rule-type"></span>')
        .append(filterTypeEditor)
        .append('<span class="filter-rule-part filter-rule-value"></span><input type="text" class="filter-rule-part-editor filter-rule-value" />')
        .append($('<span class="filter-rule-part filter-rule-actions">')
          .append('<button type="button" class="action filter-rule-action-edit">Edit</button>')
          .append('<button type="button" class="action filter-rule-action-delete">Delete</button>')
        )
      )
      .append($('<div class="filter-rule-part-editor"></div>')
        .append('<button type="button" class="action filter-rule-action-save">Save</button>')
        .append('<button type="button" class="action filter-rule-action-cancel">Cancel</button>')
      );

  }

  function updateRule(node, rule) {
    node.data('rule', rule);
    node.find('.filter-rule-part.filter-rule-type').text(rule.filterType.verb);
    node.find('.filter-rule-part-editor.filter-rule-type').val(rule.filterType.value);
    node.find('.filter-rule-part.filter-rule-value').text(' "' + rule.value + '"');
    node.find('.filter-rule-part-editor.filter-rule-value').val(rule.value);
  }

  function FilterRuleListEditor(option, container, view) {
    E.call(this, option, container, view);
  }

  FilterRuleListEditor.prototype = $.extend(Object.create(E.prototype), {
    render: function render(container) {
      this.list = $('<ul class="filter-rule-list"></ul>');

      var addRule = $('<button type="button" class="action filter-rule-list-action-add">Add</button>');

      container
        .append(this.list)
        .append(addRule);

      this.list
        .on('click', '.filter-rule-action-save', saveRule.bind(this))
        .on('click', '.filter-rule-action-cancel', cancelRule.bind(this))
        .on('click', '.filter-rule-action-edit', editRule.bind(this))
        .on('click', '.filter-rule-action-delete', deleteRule.bind(this));
      addRule.on('click', showNewRuleEditor.bind(this));
    },

    get: function get() {
      var rules = [];
      this.list.children().each(function (index, child) {
        var rule = $(child).data('rule');
        rules.push($(child).data('rule'));
      });

      return rules;
    },

    set: function set(rules) {
      var me = this;
      var tempContainer = $('<div></div>');
      rules.forEach(function (rule) {
        var editableRule = new Somrsault.FilterRule({
          filterType: rule.filterType,
          value: rule.value
        });
        var ruleNode = renderRule();
        updateRule(ruleNode, editableRule);
        tempContainer.append(ruleNode);
      });

      this.list.empty();
      this.list.append(tempContainer.children());
    }
  });

  E.register(FilterRuleListEditor, Somrsault.FilterRule, true);
  return FilterRuleListEditor;
})(jQuery, Somrsault.options.ui.Editor);

