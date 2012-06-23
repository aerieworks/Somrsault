"use strict";
(function () {
    var options = new Somr.Options();

    function registerLosingPlaceWarning() {
        var posts = $('#posts');
        var warnTriggerHeight = posts.offset().top + posts.outerHeight();
        posts = null;

        window.onbeforeunload = function () {
            var body = $('body');

            // Only warn if the user has scrolled past the initial contents of the dashboard.
            if (body.scrollTop() > warnTriggerHeight) {
                return "Warning! If you reload or leave your dashboard now, you will lose your place!";
            }

            return null;
        };
    }

    options.load(function () {
        if (options.expandTagList) {
            Somr.util.log('Expanding tags');
            $('#posts').addClass('expandTags');
        } else {
            Somr.util.log('Not expanding tags');
        }

        if (options.warnIfLosingPlace) {
            registerLosingPlaceWarning();
        }
    });
})();
