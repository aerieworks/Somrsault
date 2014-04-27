'use strict';
(function () {
  function onPageLoad(page, options) {
    if (options.useNewFilters) {
      Somrsault.util.log('Filtering dashboard posts with new filters.');
      this.filter = new Somrsault.filter.AdvancedPostFilter(options.rules);
    } else {
      Somrsault.util.log('Not filtering dashboard posts with new filters.');
    }
  }

  function onExecute(page, options) {
    if (this.filter) {
      this.filter.execute(page);
    }
  }

  window.Somrsault.modules.Module.register({
    name: 'New Filters',
    onPageLoad: onPageLoad,
    onExecute: onExecute,
    options: [
      {
        id: 'useNewFilters',
        type: Boolean,
        defaultValue: true,
        label: 'Use new-style filters.'
      },
      {
        id: 'rules',
        type: Somrsault.filter.FilterRule,
        list: true,
        defaultValue: [],
        requires: 'useNewFilters',
        label: 'Rules:'
      }
    ]
  });
})();
