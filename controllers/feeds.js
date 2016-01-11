module.exports = function(app) {
	'use strict';
	var cont = {};
	var FeedRepository = app.repositories.feed;
	var EntryRepository = app.repositories.entry;
	var FeedUtil = app.utils.FeedUtil;

	var handleError = function(res, e) {
		if (!res.headersSent) {
			res.status('500').json({error: e});
		} else {
			console.log('Something is calling this twice!');
		}
	};

	cont.list = function(req, res) {
		FeedRepository.list(req.user._id).then(function (feeds) {
			res.json(feeds);
		});
	};

	cont.find = function(req, res) {
		FeedRepository.find(req.user._id, req.params.id).then(function(feed) {
			res.json(feed);
		});
	};

	cont.add = function(req, res) {
		var feedParam = req.body;
		FeedUtil.parseFeedMeta(feedParam.url, function(newFeed) {
			newFeed.user = req.user._id;
			newFeed.category = feedParam.category;
			FeedRepository.save(newFeed).then(function() {
				res.json({});
			});
		}, function(err) {
			handleError(res, err);
		});
	};

	cont.update = function(req, res) {
		var feed = req.body;
		FeedRepository.save(feed).then(function(feed) {
			res.json(feed);
		});
	};

	cont.delete = function(req, res) {
		var feedId = req.params.id;
    EntryRepository.removeByFeed(feedId).then(function() {
			FeedRepository.remove(feedId).then(function(){
				res.json({});
			});
		});
	};

	cont.unreadCount = function(req, res) {
    EntryRepository.unreadCount(req.params.id).then(function(count) {
      res.json(count);
    });
	};

	return cont;
};
