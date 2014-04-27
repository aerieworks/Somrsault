'use strict';
(function () {
  function onPageLoad(page, options) {
    //this.filter = new Somrsault.AdvancedPostFilter(options.rules);
  }

  function onExecute(page, options) {

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
