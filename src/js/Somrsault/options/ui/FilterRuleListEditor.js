'use strict';
(function ($, E) {
  var valuesOptionBase = {
    type: String,
    list: true,
    defaultValue: [],
    label: null
  };

  function showNewRuleEditor(ev) {
    var ruleNode = renderRule(this);
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
      rule = new Somrsault.filter.FilterRule();
    }

    var selectedTypeValue = ruleNode.find('.filter-rule-part-editor.filter-rule-type').val();
    rule.filterType = Somrsault.filter.FilterRule.FilterTypes.getType(selectedTypeValue);
    rule.values = ruleNode.data('valuesEditor').get();
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
      ruleNode.data('valuesEditor').set(rule.values);
      ruleNode.removeClass('editing');
    }
  }

  function renderRule(me, rule) {
    var filterTypeEditor = $('<select class="filter-rule-part-editor filter-rule-type"></select>');
    Somrsault.filter.FilterRule.FilterTypes.getAllTypes().forEach(function (type) {
      filterTypeEditor.append($('<option></option>')
        .attr('value', type.value)
        .text(type.verb)
      );
    });

    var valuesEditorContainer = $('<span class="filter-rule-part-editor filter-rule-value"></span>');
    var ruleNode = $('<li class="filter-rule-container"></li>')
      .append($('<div class="filter-rule-description"></div>')
        .append('Block posts <span class="filter-rule-part filter-rule-type"></span>')
        .append(filterTypeEditor)
        .append('<span class="filter-rule-part filter-rule-value"></span>')
        .append(valuesEditorContainer)
        .append($('<span class="filter-rule-part filter-rule-actions">')
          .append('<button type="button" class="action filter-rule-action-edit">Edit</button>')
          .append('<button type="button" class="action filter-rule-action-delete">Delete</button>')
        )
      )
      .append($('<div class="filter-rule-part-editor"></div>')
        .append('<button type="button" class="action filter-rule-action-save">Save</button>')
        .append('<button type="button" class="action filter-rule-action-cancel">Cancel</button>')
      );

    me.list.append(ruleNode);

    var valuesOption = new Somrsault.options.Option(me.option.module, $.extend({}, valuesOptionBase, {
      id: me.option.id + 'Values'
    }));
    var valuesEditor = E.instantiateEditor(valuesOption, valuesEditorContainer, me.view);
    ruleNode.data('valuesEditor', valuesEditor);

    if (rule) {
      updateRule(ruleNode, rule);
      valuesEditor.set(rule.values);
    }

    return ruleNode;
  }

  function updateRule(node, rule) {
    node.data('rule', rule);
    node.find('.filter-rule-part.filter-rule-type').text(rule.filterType.verb);
    node.find('.filter-rule-part-editor.filter-rule-type').val(rule.filterType.value);
    node.find('.filter-rule-part.filter-rule-value').text(' "' + rule.values.join('", "') + '"');
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
      this.list.empty();
      var me = this;
      rules.forEach(function (rule) {
        var editableRule = new Somrsault.filter.FilterRule({
          filterType: rule.filterType,
          values: rule.values
        });
        var ruleNode = renderRule(me, editableRule);
      });
    }
  });

  E.register(FilterRuleListEditor, Somrsault.filter.FilterRule, true);
})(jQuery, Somrsault.options.ui.Editor);

