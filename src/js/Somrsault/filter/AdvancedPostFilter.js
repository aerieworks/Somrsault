'use strict';
Somrsault.util.define('Somrsault.filter.AdvancedPostFilter', (function (base, FT) {

  function AdvancedPostFilter(rules) {
    base.call(this);
    this.name = 'Advanced';
    this.rules = rules;
  }

  function filterPost(post) {
    var details = {};
    details[FT.Tag.value] = this.getPostTags(post);
    details[FT.Blog.value] = this.getPostUsers(post);

    for (var i = 0; i < this.rules.length; i++) {
      var matches = this.rules[i].test(details);
      if (matches) {
        var result = [{ type: this.rules[i].filterType, matches: matches }];
        return result;
      }
    }

    return null;
  }

  AdvancedPostFilter.prototype = $.extend(Object.create(base.prototype), {
    filterPost: filterPost
  });

  return AdvancedPostFilter;
})(Somrsault.filter.PostFilter, Somrsault.filter.FilterRule.FilterTypes));
