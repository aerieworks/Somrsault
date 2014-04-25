'use strict';
(function ($) {
  var postContainer = $('#posts');
  if (postContainer.length == 0) {
    postContainer = $('#content');
  }

  var page = {
    location: window.location,
    postContainer: postContainer,
    onFilter: $.Callbacks()
  };

  var modules = Somrsault.modules.Module.getModules();
  Somrsault.options.Options.load(modules, function (options) {
    modules.forEach(function (module) {
      Somrsault.util.debug('Initializing module ' + module.id);
      module.initialize(page, options[module.id]);
    });
    modules.forEach(function (module) {
      Somrsault.util.debug('Executing module ' + module.id);
      module.execute(page, options[module.id]);
    });
  });
})(jQuery);
