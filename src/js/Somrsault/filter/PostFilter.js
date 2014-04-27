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

  function filterNewPosts() {
    Somrsault.util.debug('Post container modified.');
    if (this.lastPost != null) {
      Somrsault.util.debug('Filtering newly loaded posts after ' + this.lastPost.attr('id'));
      var newPosts = this.lastPost
        .closest('.post_container')
        .nextAll('.post_container')
        .children('.post');
      this.doFilter(newPosts);
    }
  }

  function rejectPost(post, reasons) {
    Somrsault.util.log('Hiding post ' + post.attr('id'));
    post.closest('.post_container').addClass('somr-filtered');
    this.page.onFilter.fire(this.page, post, reasons);
  }

  function PostFilter(page, options) {
    var me = this;
    this.page = page;
    this.lastPost = null;
  }

  PostFilter.prototype = {
    execute: function execute() {
      var posts = this.page.postContainer
        .children('.post_container')
          .not('#new_post_buttons')
          .children('.post');

      this.doFilter(posts);

      // When the post container is modified, filter new posts.
      var filterNewCallback = filterNewPosts.bind(this);
      this.page.postContainer.on('DOMSubtreeModified', function (ev) {
        setTimeout(filterNewCallback, 1);
      });
    },

    getPostTags: getPostTags,
    getPostUsers: getPostUsers,
    rejectPost: rejectPost
  };

  return PostFilter;
})());
