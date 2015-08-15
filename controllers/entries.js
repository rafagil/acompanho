module.exports = function(app) {
	'use strict';
	var cont = {};
	var Feed = app.models.Feed;
	var Entry = app.models.Entry;

	var FeedUtil = app.utils.FeedUtil;

	var handleError = function(res, e, feed) {
		if (!res.headersSent) {
			res.json({error: e});
		} else {
			console.log('Something is calling this twice!');
		}
		if (feed) {
			feed.failedUpdate = true;
			feed.save();
		}
	};

	var success = function(res, feed) {
		feed.failedUpdate = false;
		feed.save();
		res.json({});
	};

	cont.find = function(req, res) {
		var feedId = req.params.feedId;
		var page = req.query.page;
		var pageSize = req.query.pageSize;

		var promise = Entry.find({'feed': feedId})
			.select("_id title link	unread starred pubDate image summary feed")
			.sort({'pubDate':'desc'});

		if (!page || !pageSize) {
			promise.exec().then(function(entries) {
				res.json({
					'entries': entries,
					'total': entries.length
				});
			});
		} else {
			promise
				.skip((page -1) * pageSize)
				.limit(pageSize)
				.exec().then(function(entries) {

				//Count all Entries
				Entry.count({feed: feedId}).exec().then(function(count) {
					res.json({
						'entries': entries,
						'total': count
					});
				});
			});
		}
	};

	cont.read = function(req, res) {
		var entryId = req.params.entryId;

		Entry.findOne({'_id': entryId})
			.select("description")
			.exec().then(function(entry) {

			//Mark as Read, no need to be "synchronous":
			Entry.update({'_id' : entry._id}, {'unread': false}).exec();

			res.json(entry);
		});
	};

	cont.update = function(req, res) {
		var feedId = req.params.feedId;

		Feed.findById(feedId).exec().then(function(f) {

			FeedUtil.parseEntries(f.url, function(entries) {

				var linkFilter = [];
				var linkMap = {};
				entries.forEach(function(entry){
					linkFilter.push(entry.link);
					linkMap[entry.link] = entry;
				});

				var filter = {'feed': f._id, 'link': {$in : linkFilter}};

				Entry.find(filter).exec().then(function(existing) {
					//removes from the map all the existing entries:
					existing.forEach(function(ex) {
						delete linkMap[ex.link];
					});

					var newEntries = [];
					var key, entry;
					for (key in linkMap) {
						if (linkMap.hasOwnProperty(key)) {
							entry = linkMap[key];
							newEntries.push({
								title: entry.title,
								description: entry.description,
								link: entry.link,
								unread: true,
								starred: false,
								pubDate: entry.pubdate,
								image: entry.image.url,
								summary: entry.summary,
								feed: f._id
							});
						}
					}

					if (newEntries.length > 0) {
						Entry.collection.insert(newEntries, function(err) {
							if (err) {
								handleError(res, err, f);
							} else {
								success(res, f);
							}
						});
					} else {
						success(res, f);
					}

				}, function(err) {
					handleError(res, err, f);
				});

			}, function(err){
				handleError(res, err, f);
			});
		});
	};

	return cont;
};
