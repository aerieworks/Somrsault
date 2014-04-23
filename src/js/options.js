'use strict';
$(function () {
  var TAB_BUTTON_PREFIX = 'button-';
  var TAB_PAGE_PREFIX = 'page-';

  var modules = window.Somrsault.Module.getModules();
  var options = new Somrsault.Options();

  function saveOptions() {
    $.blockUI({ message: $('#savingMessage') });
    modules.forEach(function (module) {
      module.save(options);
    });
    options.save($.unblockUI);
  }

  function resetOptions(isInitializing) {
    modules.forEach(function (module) {
      module.load(options);
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
    var button = $('<a class="tab-button"><span class="tab-button-content"></span></a>');
    button.attr('id', TAB_BUTTON_PREFIX + module.id);
    button.attr('href', '#' + module.id);
    button.children('.tab-button-content').text(module.name);
    tabButtonContainer.append(button);

    var page = $('<div class="tab-page"></div>')
      .attr('id', TAB_PAGE_PREFIX + module.id)
      .append(module.optionsPageContent);
    tabButtonContainer.after(page);
    module.bind(page, options);
  });

  $(window).bind('hashchange', selectTab);
  selectTab();

  options.load(function () {
    resetOptions(true);
    $('#btnSave').click(saveOptions);
    $('#btnReset').click(resetOptions);
  });
});
