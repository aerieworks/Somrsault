'use strict';
$(function () {
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

  $.blockUI({ message: $('#loadingMessage') });
  rejectUsersBuilder = new Somr.FilterBuilder($('#newRejectUser'), $('#addRejectUser'), $('#delRejectUser'), $('#rejectUsers'));
  acceptTagsBuilder = new Somr.FilterBuilder($('#newAcceptTag'), $('#addAcceptTag'), $('#delAcceptTag'), $('#acceptTags'));
  rejectTagsBuilder = new Somr.FilterBuilder($('#newRejectTag'), $('#addRejectTag'), $('#delRejectTag'), $('#rejectTags'));
  acceptUsersBuilder = new Somr.FilterBuilder($('#newAcceptUser'), $('#addAcceptUser'), $('#delAcceptUser'), $('#acceptUsers'));
  options = new Somr.Options();
  options.load(function () {
    resetOptions();
    $('#btnSave').click(saveOptions);
    $.unblockUI();
  });
});
