'use strict';
window.Somr.PostFilter = (function () {
  function buildRuleMap(rules, prefix) {
    var map = {};
    var count = rules.length;
    var key;
    for (var i = 0; i < count; i++) {
      key = rules[i].toLowerCase();
      if (typeof prefix == 'string') {
        key = prefix + key;
      }
      Somr.util.log('buildRuleMap: key: "' + key + '"');
      map[key] = true;
    }

    return map;
  }

  function getPostUsers(post) {
    var users = [];
    post.find('a').each(function () {
      var username = this.textContent.trim();
      var hrefRe = new RegExp('^http://' + username + '.tumblr.com/');
      if (hrefRe.test(this.href)) {
        users.push(username);
      }
    });

    return users;
  }

  function getPostTags(post) {
    var tags = post.find('.tag');
    var tagList = [];
    for (var i = 0; i < tags.length; i++) {
      tagList.push(tags[i].textContent.toLowerCase());
    }

    return tagList;
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
      postUsers = getPostUsers(post);
      if (postUsers.length == 0) {
        postUsers = [ lastUser ];
      } else {
        lastUser = postUsers[0];
      }
      Somr.util.log('Examining post by "' + postUsers.join(', ') + '"...');

      postTags = getPostTags(post);

      if ((isPostBy(postUsers, me.rejectUsers) && !isPostTagged(postTags, me.acceptTags)) ||
        (isPostTagged(postTags, me.rejectTags) && !isPostBy(postUsers, me.acceptUsers))) {
        rejectPost(post);
      }

      me.lastPost = post;
    }
  }

  function rejectPost(post) {
    post.hide();
    Somr.util.log('Hiding post ' + post.attr('id'));
  }

  function PostFilter(options, postContainer) {
    var me = this;
    this.lastPost = null;
    Somr.util.log('Building rejected users map...');
    this.rejectUsers = buildRuleMap(options.rejectUsers);
    Somr.util.log('Building accepted tags map...');
    this.acceptTags = buildRuleMap(options.acceptTags, '#');
    Somr.util.log('Building rejected tags map...');
    this.rejectTags = buildRuleMap(options.rejectTags, '#');
    Somr.util.log('Building accepted users map...');
    this.acceptUsers = buildRuleMap(options.acceptUsers);

    filterPosts(this, postContainer.children('.post').not('#new_post'));

    // When the post container is modified, look for new posts and filter them.
    postContainer.bind('DOMSubtreeModified', function (ev) {
      Somr.util.log('Post container modified.');
      if (me.lastPost != null) {
        Somr.util.log('Filtering newly loaded posts...');
        filterPosts(me, me.lastPost.nextAll('.post'));
      }
    });
  }

  return PostFilter;
})();
