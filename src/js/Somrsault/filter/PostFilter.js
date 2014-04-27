'use strict';
Somrsault.util.define('Somrsault.filter.PostFilter', (function () {
  var blogNameRe = new RegExp('^([0-9a-z_-]+)$');

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

  function filterPosts(me, page, posts) {
    var count = posts.length;
    for (var i = 0; i < count; i++) {
      var post = $(posts[i]);
      me.lastPost = post;

      var rejectReasons = me.filterPost(post);
      if (rejectReasons) {
        me.rejectPost(page, post, rejectReasons);
      }
    }
    Somrsault.util.info(me.name + '> Finished filtering posts.  Last: ' + me.lastPost.attr('id'));
  }

  function filterNewPosts(page) {
    Somrsault.util.info(this.name + '> Post container modified.');
    if (this.lastPost != null) {
      Somrsault.util.info(this.name + '> Filtering newly loaded posts after ' + this.lastPost.attr('id'));
      var newPosts = this.lastPost
        .closest('.post_container')
        .nextAll('.post_container')
        .not('.somr-filtered')
        .children('.post');
      filterPosts(this, page, newPosts);
    }
  }

  function rejectPost(page, post, reasons) {
    Somrsault.util.info(this.name + '> Hiding post ' + post.attr('id') + ': ' + JSON.stringify(reasons));
    post.closest('.post_container').addClass('somr-filtered');
    page.onFilter.fire(page, post, reasons);
  }

  function PostFilter() {
    this.lastPost = null;
  }

  PostFilter.prototype = {
    execute: function execute(page) {
      var posts = page.postContainer
        .children('.post_container')
          .not('#new_post_buttons')
          .not('.somr-filtered')
          .children('.post');

      filterPosts(this, page, posts, 0);

      // When the post container is modified, filter new posts.
      var filterNewCallback = filterNewPosts.bind(this, page);
      page.postContainer.on('DOMSubtreeModified', function (ev) {
        setTimeout(filterNewCallback, 1);
      });
    },

    getPostTags: getPostTags,
    getPostUsers: getPostUsers,
    rejectPost: rejectPost
  };

  return PostFilter;
})());
