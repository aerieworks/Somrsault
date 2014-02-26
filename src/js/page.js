'use strict';
(function ($) {
  var options = new Somr.Options();
  var postContainer = $('#posts');
  if (postContainer.length == 0) {
    postContainer = $('#content');
  }

  function registerLosingPlaceWarning() {
    var warnTriggerHeight = postContainer.offset().top + postContainer.outerHeight();

    window.onbeforeunload = function () {
      var body = $('body');

      // Only warn if we haven't seen a reason not to warn and
      //  the user has scrolled past the initial contents of the dashboard.
      if (body.scrollTop() > warnTriggerHeight) {
        return 'Warning! If you reload or leave your dashboard now, you will lose your place!';
      }

      return null;
    };
  }

  options.load(function () {
    if (options.expandTagList) {
      Somr.util.log('Expanding tags.');
      postContainer.addClass('somr-expand-tags');
    } else {
      Somr.util.log('Not expanding tags.');
    }

    if (options.warnIfLosingPlace) {
      Somr.util.log('Warning when losing dashboard place.');
      registerLosingPlaceWarning();
    } else {
      Somr.util.log('Not warning when losing dashboard place.');
    }

    if (options.filterDashboard) {
      Somr.util.log('Filtering dashboard posts.');
      new Somr.PostFilter(options, postContainer);
    } else {
      Somr.util.log('Not filtering dashboard posts.');
    }
  });
})(jQuery);
