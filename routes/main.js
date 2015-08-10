module.exports = function(app) {

	'use strict';

  var checkAuth = function(req, res, next) {
    //Uncomment this to enable OAuth2

    /*if (req.isAuthenticated()) {
    	req.user = req.session.user;
    	return next();
    } else {
    	res.status('401').json('Não autorizado');
    }*/

    //Fake login (uncomment this to disable authentication - Development purpouses only):
		req.user = {
      _id: '55689996182493d0243918fb',
      login: 'rafagil'
    };
    return next();
    //Fake login end
  };

  var controllers = app.controllers;

  //Main:
  app.get('/user', checkAuth, controllers.main.user);
  app.get('/login', controllers.main.login);
  app.get('/logout', controllers.main.logout);

  //Feeds:
  app.get('/feeds', checkAuth, controllers.feeds.list);
	app.post('/feeds', checkAuth, controllers.feeds.add);
	app.get('/feeds/:id', checkAuth, controllers.feeds.find);
	app.delete('/feeds/:id', checkAuth, controllers.feeds.delete);

	app.post('/feeds/update', checkAuth, controllers.feeds.update);
  app.get('/feeds/unread_count/:feedId', checkAuth, controllers.feeds.unreadCount);

  //Entries:
  app.get('/entries/find/:feedId', checkAuth, controllers.entries.find);
  app.get('/entries/find/:feedId/:page/:itemsPerPage', checkAuth, controllers.entries.find);
  app.get('/entries/update/:feedId', checkAuth, controllers.entries.update);
  app.get('/entries/read/:entryId', checkAuth, controllers.entries.read);

};
