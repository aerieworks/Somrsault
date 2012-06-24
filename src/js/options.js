'use strict';
$(function () {
    var options;
    var rejectUsersBuilder;
    var rejectTagsBuilder;

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
        options.doNotWarnOnReblog = getBoolean('doNotWarnOnReblog');
        options.filterDashboard = getBoolean('filterDashboard');
        options.rejectUsers = rejectUsersBuilder.getRules();
        options.rejectTags = rejectTagsBuilder.getRules();
        options.save($.unblockUI);
    }

    function resetOptions() {
        setBoolean('expandTagList', options.expandTagList);
        setBoolean('warnIfLosingPlace', options.warnIfLosingPlace, true);
        setBoolean('doNotWarnOnReblog', options.doNotWarnOnReblog);
        setBoolean('filterDashboard', options.filterDashboard, true);
        rejectUsersBuilder.setRules(options.rejectUsers);
        rejectTagsBuilder.setRules(options.rejectTags);
    }

    $.blockUI({ message: $('#loadingMessage') });
    rejectUsersBuilder = new Somr.FilterBuilder($('#newRejectUser'), $('#addRejectUser'), $('#delRejectUser'), $('#rejectUsers'));
    rejectTagsBuilder = new Somr.FilterBuilder($('#newRejectTag'), $('#addRejectTag'), $('#delRejectTag'), $('#rejectTags'));
    options = new Somr.Options();
    options.load(function () {
        resetOptions();
        $('#btnSave').click(saveOptions);
        $.unblockUI();
    });
});
