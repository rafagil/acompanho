module.exports = function(app) {
  'use strict';
  var cont = {};
  var Category = app.models.Category;
  var Feed = app.models.Feed;

  cont.list = function(req, res) {
    Category.find({
      user: req.user._id
    }).sort({
      'name': 'asc'
    }).exec().then(function(categories) {
      if (req.query.feeds) {
        var promise = null;
        categories.forEach(function(cat) {
          if (promise) {
            promise.then(function() {
              return Feed.find({user:req.user._id, category: cat._id}).sort({'title':'asc'}).exec().then(function(feeds) {
                cat.feeds = feeds;
              });
            });
          } else {
            promise = Feed.find({user:req.user._id, category: cat._id}).sort({'title':'asc'}).exec().then(function(feeds) {
              cat.feeds = feeds;
            });
          }
        });
        promise.then(function() {
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
		Category.update({'_id' : req.params.id}, {
			name : cat.name,
			description : cat.description
		}).exec().then(function(cat) {
			res.json(cat);
		});
	};

	cont.delete = function(req, res) {
		var id = req.params.id;
		Category.remove({'_id' : id}).exec().then(function(){
			res.json({});
		});
	};

  return cont;
};
