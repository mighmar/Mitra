var express = require("express"),
    app     = express(),
    db;

var routes  = require("./routes"),
    config  = require("./config").server;


app.set("port",process.env.PORT || 3001)

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
  }

    //mongodb = require("./mongodb");


/*mongodb.connect(err => {
   db = mongodb.getDB();
   var sheets = db.collection('sheets');
   routes.route(app);
   app.listen(config.port, () => {
   })
});*/

app.listen(app.get("port"), () => {
    console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
  });