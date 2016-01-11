/* global process */
module.exports = function () {
  'use strict';
  var commander = require('commander');

  commander.version('2.0.1')
    .option('-d, --database [value]', 'Database type [mongo, sqlite] (default mongo)', 'mongo')
    .parse(process.argv);

  var dbURL = 'mongodb://192.168.56.102/acompanho';
  if (process.env.OPENSHIFT_MONGODB_DB_URL) {
    dbURL = process.env.OPENSHIFT_MONGODB_DB_URL + 'acompanho';
  }
  var serverIp = process.env.OPENSHIFT_NODEJS_IP || 'localhost';
  var serverPort = process.env.OPENSHIFT_NODEJS_PORT || 3000;
  
  var repo = commander.database;
  console.log('Using ' + repo + ' as database');
  require('./config/' + repo + '_database')(dbURL);
  require('./config/express.js')(repo, serverIp, serverPort);
};
