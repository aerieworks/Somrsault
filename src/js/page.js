"use strict";
(function () {
    var options = new Somr.Options();
    options.load(function () {
        if (options.expandTagList) {
            Somr.util.log('Expanding tags');
            $('#posts').addClass('expandTags');
        } else {
            Somr.util.log('Not expanding tags');
        }
    });
})();
