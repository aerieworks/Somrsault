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
            map[key] = true;
        }

        return map;
    }

    function getPostUser(post) {
        return post.children('.post_info').children('a:first').text();
    }

    function getPostTags(post) {
        var tags = post.find('.tag');
        var tagList = [];
        for (var i = 0; i < tags.length; i++) {
            tagList.push(tags[i].textContent.toLowerCase());
        }

        return tagList;
    }

    function isPostBy(postUser, userMap) {
        return !!(userMap[postUser]);
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
        var postUser;
        var postTags;
        var post;
        for (var i = 0; i < count; i++) {
            post = $(posts[i]);
            postUser = getPostUser(post);
            if (postUser == '') {
                postUser = lastUser;
            } else {
                lastUser = postUser;
            }

            postTags = getPostTags(post);

            if ((isPostBy(postUser, me.rejectUsers) && !isPostTagged(postTags, me.acceptTags)) ||
                (isPostTagged(postTags, me.rejectTags) && !isPostBy(postUser, me.acceptUsers))) {
                rejectPost(post);
            }

            me.lastPost = post;
        }
    }

    function rejectPost(post) {
        post.hide();
        Somr.util.log('Hiding post ' + post.attr('id'));
    }

    return function (options, postContainer) {
        var me = this;
        this.lastPost = null;
        this.rejectUsers = buildRuleMap(options.rejectUsers);
        this.acceptTags = buildRuleMap(options.acceptTags, '#');
        this.rejectTags = buildRuleMap(options.rejectTags, '#');
        this.acceptUsers = buildRuleMap(options.acceptUsers);

        filterPosts(this, postContainer.children('.post').not('#new_post'));

        // When the post container is modified, look for new posts and filter them.
        postContainer.bind('DOMSubtreeModified', function (ev) {
            if (me.lastPost != null) {
                filterPosts(me, me.lastPost.nextAll('.post'));
            }
        });
    };
})();
