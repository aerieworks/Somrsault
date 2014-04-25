'use strict';
jQuery(function ($) {
  var O = Somrsault.options;
  var TAB_BUTTON_PREFIX = 'button-';
  var TAB_PAGE_PREFIX = 'page-';

  var modules = window.Somrsault.modules.Module.getModules();
  var options = null;
  var editors = [];
  var listeners = {};
  var view = {
    listenForChange: function listenForChange(optionId, callback) {
      if (!listeners.hasOwnProperty(optionId)) {
        listeners[optionId] = $.Callbacks();
      }

      listeners[optionId].add(callback);
    }
  };

  function editor_onChange(editor, value) {
    var optionId = editor.option.id;
    if (listeners.hasOwnProperty(optionId)) {
      listeners[optionId].fire(optionId, value);
    }
  }

  function saveOptions() {
    $.blockUI({ message: $('#savingMessage') });
    editors.forEach(function (editor) {
      editor.save(options);
    });
    O.Options.save(modules, options, $.unblockUI);
  }

  function resetOptions() {
    editors.forEach(function (editor) {
      editor.load(options);
    });
  }

  function selectTab() {
    var tabName = window.location.hash.substr(1);
    if (tabName.length == 0) {
      tabName = modules[0].id;
    }

    $('.selected').removeClass('selected');
    $('#' + TAB_BUTTON_PREFIX + tabName).addClass('selected');
    $('#' + TAB_PAGE_PREFIX + tabName).addClass('selected');
  }

  var tabButtonContainer = $('.tab-buttons');
  modules.forEach(function (module) {
    var button = $('<a class="tab-button"><span class="tab-button-content"></span></a>')
      .attr('id', TAB_BUTTON_PREFIX + module.id)
      .attr('href', '#' + module.id);
    button.children('.tab-button-content')
      .text(module.name);
    tabButtonContainer.append(button);

    var page = $('<div class="tab-page"></div>')
      .attr('id', TAB_PAGE_PREFIX + module.id);
    module.options.forEach(function (option) {
      var editor = O.ui.Editor.instantiateEditor(option, page, view);
      editor.onChange.add(editor_onChange);
      editors.push(editor);
    });
    tabButtonContainer.after(page);
  });

  $(window).bind('hashchange', selectTab);
  selectTab();

  O.Options.load(modules, function (deserialized) {
    options = deserialized;
    resetOptions();
    $('#btnSave').click(saveOptions);
    $('#btnReset').click(resetOptions);
  });
});
