'use strict';
$(function () {
  chrome.extension.onRequest.addListener(
    function (request, sender, callback) {
      if (request.action == 'save') {
        Somr.Storage.save(request.data.key, request.data.obj, callback);
      } else if (request.action == 'load') {
        Somr.Storage.load(request.data.key, callback);
      }
    }
  );
});
