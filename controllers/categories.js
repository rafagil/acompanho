module.exports = function(app) {
  'use strict';
  var cont = {};
  var Category = app.models.Category;
  var Feed = app.models.Feed;
  var q = require('q');

  cont.list = function(req, res) {
    Category.find({
      user: req.user._id
    }).sort({
      'name': 'asc'
    }).exec().then(function(categories) {
      if (req.query.feeds) {
        var promises = [];
        categories.forEach(function(cat) {
          promises.push(Feed.find({
            user: req.user._id,
            category: cat._id
          }).sort({
            'title': 'asc'
          }).exec().then(function(feeds) {
            cat.feeds = feeds;
          }));
        });

        //Creates a uncategorized category here because "push" works on categories array, but splice doesn't
        var uncategorized = {
          name: "Sem categoria",
          _id: null
        };
        promises.push(Feed.find({
          user: req.user._id,
          category: null
        }).sort({
          'title': 'asc'
        }).exec().then(function(feeds) {
          if (feeds.length) {
            uncategorized.feeds = feeds;
            categories.push(uncategorized);
          }
        }));

        q.all(promises).then(function() {
          res.json(categories);
        });
      } else {
        res.json(categories);
      }
    });
  };

  cont.find = function(req, res) {
    Category.where({
      user: req.user._id,
      _id: req.params.id
    }).findOne().exec().then(function(cat) {
      res.json(cat);
    });
  };

  cont.add = function(req, res) {
    console.log(req.body);
    var newCat = req.body;
    newCat.user = req.user._id;
    if (newCat.name) {
      Category.create(newCat).then(function(cat) {
        res.json(cat);
      });
    } else {
      res.json({});
    }
  };

  cont.update = function(req, res) {
    var cat = req.body;
    Category.update({
      '_id': req.params.id
    }, {
      name: cat.name,
      description: cat.description
    }).exec().then(function(cat) {
      res.json(cat);
    });
  };

  cont.delete = function(req, res) {
    var id = req.params.id;
    Category.remove({
      '_id': id
    }).exec().then(function() {
      res.json({});
    });
  };

  return cont;
};
