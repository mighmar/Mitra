var mongodb = require( 'mongodb' );
var MongoClient = mongodb.MongoClient;
var util = require('util');
var config = require('./config').mongodb;
var _sDB, _lDB;

var sheetUri = util.format('mongodb://%s:%s@%s:%d/%s',
    config.username, config.password, config.host, config.port, config.sheetDatabase);
var logUri = util.format('mongodb://%s:%d/%s',
    config.host, config.port, config.logDatabase);

function connectSheet (callback) {
   MongoClient.connect(sheetUri, {}, (err, db) => {
      if (!err) 
         _sDB = db;
      return callback(err);
   });
}

function connectLog (callback) {
   MongoClient.connect(logUri, {}, (err, db) => {
      if (!err) 
         _lDB = db;
      return callback(err);
   });
}

function getSheetDB () {
   return _sDB;
}

function getLogDB () {
   return _lDB;
}

function createLog(id, fun) {
   _lDB.createCollection(id, { 
       "capped": true,
       "size": 1000,
       "max": 500 
   },
   (err, data) => {
      data.ensureIndex({time: 1});
      fun(err, data);
   });  
}

function stampToId(timestamp) {
   var msInSecond = 1000;
   var lowerBytes = "0000000000000000";

   var hexSeconds = Math.floor(timestamp/msInSecond).toString(16);
   return mongodb.ObjectID(hexSeconds + lowerBytes);
}

exports.connectSheet = connectSheet;
exports.connectLog = connectLog;
exports.getSheetDB = getSheetDB;
exports.getLogDB = getLogDB;
exports.createLog = createLog;
exports.OID = mongodb.ObjectID;
