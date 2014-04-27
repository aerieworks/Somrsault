'use strict';
Somrsault.util.define('Somrsault.filter.AdvancedPostFilter', (function (base, FT) {

  function AdvancedPostFilter(rules) {
    base.call(this);
    this.name = 'Advanced';

    var tagsToFilter = [];
    var blogsToFilter = [];
    rules.forEach(function (rule) {
      var valueList;
      if (rule.filterType == FT.Tag) {
        valueList = tagsToFilter;
      } else if (rule.filterType == FT.Blog) {
        valueList = blogsToFilter;
      } else {
        Somrsault.util.warn('Unrecognized filter type: ' + rule.filterType.value);
        return;
      }

      for (var i = 0; i < rule.values.length; i++) {
        valueList.push(rule.values[i]
          .replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1")
          .replace(/\s+/g, '\\s+'));
      }
    });

    if (tagsToFilter.length) {
      this.tagRegEx = new RegExp('^#\\s*(' + tagsToFilter.join('|') + ')\\s*$', 'gi');
      Somrsault.util.debug('Tag filter regular expression: ' + this.tagRegEx.toString());
    } else {
      this.tagRegEx = null;
      Somrsault.util.debug('No tags to filter.');
    }

    if (blogsToFilter.length) {
      this.blogRegEx = new RegExp('^\\s*(' + blogsToFilter.join('|') + ')\\s*$', 'gi');
      Somrsault.util.debug('Blog filter regular expression: ' + this.blogRegEx.toString());
    } else {
      this.blogRegEx = null;
      Somrsault.util.debug('No blogs to filter.');
    }
  }

  function testPostItems(regEx, items, type) {
    if (regEx == null) {
      return;
    }

    for (var i = 0; i < items.length; i++) {
      var matches = items[i].match(regEx);
      if (matches) {
        return [{ type: type, matches: matches }];
      }
    }
  }

  function filterPost(post) {
    var result = testPostItems(this.tagRegEx, this.getPostTags(post), 'tag');
    if (result == null) {
      result = testPostItems(this.blogRegEx, this.getPostUsers(post), 'user');
    }

    return result;
  }

  AdvancedPostFilter.prototype = $.extend(Object.create(base.prototype), {
    filterPost: filterPost
  });

  return AdvancedPostFilter;
})(Somrsault.filter.PostFilter, Somrsault.filter.FilterRule.FilterTypes));
