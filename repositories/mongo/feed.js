module.exports = function (app) {
  'use strict';

  var Feed = app.models.Feed;
  var repo = {};

  repo.list = function (userId) {
    return Feed.find({ user: userId }).sort({ 'title': 'asc' }).exec();
  }

  repo.find = function (userId, feedId) {
    return Feed.where({ user: userId, _id: feedId }).findOne().exec();
  };

  repo.save = function (feed) {
    var promise;
    if (feed._id) {
      promise = Feed.update({ '_id': feed._id }, {
        title: feed.title,
        description: feed.description,
        link: feed.link,
        url: feed.url,
        category: feed.category
      }).exec();
    } else {
      promise = Feed.create(feed);
    }
    return promise;
  };

  repo.remove = function (feedId) {
    return Feed.remove({ '_id': feedId }).exec();
  };

  return repo;
};