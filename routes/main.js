module.exports = function(app) {

	var checkAuth = function(req, res, next) {
		//Uncomment this to enable OAuth2
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.status('401').json('Não autorizado');
		}
		//fake login:
		/*req.user = {
			_id: '55689996182493d0243918fb',
			login: 'rafagil'
		}*/
		return next();
	};
	
	var controllers = app.controllers;

	//Feeds:
	app.get('/feeds',checkAuth, controllers.feeds.list);
	app.post('/feeds/add', checkAuth, controllers.feeds.add);
	app.get('/feeds/unread_count/:feedId', checkAuth, controllers.feeds.unreadCount);
	
	//Entries:
	app.get('/entries/find/:feedId', checkAuth, controllers.entries.find);
	app.get('/entries/find/:feedId/:page/:itemsPerPage', checkAuth, controllers.entries.find);
	app.get('/entries/update/:feedId', checkAuth, controllers.entries.update);
	app.get('/entries/read/:entryId', checkAuth, controllers.entries.read);

};