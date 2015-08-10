module.exports = function(app) {
	cont = {};

	cont.user = function(req, res) {
		res.json(req.user);
	};

	cont.login = function(req, res) {
		res.render('login');
	};

	cont.logout = function(req, res) {
		req.logout();
		res.redirect('/login');
	};

	return cont;
};
