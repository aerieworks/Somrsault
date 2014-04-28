'use strict';
(function ($, E) {
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
    var values = ruleNode.find('.filter-rule-part-editor.filter-rule-value').val();
    rule.setValues(values.split(',').map(function (v) { return v.trim(); }));

    if (ruleNode.hasClass('filter-rule-has-unless')) {
      if (!rule.unless) {
        rule.unless = new Somrsault.filter.FilterRule();
      }

      var unlessSelectedTypeValue = ruleNode.find('.filter-rule-part-editor.filter-rule-unless-type').val();
      rule.unless.filterType = Somrsault.filter.FilterRule.FilterTypes.getType(unlessSelectedTypeValue);
      var unlessValues = ruleNode.find('.filter-rule-part-editor.filter-rule-unless-value').val();
      rule.unless.setValues(unlessValues.split(',').map(function (v) { return v.trim(); }));
    } else {
      rule.unless = null;
    }

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

  function addUnless(ev) {
    var ruleNode = $(ev.target).closest('.filter-rule-container');
    ruleNode.addClass('filter-rule-has-unless');
  }

  function removeUnless(ev) {
    var ruleNode = $(ev.target).closest('.filter-rule-container');
    ruleNode.removeClass('filter-rule-has-unless');
  }

  function renderRule(me, rule) {
    var filterTypeEditor = $('<select class="filter-rule-part-editor"></select>');
    Somrsault.filter.FilterRule.FilterTypes.getAllTypes().forEach(function (type) {
      filterTypeEditor.append($('<option></option>')
        .attr('value', type.value)
        .text(type.verb)
      );
    });

    var ruleNode = $('<li class="filter-rule-container"></li>')
      .append($('<div class="filter-rule-description"></div>')
        .append('Block posts <span class="filter-rule-part filter-rule-type"></span>')
        .append(filterTypeEditor.clone().addClass('filter-rule-type'))
        .append('<span class="filter-rule-part filter-rule-value"></span>')
        .append('<input type="text" class="filter-rule-part-editor filter-rule-value" />')
        .append($('<div class="filter-rule-without-unless"></div>')
          .append('<button type="button" class="sub-action filter-rule-action-add-unless">Unless...</button>')
        )
        .append($('<div class="filter-rule-with-unless"></div>')
          .append('unless post is <span class="filter-rule-part filter-rule-unless-type"></span>')
          .append(filterTypeEditor.clone().addClass('filter-rule-unless-type'))
          .append('<span class="filter-rule-part filter-rule-unless-value"></span>')
          .append('<input type="text" class="filter-rule-part-editor filter-rule-unless-value" />')
          .append($('<span class="filter-rule-part-editor filter-rule-actions">')
            .append('<button type="button" class="action filter-rule-action-remove-unless">Remove</button>')
          )
        )
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

    if (rule) {
      updateRule(ruleNode, rule);
    }

    return ruleNode;
  }

  function updateRule(node, rule) {
    node.data('rule', rule);
    node.find('.filter-rule-part.filter-rule-type').text(rule.filterType.verb);
    node.find('.filter-rule-part-editor.filter-rule-type').val(rule.filterType.value);
    node.find('.filter-rule-part.filter-rule-value').text(' "' + rule.values.join('", "') + '"');
    node.find('.filter-rule-part-editor.filter-rule-value').val(rule.values.join(', '));

    node.toggleClass('filter-rule-has-unless', !!rule.unless);
    if (rule.unless) {
      node.find('.filter-rule-part.filter-rule-unless-type').text(rule.unless.filterType.verb);
      node.find('.filter-rule-part-editor.filter-rule-unless-type').val(rule.unless.filterType.value);
      node.find('.filter-rule-part.filter-rule-unless-value').text(' "' + rule.unless.values.join('", "') + '"');
      node.find('.filter-rule-part-editor.filter-rule-unless-value').val(rule.unless.values.join(', '));
    }
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
        .on('click', '.filter-rule-action-delete', deleteRule.bind(this))
        .on('click', '.filter-rule-action-add-unless', addUnless.bind(this))
        .on('click', '.filter-rule-action-remove-unless', removeUnless.bind(this));
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
        renderRule(me, rule.copy());
      });
    }
  });

  E.register(FilterRuleListEditor, Somrsault.filter.FilterRule, true);
})(jQuery, Somrsault.options.ui.Editor);

