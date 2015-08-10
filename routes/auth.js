var passport = require('passport');
module.exports = function(app) {

	app.get('/auth/google', passport.authenticate('google'));
	app.get('/auth/google/callback', passport.authenticate('google', {successRedirect: '/'}));

	app.get('/auth/github', passport.authenticate('github'));
	app.get('/auth/github/callback', passport.authenticate('github', {failureRedirect: '/login'}), function(req, res) {
		req.session.user = req.user;
		res.redirect('/');
	});

};
