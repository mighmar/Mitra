var mongodb = {};
var server = {};

server.port = process.env.WEB_PORT || 8080;

mongodb.username = process.env.MONGODB_USERNAME || "mitra";
mongodb.password= process.env.MONGODB_PASSWORD || "mitra";
mongodb.host= process.env.MONGODB_HOST || "localhost";
mongodb.port = process.env.MONGODB_PORT || 27017;
mongodb.databaseName = process.env.MONGODB_NAME || "gridDB";

exports.server = server;
exports.mongodb = mongodb;

