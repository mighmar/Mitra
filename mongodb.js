var mongodb = require( 'mongodb' );
var MongoClient = mongodb.MongoClient;
var util = require('util');
var config = require('./config').mongodb;
var _db;

//var uri = util.format('mongodb://%s:%s@%s:%d/%s',
var uri = util.format('mongodb://%s:%s@%s/%s',
    config.username, config.password, config.host,
     config.databaseName);
    //config.username, config.password, config.host,
    //config.port, config.databaseName);
var options = {};

function connectDB () {
   return MongoClient.connect(uri, options);
}

exports.connect = connectDB;
exports.OID = mongodb.ObjectID;
