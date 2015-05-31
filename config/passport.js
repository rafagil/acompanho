var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var mongoose = require('mongoose');

module.exports = function() {
	
	var User = mongoose.model('User');
	
	passport.use(new GoogleStrategy({
		clientID: '988789846766-qi9pno6o3gheg2mfhbued1koh4q0ptn2.apps.googleusercontent.com',
		clientSecret: 'qxvE5B84e4AUYDvX4rJHeFDC',
		callbackURL: 'http://localhost:3000/auth/google/callback',
		scope: 'https://www.googleapis.com/auth/plus.login'
	}, function(accessToken, refreshToken, profile, done) {
		User.findOne({login: profile.username}).exec().then(function(user) {
			//If it is null, creates it
			if (user == null) {
				User.create({login: profile.username, name: profile.displayName}).then(function(user) {
					return done(null, user);
				});
			} else {
				return done(null, user);
			}
		});
	}));

	passport.use(new GitHubStrategy({
		clientID: 'cd5063d87bca55b0552d',
		clientSecret: '3722d52d5809fa33d0c192423bb4acb1eeefd6e7',
		callbackURL: 'http://localhost:3000/auth/github/callback'
	}, function(accessToken, refreshToken, profile, done) {
		User.findOne({login: profile.username}).exec().then(function(user) {
			//If it is null, creates it
			if (user == null) {
				User.create({login: profile.username, name: profile.displayName}).then(function(user) {
					return done(null, user);
				});
			} else {
				return done(null, user);
			}
		});
	}));
	
	
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});
	
	passport.deserializeUser(function(id, done) {
		User.find({'_id': id}).exec().then(function(user) {
			done(null, user);
		});
	});
};