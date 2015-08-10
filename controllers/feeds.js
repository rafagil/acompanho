module.exports = function(app) {
	'use strict';
	var cont = {};
	var Feed = app.models.Feed;
	var Entry = app.models.Entry;
	var FeedUtil = app.utils.FeedUtil;

	var handleError = function(res, e) {
		if (!res.headersSent) {
			res.json({error: e});
		} else {
			console.log('Something is calling this twice!');
		}
	};

	cont.list = function(req, res) {
		Feed.find({user:req.user._id}).sort({'title':'asc'}).exec().then(function(feeds) {
			res.json(feeds);
		});
	};

	cont.find = function(req, res) {
		Feed.where({user:req.user._id, _id: req.params.id}).findOne().exec().then(function(feed) {
			res.json(feed);
		});
	};

	cont.add = function(req, res) {
		var newFeed = req.body;
		FeedUtil.parseFeedMeta(newFeed.url, function(newFeed) {
			newFeed.user = req.user._id;
			Feed.create(newFeed).then(function() {
				res.json({});
			});
		}, function(err) {
			handleError(res, err);
		});
	};

	cont.update = function(req, res) {
		var feed = req.body;
		Feed.update({'_id' : feed._id}, {
			title : feed.title,
			descripion : feed.descripion,
			link : feed.link,
			url : feed.url,
		}).exec().then(function(feed) {
			res.json(feed);
		});
	};

	cont.delete = function(req, res) {
		var feedId = req.params.id;
		Entry.remove({'feed': feedId}).exec().then(function() {
			Feed.remove({'_id' : feedId}).exec().then(function(){
				res.json({});
			});
		});
	};

	cont.unreadCount = function(req, res) {
		var feedId = req.params.feedId;
		Entry.count({feed: feedId, unread: true}, function(err, count) {
			res.json(count);
		});
	};

	return cont;
};
