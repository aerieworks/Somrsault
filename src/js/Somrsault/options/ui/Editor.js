'use strict';
Somrsault.util.define('Somrsault.options.ui.Editor', (function () {

  var registeredEditors = {};

  function editor_onChange(ev) {
    var editor = ev.data.editor;
    editor.onChange.fire(editor, editor.get());
  }

  function requires_onChange(optionId, value) {
    var isDisabled = !value;
    this.editorContainer
      .toggleClass('disabled', isDisabled)
      .find('input, select, textarea, button')
        .attr('disabled', isDisabled);
  }

  function Editor(option, container, view) {
    this.option = option;
    this.onChange = $.Callbacks();

    var typeName = getOptionTypeName(option.type, option.list);
    this.editorContainer = $('<div></div>').addClass(typeName + '-editor');
    this.render(this.editorContainer);

    if (this.option.requires) {
      view.listenForChange(this.option.requires, requires_onChange.bind(this));
    }

    container.append(this.editorContainer);
  }

  Editor.prototype = {
    registerChangeTrigger: function registerChangeTrigger(node, events) {
      node.bind(events, { editor: this }, editor_onChange);
    },

    render: function render(container) {
    },

    load: function load(options) {
      this.set(options[this.option.module.id][this.option.id]);
    },

    save: function save(options) {
      options[this.option.module.id][this.option.id] = this.get();
    }
  };

  function getOptionTypeName(optionType, isList) {
    if (optionType.name == null || optionType.name == '') {
      throw 'Option type must have a name.';
    }

    var name = optionType.name.toLowerCase();
    if (isList) {
      name += '-list';
    }

    return name;
  }

  function register(editorType, optionType, isList) {
    var optionTypeName = getOptionTypeName(optionType, isList);
    if (registeredEditors.hasOwnProperty(optionTypeName)) {
      throw 'A editor is already registered for "' + optionTypeName + '"';
    }

    registeredEditors[optionTypeName] = editorType;
  }

  function instantiateEditor(option, container, view) {
    var optionTypeName = getOptionTypeName(option.type, option.list);
    var editorType = registeredEditors[optionTypeName];
    if (editorType == null) {
      throw 'No editor registered for "' + optionTypeName + '"';
    }

    return new editorType(option, container, view);
  }

  function makeEditorId(option) {
    return 'editor-' + option.module.id + '-' + option.id;
  }

  Editor.instantiateEditor = instantiateEditor;
  Editor.makeEditorId = makeEditorId;
  Editor.register = register;
  return Editor;
})());
