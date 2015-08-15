module.exports = function(app) {

  'use strict';

  var checkAuth = function(req, res, next) {
    //Uncomment this to enable OAuth2

    /*if (req.isAuthenticated()) {
    	req.user = req.session.user;
    	return next();
    }
    res.status('401').json('Não autorizado');
    */

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
  app.get('/login', controllers.main.login);
  app.get('/logout', controllers.main.logout);
  app.get('/api/user', checkAuth, controllers.main.user);

  //Categories:
  app.get('/api/categories', checkAuth, controllers.categories.list);
  app.get('/api/categories/:id', checkAuth, controllers.categories.find);
  app.post('/api/categories', checkAuth, controllers.categories.add);
  app.put('/api/categories/:id', checkAuth, controllers.categories.update);
  app.delete('/api/categories/:id', checkAuth, controllers.categories.delete);

  //Feeds:
  app.get('/api/feeds', checkAuth, controllers.feeds.list);
  app.get('/api/feeds/:id', checkAuth, controllers.feeds.find);
  app.post('/api/feeds', checkAuth, controllers.feeds.add);
  app.put('/api/feeds/:id', checkAuth, controllers.feeds.update);
  app.delete('/api/feeds/:id', checkAuth, controllers.feeds.delete);
  app.get('/api/feeds/:id/unread_count', checkAuth, controllers.feeds.unreadCount);

  //Entries:
  app.get('/api/feeds/:feedId/entries', checkAuth, controllers.entries.find);
  app.get('/api/feeds/:feedId/entries/update', checkAuth, controllers.entries.update);
  app.get('/api/entries/:entryId', checkAuth, controllers.entries.read);

  //All (Html 5 mode on angular)
  app.get('/*', function(req, res) {
		res.sendFile('index.html', {root: __dirname + '/../public/'});
  });

};
