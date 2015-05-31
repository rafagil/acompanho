module.exports = function(app) {
	
	cont = {};
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
		var feedId = req.params['feedId'];
		var page = req.params['page'];
		var itemsPerPage = req.params['itemsPerPage'];
		
		if (!page || !itemsPerPage) {
			Entry.find({'feed': feedId})
				.select("_id title link	unread starred pubDate image feed")
				.sort({'pubDate':'desc'}).exec().then(function(entries) {
				
				res.json({
					'entries': entries,
					'total': entries.length
				});
			});
		} else {
			Entry.find({'feed': feedId})
				.select("_id title link	unread starred pubDate image feed")
				.skip((page -1) * itemsPerPage)
				.limit(itemsPerPage)
				.sort({'pubDate':'desc'}).exec().then(function(entries) {
				
				//Count all Entries
				Entry.count({feed: feedId}, function(err, count) {
					
					res.json({
						'entries': entries,
						'total': count
					});
				});				
			});
		}
	};
	
	cont.read = function(req, res) {
		var entryId = req.params['entryId'];
		
		Entry.findOne({'_id': entryId})
			.select("description")
			.exec().then(function(entry) {
			
			//Mark as Read, no need to be "synchronous":
			Entry.update({'_id' : entry._id}, {'unread': false}).exec();
			
			res.json(entry);
		}); 
	};
	
	cont.update = function(req, res) {
		var feedId = req.params['feedId'];
		
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
					for (key in linkMap) {
						var entry = linkMap[key];
						newEntries.push({
							title: entry.title,
							description: entry.description,
							link: entry.link,
							unread: true,
							starred: false,
							pubDate: entry.pubdate,
							image: entry.image.url,
							feed: f._id
						});
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
	}

	return cont;
};