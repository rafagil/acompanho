var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
module.exports = function() {
	var schema = mongoose.Schema({
		title : {type : String},
		descripion : {type : String},
		link : {type : String},
		url : {type : String},
		failedUpdate: {type : Boolean },
		user: {type: ObjectId, ref: 'User'}
	});

	return mongoose.model('Feed', schema);
};