module.exports = function (app) {
  'use strict';
  var Entry = app.models.Entry;
  var repo = {};

  repo.removeByFeed = function (feedId) {
    return Entry.remove({ 'feed': feedId }).exec();
  };
  
  repo.unreadCount = function(feedId) {
    return Entry.count({feed: feedId, unread: true}).exec();
  };

  return repo;
};