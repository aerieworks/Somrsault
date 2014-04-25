'use strict';
window.Somrsault.PostFilter = (function () {
  var blogNameRe = new RegExp('^([0-9a-z_-]+)$');

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

  function getPostUsers(post) {
    var users = [];
    post.find('a[data-tumblelog-popover]').each(function () {
      var match = blogNameRe.exec(this.textContent);
      if (match) {
        users.push(match[1]);
      }
    });

    return users;
  }

  function getPostTags(post) {
    var tags = post.find('.post_tag');
    var tagList = [];
    for (var i = 0; i < tags.length; i++) {
      tagList.push(tags[i].textContent.toLowerCase());
    }

    return tagList;
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

  function filterPosts(me, posts) {
    var count = posts.length;
    var lastUser;
    var postUsers;
    var postTags;
    var post;
    for (var i = 0; i < count; i++) {
      post = $(posts[i]);
      me.lastPost = post;
      postUsers = getPostUsers(post);
      if (postUsers.length == 0) {
        postUsers = [ lastUser ];
      } else {
        lastUser = postUsers[0];
      }
      Somrsault.util.debug('Examining post by "' + postUsers.join(', ') + '"...');

      postTags = getPostTags(post);

      var filteredUsers = findMatches(postUsers, me.rejectUsers);
      var filteredTags = findMatches(postTags, me.rejectTags);
      if ((filteredUsers.length > 0 && !isPostTagged(postTags, me.acceptTags)) || (filteredTags.length > 0 && !isPostBy(postUsers, me.acceptUsers))) {
        var reasons = [];
        if (filteredUsers.length > 0) {
          reasons.push({ type: 'user', matches: filteredUsers });
        }
        if (filteredTags.length > 0) {
          reasons.push({ type: 'tag', matches: filteredTags });
        }
        rejectPost(me, post, reasons);
      }
    }
  }

  function rejectPost(me, post, reasons) {
    Somrsault.util.log('Hiding post ' + post.attr('id'));
    post.closest('.post_container').addClass('somr-filtered');
    me.page.onFilter.fire(me.page, post, reasons);
  }

  function PostFilter(page, options) {
    var me = this;
    this.page = page;
    this.lastPost = null;
    Somrsault.util.debug('Building rejected users map...');
    this.rejectUsers = buildRuleMap(options.rejectUsers);
    Somrsault.util.debug('Building accepted tags map...');
    this.acceptTags = buildRuleMap(options.acceptTags, '#');
    Somrsault.util.debug('Building rejected tags map...');
    this.rejectTags = buildRuleMap(options.rejectTags, '#');
    Somrsault.util.debug('Building accepted users map...');
    this.acceptUsers = buildRuleMap(options.acceptUsers);

    filterPosts(this, page.postContainer.children('.post_container').not('#new_post_buttons').children('.post'));

    // When the post container is modified, look for new posts and filter them.
    page.postContainer.bind('DOMSubtreeModified', function (ev) {
      setTimeout(function () {
        Somrsault.util.debug('Post container modified.');
        if (me.lastPost != null) {
          Somrsault.util.debug('Filtering newly loaded posts after ' + me.lastPost.attr('id'));
          filterPosts(me, me.lastPost.closest('.post_container').nextAll('.post_container').children('.post'));
        }
      }, 1);
    });
  }

  return PostFilter;
})();
