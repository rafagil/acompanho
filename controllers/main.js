module.exports = function(app) {
	cont = {};
	
	cont.index = function(req, res) {
		res.render('index', {user: req.user});
	};
	
	cont.login = function(req, res) {
		res.render('login');
	};
	
	return cont;
};