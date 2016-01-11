var mongoose = require('mongoose');

module.exports = function(uri) {
	mongoose.connect(uri);
	
	mongoose.connection.on('connected', function() {
		console.log('Database connected');
	});
	
	mongoose.connection.on('error', function(erro) {
		console.log('Database connetion error: ' + erro);
	});
	
	process.on('SIGINT', function() {
		mongoose.connection.close(function() {
			console.log('Database closed');
			process.exit(0);
		});
	});
	
};