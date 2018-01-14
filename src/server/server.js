var express = require("express"),
    app     = express(),
    db;

var routes  = require("./routes"),
    config  = require("./config").server;
    mongodb = require("./mongodb");


mongodb.connect(err => {
   db = mongodb.getDB();
   var sheets = db.collection('sheets');
   routes.route(app);
   app.listen(config.port, () => {
   })
});
