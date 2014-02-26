'use strict';
window.Somr.PostFilter = (function () {
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
      Somr.util.log('buildRuleMap: key: "' + key + '"');
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
      Somr.util.log('Examining post by "' + postUsers.join(', ') + '"...');

      postTags = getPostTags(post);

      var filteredUsers = findMatches(postUsers, me.rejectUsers);
      var filteredTags = findMatches(postTags, me.rejectTags);
      if ((filteredUsers.length > 0 && !isPostTagged(postTags, me.acceptTags)) || (filteredTags.length > 0 && !isPostBy(postUsers, me.acceptUsers))) {
        var reasonParts = [];
        if (filteredUsers.length > 0) {
          reasonParts.push('from ' + filteredUsers.join(', '));
        }
        if (filteredTags.length > 0) {
          reasonParts.push('tagged ' + filteredTags.join(', '));
        }
        rejectPost(post, reasonParts.join(' and '));
      }

    }
  }

  function rejectPost(post, reason) {
    Somr.util.log('Hiding post ' + post.attr('id'));

    var filterNotice = $('<div class="somr-filter-notice post_full clearfix"></div>')
      .append($('<div class="post_header">somrsault</div>'))
      .append($('<div class="post_content clearfix"></div>')
        .append($('<div class="post_body clearfix"></div>')
          .append($('<p></p>')
            .text('Hiding a post ' + reason + '.')
            .append('<span class="somr-show-post">Show</span>')
          )
        )
      );

    post.closest('.post_container')
      .addClass('somr-filtered')
      .append(filterNotice);
  }

  function showFilteredPost(postContainer) {
    postContainer.addClass('somr-unfiltered');
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

    filterPosts(this, postContainer.children('.post_container').not('#new_post_buttons').children('.post'));

    // When the user chooses to show a filtered post...
    postContainer.on('click', '.somr-show-post', function (ev) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      ev.stopPropagation();
      showFilteredPost($(ev.target).closest('.post_container'));
    });

    // When the post container is modified, look for new posts and filter them.
    postContainer.bind('DOMSubtreeModified', function (ev) {
      Somr.util.log('Post container modified.');
      if (me.lastPost != null) {
        Somr.util.log('Filtering newly loaded posts...');
        filterPosts(me, me.lastPost.closest('.post_container').nextAll('.post_container').children('.post'));
      }
    });
  }

  return PostFilter;
})();
