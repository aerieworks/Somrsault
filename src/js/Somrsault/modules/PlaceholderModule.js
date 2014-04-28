'use strict';
(function ($, FT) {

  function showFilteredPost(postContainer) {
    postContainer.addClass('somr-show-post');
  }

  function showFilteredPostReason(postContainer) {
    postContainer.addClass('somr-show-reason');
  }

  function onFilter(page, post, reasons) {
    var reasonParts = reasons.map(function (reason) {
      return ' ' + reason.type.verb + ' ' + reason.matches.join(', ');
    });
    var reasonMessage = reasonParts.join(' and ');

    var placeholderBody = $('<div class="post_body clearfix"></div>')
      .append($('<p></p>')
        .text('Hiding a post')
        .append($('<span class="somr-placeholder-reason"></span>').text(reasonMessage))
        .append(document.createTextNode('.'))
      );

    var placeholder = $('<div class="somr-placeholder post_full clearfix"></div>')
      .append($('<div class="post_header">somrsault</div>'))
      .append($('<div class="post_content clearfix"></div>').append(placeholderBody));

    if (this.options.showReason) {
      page.postContainer.addClass('somr-show-reason');
    } else {
      placeholderBody.append($('<span class="somr-action somr-action-show-reason">Show Reason</span>'));
    }

    placeholderBody.append('<span class="somr-action somr-action-show-post">Show Post</span>');
    post.closest('.post_container').append(placeholder);
  }

  function onPageLoad(page, options) {
    this.options = options;

    if (options.showPlaceholder) {
      page.onFilter.add(onFilter.bind(this));

      // When the user chooses to show a filtered post...
      page.postContainer.on('click', '.somr-action-show-post', function (ev) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        ev.stopPropagation();
        showFilteredPost($(ev.target).closest('.post_container'));
      });

      if (!this.options.showReason) {
        page.postContainer.on('click', '.somr-action-show-reason', function (ev) {
          ev.preventDefault();
          ev.stopImmediatePropagation();
          ev.stopPropagation();
          showFilteredPostReason($(ev.target).closest('.post_container'));
        });
      }
    }
  }

  Somrsault.modules.Module.register({
    name: 'Placeholder',
    onPageLoad: onPageLoad,
    options: [
      {
        id: 'showPlaceholder',
        type: Boolean,
        defaultValue: true,
        label: 'Replace blocked posts with a placeholder indicating a post was blocked.'
      },
      {
        id: 'showReason',
        type: Boolean,
        defaultValue: true,
        requires: 'showPlaceholder',
        label: 'Show the reason the post was filtered.'
      }
    ]
  });
})(jQuery, Somrsault.filter.FilterRule);
