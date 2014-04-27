'use strict';
(function () {
  window.Somrsault.modules.Module.register({
    name: 'New Filters',
    options: [
      {
        id: 'useNewFilters',
        type: Boolean,
        defaultValue: true,
        label: 'Use new-style filters.'
      },
      {
        id: 'rules',
        type: Somrsault.FilterRule,
        list: true,
        defaultValue: [],
        requires: 'useNewFilters',
        label: 'Rules:'
      }
    ]
  });
})();
