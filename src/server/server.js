var express = require("express"),
    app     = express(),
    bodyParser = require("body-parser");

var routes  = require("./routes"),
    config  = require("./config").server;
    mongodb = require("./mongodb");

app.use(bodyParser.urlencoded({ extended: false }));

mongodb.connectSheet((err) => {
   if (err) { 
	throw new Error(err);
   }
   mongodb.connectLog((err) => {
      if (err) { 
           throw new Error(err);
      }
      routes.route(app);
      app.listen(config.port, () => {
      })
   });
});
