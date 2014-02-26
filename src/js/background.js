'use strict';
$(function () {
  chrome.extension.onRequest.addListener(
    function (request, sender, callback) {
      if (request.action == 'save') {
        Somrsault.Storage.save(request.data.key, request.data.obj, callback);
      } else if (request.action == 'load') {
        Somrsault.Storage.load(request.data.key, callback);
      }
    }
  );
});
