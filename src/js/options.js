"use strict";
$(function () {
    var options;

    function getField(optName) {
        return $('[name=' + optName + ']');
    }

    function getBoolean(optName) {
        return !!(getField(optName).attr('checked'));
    }

    function setBoolean(optName, value) {
        var field = getField(optName);
        if (value) {
            field.attr('checked', 'checked');
        } else {
            field.removeAttr('checked');
        }
    }

    function saveOptions() {
        $.blockUI({ message: $('#savingMessage') }); 
        options.expandTagList = getBoolean('expandTagList');
        options.warnIfLosingPlace = getBoolean('warnIfLosingPlace');
        options.save($.unblockUI);
    }

    function resetOptions() {
        setBoolean('expandTagList', options.expandTagList);
        setBoolean('warnIfLosingPlace', options.warnIfLosingPlace);
    }

    $.blockUI({ message: $('#loadingMessage') });
    options = new Somr.Options();
    options.load(function () {
        resetOptions();
        $('#btnSave').click(saveOptions);
        $.unblockUI();
    });
});
