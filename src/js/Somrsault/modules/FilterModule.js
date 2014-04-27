'use strict';
(function () {
  function onExecute(page, options) {
    if (options.filterDashboard) {
      Somrsault.util.log('Filtering dashboard posts.');
      new Somrsault.filter.PostFilter(page, options);
    } else {
      Somrsault.util.log('Not filtering dashboard posts.');
    }
  }

  Somrsault.modules.Module.register({
    name: 'Filters',
    onExecute: onExecute,
    options: [
      {
        id: 'filterDashboard',
        type: Boolean,
        defaultValue: true,
        label: 'Hide posts on my dashboard based on user or tag.'
      },
      {
        id: 'rejectUsers',
        type: String,
        list: true,
        defaultValue: [],
        requires: 'filterDashboard',
        label: 'Hide posts from:'
      },
      {
        id: 'acceptTags',
        type: String,
        list: true,
        defaultValue: [],
        requires: 'filterDashboard',
        label: 'Except when tagged:'
      },
      {
        id: 'rejectTags',
        type: String,
        list: true,
        defaultValue: [],
        requires: 'filterDashboard',
        label: 'Hide posts tagged:'
      },
      {
        id: 'acceptUsers',
        type: String,
        list: true,
        defaultValue: [],
        requires: 'filterDashboard',
        label: 'Except when from:'
      }
    ]
  });
})();

