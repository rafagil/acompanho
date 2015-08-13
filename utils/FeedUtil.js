module.exports = function() {
  'use strict';

  var FeedParser = require('feedparser');
  var request = require('request');
  var FeedUtil = {};

  var parseFeed = function(feedUrl, event, onReadable, onError) {
    var feedParser = new FeedParser();

    var req = request(feedUrl, function(error) {
      if (error && onError) {
        onError(error);
      }
    });

    req.on('response', function(res) {
      var stream = this;

      if (res.statusCode !== 200) {
        return this.emit('error', new Error('Not OK'));
      }

      stream.pipe(feedParser);
    });

    feedParser.on('error', function(e) {
      if (onError) {
        onError(e);
      }
    });

    feedParser.on(event, onReadable);
    return feedParser;
  };

  var parseImage = function(entry) {
    if (!entry.image.url) {

      //try to find enclosures first:
      if (entry.enclosures && entry.enclosures.length) {
        entry.enclosures.forEach(function(enclosure) {
          if (enclosure.type.indexOf('image') >= 0) {
            entry.image.url = enclosure.url;
          }
        });
      }

      //if image is still not found, finds the first one in the post:
      if (!entry.image.url) {
        var firstImg = entry.description.match(/<img.+?src\s*=\s*(".+?"|'.+?')/);
        if (firstImg) {
          entry.image.url = firstImg[1].replace(/"|'/g, '');
        }
      }
    }
    return entry;
  };

  FeedUtil.parseFeedMeta = function(feedUrl, onSuccess, onError) {

    parseFeed(feedUrl, 'meta', function(meta) {
      onSuccess({
        url: feedUrl,
        title: meta.title,
        description: meta.description,
        link: meta.link,
        failedUpdate: false
      });
    }, onError);
  };

  FeedUtil.parseEntries = function(feedUrl, onSuccess, onError) {
    var items = [];
    var parser = parseFeed(feedUrl, 'readable', function() {
      var stream = this;
      var item;
      while (item = stream.read()) {
        items.push(parseImage(item));
      }
    }, onError);

    parser.on('end', function() {
      onSuccess(items);
    });
  };

  return FeedUtil;
};
