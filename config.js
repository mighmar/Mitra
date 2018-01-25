var mongodb = {};
var server = {};

server.port = process.env.PORT || 3001;

mongodb.username = process.env.MONGODB_USERNAME || "mitra";
mongodb.password= process.env.MONGODB_PASSWORD || "mitra";
mongodb.host= process.env.MONGODB_HOST || "ds035059.mlab.com";
mongodb.port = process.env.MONGODB_PORT || 35059;
mongodb.databaseName = process.env.MONGODB_NAME || "mitra";

exports.server = server;
exports.mongodb = mongodb;

