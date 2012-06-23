"use strict";
$(function () {
    var options;

    function getField(optName) {
        return $('[name=' + optName + ']');
    }

    function saveOptions() {
        $.blockUI({ message: $('#savingMessage') }); 
        options.expandTagList = !!(getField('expandTagList').attr('checked'));
        options.save($.unblockUI);
    }

    function resetOptions() {
        if (options.expandTagList) {
            getField('expandTagList').attr('checked', 'checked');
        } else {
            getField('expandTagList').removeAttr('checked');
        }
    }


    $.blockUI({ message: $('#loadingMessage') });
    options = new Somr.Options();
    options.load(function () {
        resetOptions();
        $('#btnSave').click(saveOptions);
        $.unblockUI();
    });
});
