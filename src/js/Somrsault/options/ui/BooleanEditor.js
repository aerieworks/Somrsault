'use strict';
window.Somrsault.options.ui.BooleanEditor = (function (E) {

  function BooleanEditor(option, container, view) {
    E.call(this, option, container, view);
  }

  BooleanEditor.prototype = $.extend(Object.create(E.prototype), {
    render: function render(container) {
      var fieldId = E.makeEditorId(this.option);
      this.field = $('<input type="checkbox" class="option" />').attr('id', fieldId);
      this.registerChangeTrigger(this.field, 'click');

      container
        .append(this.field)
        .append($('<label></label>').attr('for', fieldId).text(this.option.label));

    },

    get: function get() {
      return !!this.field.attr('checked');
    },

    set: function set(value) {
      this.field.attr('checked', !!value);
    }
  });

  E.register(BooleanEditor, Boolean);
  return BooleanEditor;
})(Somrsault.options.ui.Editor);
