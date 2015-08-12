var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
module.exports = function() {
  'use strict';
	var schema = mongoose.Schema({
		name       : {type : String},
		description : {type : String},
    feeds: {type: Array},
		user: {type: ObjectId, ref: 'User'}
	});

	return mongoose.model('Category', schema);
};
