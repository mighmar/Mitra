var express = require("express"),
    app     = express(),
    db;

var routes  = require("./routes"),
    config  = require("./config").server;
    mongodb = require("./mongodb");

routes.route(app);

mongodb.connect(err => {
   app.listen(config.port, () => {
      db = mongodb.getDB();
   })
});
