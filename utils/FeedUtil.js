var FeedParser = require('feedparser');
var request = require('request');

module.exports = function() {
	var FeedUtil = {};

	var parseFeed = function(feedUrl, event, onReadable, onError) {
		var feedParser = new FeedParser();

		var req = request(feedUrl, function(error) {
			if (error && onError)  onError(error);
		});

		req.on('response', function(res) {
			var stream = this;

			if (res.statusCode != 200) {
				return this.emit('error', new Error('Not OK'));
			}

			stream.pipe(feedParser);
		});

		feedParser.on('error', function(e) {
			if (onError) onError(e);
		});

		feedParser.on(event, onReadable);
		return feedParser;
	};

	FeedUtil.parseFeedMeta = function(feedUrl, onSuccess, onError) {

		parseFeed(feedUrl, 'meta', function(meta) {
			onSuccess({
				url: feedUrl,
				title: meta.title,
				description: meta.description,
				link:  meta.link,
				failedUpdate: false
			});
		}, onError);
	};

	FeedUtil.parseEntries = function(feedUrl, onSuccess, onError) {
		var items = [];
		var parser = parseFeed(feedUrl, 'readable', function(data) {
			var stream = this;
			while(item = stream.read()) {
				items.push(item);
			}
		}, onError);

		parser.on('end', function() {
			onSuccess(items);
		});
	};

	return FeedUtil;
};
