module.exports = function(app) {

	var checkAuth = function(req, res, next) {
		//Uncomment this to enable OAuth2
		
		if (req.isAuthenticated()) {
			return next();
		} else if (req.url === '/') { // The main page does not expects a json response.
			res.redirect('/login');
		} else {
			res.status('401').json('Não autorizado');
		}
		
		
		//fake login (comment this to enable authentication - Development purpouses only):
		/*req.user = {
			_id: '55689996182493d0243918fb',
			login: 'rafagil'
		}
		return next();*/
	};
	
	var controllers = app.controllers;

	//Main:
	app.get('/', checkAuth, controllers.main.index);
	app.get('/login', controllers.main.login);
	
	//Feeds:
	app.post('/feeds/add', checkAuth, controllers.feeds.add);
	app.post('/feeds/update', checkAuth, controllers.feeds.update);
	app.post('/feeds/delete', checkAuth, controllers.feeds.delete);
	app.get('/feeds',checkAuth, controllers.feeds.list);
	app.get('/feeds/unread_count/:feedId', checkAuth, controllers.feeds.unreadCount);

	//Entries:
	app.get('/entries/find/:feedId', checkAuth, controllers.entries.find);
	app.get('/entries/find/:feedId/:page/:itemsPerPage', checkAuth, controllers.entries.find);
	app.get('/entries/update/:feedId', checkAuth, controllers.entries.update);
	app.get('/entries/read/:entryId', checkAuth, controllers.entries.read);

};