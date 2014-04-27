'use strict';
(function () {
  function onPageLoad(page, options) {
    if (options.filterDashboard) {
      Somrsault.util.log('Filtering dashboard posts.');
      this.filter = new Somrsault.filter.RejectAllowFilter(options);
    } else {
      Somrsault.util.log('Not filtering dashboard posts.');
    }
  }

  function onExecute(page, options) {
    if (this.filter) {
      this.filter.execute(page);
    }
  }

  Somrsault.modules.Module.register({
    name: 'Filters',
    onPageLoad: onPageLoad,
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

