var mongoose = require('mongoose');
module.exports = function() {
	var schema = mongoose.Schema({
		name: {type: String},
		login: {
			type: String,
			required: true,
			index: {
				unique: true
			}
		},
		includedAt: {
			type: Date,
			default: Date.now
		}
	});
	
	return mongoose.model('User', schema);
};