/* global process */
module.exports = function () {
  'use strict';
  var commander = require('commander');
  var express = require('express');
  var load = require('express-load');
  var bodyParser = require('body-parser');
  var cookieParser = require('cookie-parser');
  var session = require('express-session');
  var passport = require('passport');
  var app = express();

  commander.version('2.0.1')
    .option('-d, --database [value]', 'Database type [mongo, sqlite] (default mongo)', 'mongo')
    .parse(process.argv);

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

  var dbURL = 'mongodb://192.168.56.102/acompanho';
  if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    dbURL = process.env.OPENSHIFT_MONGODB_DB_URL + 'acompanho';
  }
  var repo = commander.database;
  console.log('Using ' + repo + ' as database');
  require('./config/' + repo + '_database')(dbURL);
  
  load('utils').into(app);
  if (repo === 'mongo') { //TODO: remove this and put every mongo related stuff inside the repo/mongo folder
    load('models').into(app);
  }
  load('repositories/' + repo).into(app);
  app.repositories = app.repositories[repo];
  load('controllers').then('routes').into(app);

  require('./config/passport')();
  require('./routes/main')(app);

  var serverIp = process.env.OPENSHIFT_NODEJS_IP || 'localhost';
  var serverPort = process.env.OPENSHIFT_NODEJS_PORT || 3000;

  app.listen(serverPort, serverIp, function () {
    console.log('Process ' + process.pid + ' is listening to all incoming requests');
  });
};
