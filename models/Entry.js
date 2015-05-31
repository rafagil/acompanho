var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
module.exports = function() {
	var schema = mongoose.Schema({
		title       : {type : String},
		description : {type : String},
		link        : {type : String},
		unread      : {type : Boolean},
		starred     : {type : Boolean}, 
		pubDate     : {type : Date},
		image       : {type : String},
		feed        : {type: ObjectId, ref: 'Feed'}
	});

	return mongoose.model('Entry', schema);
};