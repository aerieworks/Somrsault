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

    function filterPost(me, post) {
        var user = post.children('.post_info').children('a:first').text();
        if (me.rejectUsers[user]) {
            rejectPost(post);
            return;
        }
        
        var tags = post.find('.tag');
        var tagCount = tags.length;
        for (var i = 0; i < tagCount; i++) {
            var tag = tags[i].textContent.toLowerCase();
            if (me.rejectTags[tag]) {
                rejectPost(post);
                return;
            }
        }
    }
    
    function filterPosts(me, posts) {
        var count = posts.length;
        for (var i = 0; i < count; i++) {
            me.lastPost = $(posts[i]);
            filterPost(me, me.lastPost);
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
        this.rejectTags = buildRuleMap(options.rejectTags, '#');

        filterPosts(this, postContainer.children('.post').not('#new_post'));

        // When the post container is modified, look for new posts and filter them.
        postContainer.bind('DOMSubtreeModified', function (ev) {
            if (me.lastPost != null) {
                filterPosts(me, me.lastPost.nextAll('.post'));
            }
        });
    };
})();
