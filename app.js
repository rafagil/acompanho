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
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.tratarErro = function(err, res) {
	console.error(err);
	res.status('500').end();
};

app.use(cookieParser());
app.use(session({secret: 'segredo da sessao', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());


require('./config/database')('mongodb://192.168.56.102/acompanho');
load('utils')
	.then('models')
	.then('controllers')
	.then('routes')
	.into(app);

require('./config/passport')();

var routes = require('./routes/main')(app);

app.listen(3000, function() {
	console.log('Running on port 3000');
});