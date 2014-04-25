'use strict';
(function () {
  window.Somrsault.modules.Module.register({
    name: 'Filters',
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
    ]/*,
    onBind: function FilterModule_onBind(optionsPage) {
      $('#filterDashboard').click(function (ev) {
        setFilterEnabledStatus();
      });
    },
    onLoad: function FilterModule_onLoad() {
      setFilterEnabledStatus();
    },
    optionsPageContent:
'<div class="checkbox-field-container">' +
'  <input type="checkbox" id="filterDashboard" class="option" />' +
'  <label for="filterDashboard"></label>' +
'' +
'  <div class="subsettings rule-set-pair">' +
'    <div class="rule-set">' +
'      <label for="rejectUsers-new" class="reject-message">Hide posts from:</label>' +
'      <br />' +
'      <input type="text" id="rejectUsers-new" size="20" placeholder="user" />' +
'      <input type="button" id="rejectUsers-add" value="+" />' +
'      <input type="button" id="rejectUsers-del" value="-" />' +
'      <br />' +
'      <select id="rejectUsers-list" class="rule-list" size="10" multiple="multiple"></select>' +
'    </div>' +
'' +
'    <div class="rule-set">' +
'      <label for="acceptTags-new" class="accept-message">Except when tagged:</label>' +
'      <br />' +
'      <input type="text" id="acceptTags-new" size="20" placeholder="tag" />' +
'      <input type="button" id="acceptTags-add" value="+" />' +
'      <input type="button" id="acceptTags-del" value="-" />' +
'      <br />' +
'      <select id="acceptTags-list" class="rule-list" size="10" multiple="multiple"></select>' +
'    </div>' +
'  </div>' +
'' +
'  <div class="subsettings rule-set-pair">' +
'    <div class="rule-set">' +
'      <label for="rejectTags-new" class="reject-message">Hide posts tagged:</label>' +
'      <br />' +
'      <input type="text" id="rejectTags-new" size="20" placeholder="tag" />' +
'      <input type="button" id="rejectTags-add" value="+" />' +
'      <input type="button" id="rejectTags-del" value="-" />' +
'      <br />' +
'      <select id="rejectTags-list" class="rule-list" size="10" multiple="multiple"></select>' +
'    </div>' +
'' +
'    <div class="rule-set">' +
'      <label for="acceptUsers-new" class="accept-message">Except when from:</label>' +
'      <br />' +
'      <input type="text" id="acceptUsers-new" size="20" placeholder="user" />' +
'      <input type="button" id="acceptUsers-add" value="+" />' +
'      <input type="button" id="acceptUsers-del" value="-" />' +
'      <br />' +
'      <select id="acceptUsers-list" class="rule-list" size="10" multiple="multiple"></select>' +
'    </div>' +
'  </div>' +
'</div>'
*/
  });
})();

