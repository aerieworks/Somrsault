'use strict';
$(function () {
  var DEFAULT_TAB = 'dashboard-tweaks';
  var TAB_BUTTON_PREFIX = '#button-';
  var TAB_CONTENT_PREFIX = '#content-';

  var options;
  var rejectUsersBuilder;
  var acceptTagsBuilder;
  var rejectTagsBuilder;
  var acceptUsersBuilder;

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
      field.click(function () { updateSubsettings(field); });
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
    var subsettings = field.siblings('.subsettings');
    if (subsettings.length > 0) {
      var value = getBoolean(field);
      subsettings.toggleClass('disabled', !value);

      var subfields = subsettings.find('input').add(subsettings.find('select'));
      setBooleanAttribute(subfields, 'disabled', !value);
    }
  }


  function saveOptions() {
    $.blockUI({ message: $('#savingMessage') });
    options.expandTagList = getBoolean('expandTagList');
    options.warnIfLosingPlace = getBoolean('warnIfLosingPlace');
    options.filterDashboard = getBoolean('filterDashboard');
    options.rejectUsers = rejectUsersBuilder.getRules();
    options.acceptTags = acceptTagsBuilder.getRules();
    options.rejectTags = rejectTagsBuilder.getRules();
    options.acceptUsers = acceptUsersBuilder.getRules();
    options.save($.unblockUI);
  }

  function resetOptions() {
    setBoolean('expandTagList', options.expandTagList);
    setBoolean('warnIfLosingPlace', options.warnIfLosingPlace, true);
    setBoolean('filterDashboard', options.filterDashboard, true);
    rejectUsersBuilder.setRules(options.rejectUsers);
    acceptTagsBuilder.setRules(options.acceptTags);
    rejectTagsBuilder.setRules(options.rejectTags);
    acceptUsersBuilder.setRules(options.acceptUsers);
  }

  function selectTab() {
    var tabName = window.location.hash.substr(1);
    if (tabName.length == 0) {
      tabName = DEFAULT_TAB;
    }

    $('.selected').removeClass('selected');
    $(TAB_BUTTON_PREFIX + tabName).addClass('selected');
    $(TAB_CONTENT_PREFIX + tabName).addClass('selected');
  }

  $(window).bind('hashchange', selectTab);
  selectTab();
  $(window.document.body).focus();

  rejectUsersBuilder = new Somrsault.FilterBuilder($('#newRejectUser'), $('#addRejectUser'), $('#delRejectUser'), $('#rejectUsers'));
  acceptTagsBuilder = new Somrsault.FilterBuilder($('#newAcceptTag'), $('#addAcceptTag'), $('#delAcceptTag'), $('#acceptTags'));
  rejectTagsBuilder = new Somrsault.FilterBuilder($('#newRejectTag'), $('#addRejectTag'), $('#delRejectTag'), $('#rejectTags'));
  acceptUsersBuilder = new Somrsault.FilterBuilder($('#newAcceptUser'), $('#addAcceptUser'), $('#delAcceptUser'), $('#acceptUsers'));
  options = new Somrsault.Options();
  options.load(function () {
    resetOptions();
    $('#btnSave').click(saveOptions);
    $('#btnReset').click(resetOptions);
  });
});
