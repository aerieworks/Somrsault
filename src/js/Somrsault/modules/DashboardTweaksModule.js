'use strict';
(function ($) {
  function registerLosingPlaceWarning(page) {
    var warnTriggerHeight = page.postContainer.offset().top + page.postContainer.outerHeight();

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

  function onPageLoad(page, options) {
    if (options.expandTagList) {
      Somrsault.util.log('Expanding tags.');
      page.postContainer.addClass('somr-expand-tags');
    } else {
      Somrsault.util.log('Not expanding tags.');
    }

    if (options.warnIfLosingPlace) {
      Somrsault.util.log('Warning when losing dashboard place.');
      registerLosingPlaceWarning(page);
    } else {
      Somrsault.util.log('Not warning when losing dashboard place.');
    }
  }

  window.Somrsault.modules.Module.register({
    name: 'Dashboard Tweaks',
    onPageLoad: onPageLoad,
    options: [
      {
        id: 'expandTagList',
        type: Boolean,
        label: 'Expand tag lists on dashboard posts.'
      },
      {
        id: 'warnIfLosingPlace',
        type: Boolean,
        label: 'Warn me if I am about to lose my place on the dashboard.'
      }
    ]
  });
})(jQuery);
