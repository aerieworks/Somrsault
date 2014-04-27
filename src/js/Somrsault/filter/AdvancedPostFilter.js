'use strict';
Somrsault.util.define('Somrsault.filter.AdvancedPostFilter', (function (base) {

  function AdvancedPostFilter(rules) {
    base.call(this);
    this.name = 'Advanced';

    var tagsToFilter = rules.map(function (rule) {
      return rule.value
        .replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")
        .replace(/\s+/g, '\\s+');
    });

    this.tagRegEx = new RegExp('^#\\s*(' + tagsToFilter.join('|') + ')\\s*$', 'gi');
    Somrsault.util.debug('Tag filter regular expression: ' + this.tagRegEx.toString());
  }

  function filterPost(post) {
    var tags = this.getPostTags(post);
    Somrsault.util.debug('Adv testing post ' + post.attr('id') + ': <' + tags + '>');
    for (var i = 0; i < tags.length; i++) {
      var matches = tags[i].match(this.tagRegEx);
      if (matches) {
        Somrsault.util.debug('Found tag "' + tags[i] + '" matches: <' + matches.join('>, <') + '>');
        return [{ type: 'tag', matches: matches }];
      }
    }
  }

  AdvancedPostFilter.prototype = $.extend(Object.create(base.prototype), {
    filterPost: filterPost
  });

  return AdvancedPostFilter;
})(Somrsault.filter.PostFilter));
