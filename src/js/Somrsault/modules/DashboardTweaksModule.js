'use strict';
(function () {
  window.Somrsault.modules.Module.register({
    name: 'Dashboard Tweaks',
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
})();
