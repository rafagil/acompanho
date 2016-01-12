/* global process */
module.exports = function (repo, serverIp, serverPort) {
  var express = require('express');
  var load = require('express-load');
  var bodyParser = require('body-parser');
  var cookieParser = require('cookie-parser');
  var session = require('express-session');
  var passport = require('passport');
  var app = express();

  app.set('view engine', 'ejs');
  app.set('views', './views');
  app.use(express.static('./public'));
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  app.tratarErro = function (err, res) {
    console.error(err);
    res.status('500').end();
  };

  app.use(cookieParser());
  app.use(session({
    secret: 'segredo da sessao',
    resave: true,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  load('utils').into(app);
  if (repo === 'mongo') { //TODO: remove this and put every mongo related stuff inside the repo/mongo folder
    load('models').into(app);
  }
  load('repositories/' + repo).into(app);
  app.repositories = app.repositories[repo];
  load('controllers').then('routes').into(app);

  require('./passport')();
  require('../routes/main')(app);

  app.listen(serverPort, serverIp, function () {
    console.log('Process ' + process.pid + ' is listening to all incoming requests');
  });

};
