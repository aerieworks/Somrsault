'use strict';
(function ($) {
  var postContainer = $('#posts');
  if (postContainer.length == 0) {
    postContainer = $('#content');
  }

  var page = {
    location: window.location,
    postContainer: postContainer
  };

  var modules = Somrsault.modules.Module.getModules();
  Somrsault.options.Options.load(modules, function (options) {
    modules.forEach(function (module) {
      module.initialize(page, options[module.id]);
    });
  });
})(jQuery);
