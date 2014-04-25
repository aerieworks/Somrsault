'use strict';
window.Somrsault.options.ui.StringListEditor = (function (E) {

  function addItemToList(me, item) {
    me.itemList.append($('<option />').val(item).text(item));
  }

  function addNewItem() {
    addItemToList(this, this.newItem.val());
    this.newItem.val('');
    this.addItem.disable();
  }

  function deleteSelectedItems(ev) {
    var selected = $(this.itemList[0].selectedOptions);
    selected.remove();
    this.delItem.disable();
  }

  function newItem_onKeyUp(ev) {
    if (this.newItem.val() == '') {
      this.addItem.disable();
    } else if (ev.which == 13) {
      // User pressed Enter, so add the item.
      addNewItem.bind(this)();
    } else {
      this.addItem.enable();
    }
  }

  function itemList_onChange(ev) {
    var selected = this.itemList[0].selectedOptions;
    if (selected.length == 0) {
      this.delItem.disable();
    } else {
      this.delItem.enable()
    }
  }

  function StringListEditor(option, container, view) {
    E.call(this, option, container, view);
  }

  StringListEditor.prototype = $.extend(Object.create(E.prototype), {
    render: function render(container) {
      var newItemId = E.makeEditorId(this.option) + '-new';
      this.newItem = $('<input type="text" class="option" size="20" />').attr('id', newItemId);
      this.addItem = $('<input type="button" value="+" disabled="disabled" />');
      this.delItem = $('<input type="button" value="-" disabled="disabled" />');
      this.itemList = $('<select class="string-list-editor-field" size="10" multiple="multiple"></select>');

      container
        .append($('<label class="string-list-editor-label"></label>').attr('for', newItemId).text(this.option.label))
        .append(this.newItem)
        .append(this.addItem)
        .append(this.delItem)
        .append(this.itemList);

      this.addItem.click(addNewItem.bind(this));
      this.delItem.click(deleteSelectedItems.bind(this));
      this.newItem.keyup(newItem_onKeyUp.bind(this));
      this.itemList.change(itemList_onChange.bind(this));

      this.registerChangeTrigger(this.addItem, 'click');
      this.registerChangeTrigger(this.delItem, 'click');
      this.registerChangeTrigger(this.itemList, 'change');
    },

    get: function get() {
      var items = [];
      this.itemList.children().each(function() {
        items.push(this.value);
      });
      return items;
    },

    set: function set(items) {
      this.delItem.disable();
      this.itemList.empty();

      var me = this;
      items.forEach(function (item) {
        addItemToList(me, item);
      });
    }
  });

  E.register(StringListEditor, String, true);
  return StringListEditor;
})(Somrsault.options.ui.Editor);

