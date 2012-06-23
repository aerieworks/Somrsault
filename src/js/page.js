"use strict";
(function () {
    var options = new Somr.Options();

    function registerLosingPlaceWarning() {
        var doNotWarn = false;
        var posts = $('#posts');
        var warnTriggerHeight = posts.offset().top + posts.outerHeight();
        posts = null;


        // Set the doNotWarn flag if the user clicks the "reblog" link without any modifier keys.
        $('a.reblog_button').live('click', function(ev) {
            doNotWarn = !(ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey);
        });

        window.onbeforeunload = function () {
            var body = $('body');

            // Only warn if we haven't seen a reason not to warn and
            //  the user has scrolled past the initial contents of the dashboard.
            if (!doNotWarn && body.scrollTop() > warnTriggerHeight) {
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
