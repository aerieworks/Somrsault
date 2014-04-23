'use strict';
(function () {
  window.Somrsault.Module.register({
    name: 'Dashboard Tweaks',
    options: [
      { name: 'expandTagList', defaultValue: false },
      { name: 'warnIfLosingPlace', defaultValue: false }
    ],
    optionsPageContent:
'<div class="checkbox-field-container">' +
'  <input type="checkbox" id="expandTagList" class="option" />' +
'  <label for="expandTagList">Expand tag lists on dashboard posts</label>' +
'</div>' +
'<div class="checkbox-field-container">' +
'  <input type="checkbox" id="warnIfLosingPlace" class="option" />' +
'  <label for="warnIfLosingPlace">Warn me if I am about to lose my place on the dashboard</label>' +
'</div>'
  });
})();
