'use strict';
Somrsault.util.define('Somrsault.filter.RejectAllowFilter', (function (base) {

  function buildRuleMap(rules, prefix) {
    var map = {};
    var count = rules.length;
    var key;
    for (var i = 0; i < count; i++) {
      key = rules[i].toLowerCase();
      if (typeof prefix == 'string') {
        key = prefix + key;
      }
      Somrsault.util.debug('buildRuleMap: key: "' + key + '"');
      map[key] = true;
    }

    return map;
  }

  function findMatches(haystack, needleMap) {
    var matches = [];
    var haystackLength = haystack.length;
    for (var i = 0; i < haystackLength; i++) {
      if (!!needleMap[haystack[i]]) {
        matches.push(haystack[i]);
      }
    }
    return matches;
  }

  function isPostBy(postUsers, userMap) {
    var postUsersLength = postUsers.length;
    for (var i = 0; i < postUsersLength; i++) {
      if (!!userMap[postUsers[i]]) {
        return true;
      }
    }

    return false;
  }

  function isPostTagged(postTags, tagMap) {
    for (var i = 0; i < postTags.length; i++) {
      if (tagMap[postTags[i]]) {
        return true;
      }
    }
    return false;
  }

  function doFilter(posts) {
    var count = posts.length;
    var lastUser;
    var postUsers;
    var postTags;
    var post;
    for (var i = 0; i < count; i++) {
      post = $(posts[i]);
      this.lastPost = post;
      postUsers = this.getPostUsers(post);
      if (postUsers.length == 0) {
        postUsers = [ lastUser ];
      } else {
        lastUser = postUsers[0];
      }
      Somrsault.util.debug('Examining post by "' + postUsers.join(', ') + '"...');

      postTags = this.getPostTags(post);

      var filteredUsers = findMatches(postUsers, this.rejectUsers);
      var filteredTags = findMatches(postTags, this.rejectTags);
      if ((filteredUsers.length > 0 && !isPostTagged(postTags, this.acceptTags)) || (filteredTags.length > 0 && !isPostBy(postUsers, this.acceptUsers))) {
        var reasons = [];
        if (filteredUsers.length > 0) {
          reasons.push({ type: 'user', matches: filteredUsers });
        }
        if (filteredTags.length > 0) {
          reasons.push({ type: 'tag', matches: filteredTags });
        }
        this.rejectPost(post, reasons);
      }
    }
  }

  function RejectAllowFilter(page, options) {
    base.call(this, page, options);

    Somrsault.util.debug('Building rejected users map...');
    this.rejectUsers = buildRuleMap(options.rejectUsers);
    Somrsault.util.debug('Building accepted tags map...');
    this.acceptTags = buildRuleMap(options.acceptTags, '#');
    Somrsault.util.debug('Building rejected tags map...');
    this.rejectTags = buildRuleMap(options.rejectTags, '#');
    Somrsault.util.debug('Building accepted users map...');
    this.acceptUsers = buildRuleMap(options.acceptUsers);
  }

  RejectAllowFilter.prototype = $.extend(Object.create(base.prototype), {
    doFilter: doFilter
  });

  return RejectAllowFilter;
})(Somrsault.filter.PostFilter));
