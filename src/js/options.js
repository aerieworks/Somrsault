'use strict';
$(function () {
  var TAB_BUTTON_PREFIX = 'button-';
  var TAB_PAGE_PREFIX = 'page-';

  var modules = window.Somrsault.Module.getModules();
  var options = new Somrsault.Options();

  function getField(optName) {
    return $('#' + optName);
  }

  function getBoolean(option) {
    if (typeof option == 'string') {
      option = getField(option);
    }
    return !!(option.attr('checked'));
  }

  function setBoolean(optName, value, hasSubsettings) {
    var field = getField(optName);
    setBooleanAttribute(field, 'checked', value);

    if (hasSubsettings) {
      updateSubsettings(field);
    }
  }

  function setBooleanAttribute(nodes, property, value) {
    if (value) {
      nodes.attr(property, property);
    } else {
      nodes.removeAttr(property);
    }
  }

  function updateSubsettings(field) {
    /*
    var subsettings = field.siblings('.subsettings');
    if (subsettings.length > 0) {
      var value = getBoolean(field);
      subsettings.toggleClass('disabled', !value);

      var subfields = subsettings.find('input').add(subsettings.find('select'));
      setBooleanAttribute(subfields, 'disabled', !value);
    }
    */
  }


  function saveOptions() {
    $.blockUI({ message: $('#savingMessage') });
    $('.option').each(function (index, el) {
      options[el.id] = !!el.checked;
    });
    modules.forEach(function (module) {
      module.save(options);
    });
    options.save($.unblockUI);
  }

  function resetOptions(isInitializing) {
    $('.option').each(function (index, el) {
      $(el).attr('checked', !!options[el.id]);
    });
    $('.option-parent').each(function (index, el) {
      updateSubsettings($(el));
      if (isInitializing) {
        el.click(function () { updateSubsettings(el); });
      }
    });

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
  $(window.document.body).focus();

  options.load(function () {
    resetOptions(true);
    $('#btnSave').click(saveOptions);
    $('#btnReset').click(resetOptions);
  });
});
