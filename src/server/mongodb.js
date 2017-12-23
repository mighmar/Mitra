var MongoClient = require( 'mongodb' ).MongoClient;
var util = require('util');
var config = require('./config').mongodb;
var _db;

var uri = util.format('mongodb://%s:%s@%s:%d/%s',
    config.username, config.password, config.host, config.port, config.databaseName);

function connect (callback) {
   MongoClient.connect(uri, {auto_reconnect: true}, (err, db) => {
      if (err) throw err;
      else 
         _db = db;
      return callback(err);
   });
}

function getDB () {
   return _db;
}

exports.connect = connect;
exports.getDB = getDB;
