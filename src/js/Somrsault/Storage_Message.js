'use strict';
Somrsault.util.define('Somrsault.Storage', {
  save: function save(key, obj, callback) {
    chrome.extension.sendRequest({ action: 'save', data: { key: key, obj: obj } }, callback);
  },

  load: function load(key, callback) {
    chrome.extension.sendRequest({ action: 'load', data: { key: key } }, callback);
  }
});
