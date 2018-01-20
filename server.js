var express = require("express"),
    app     = express();

var config  = require("./config").server;
    mongodb = require("./mongodb");
    sockets = require("./sockets");


app.set("port",process.env.PORT || 3001)

if (process.env.NODE_ENV === "production") 
   app.use(express.static("client/build"));
  
mongodb.connect().then(db => {
   app.listen(app.get("port"));

   sockets.connect(app, db);
}).catch(err => {
   console.error(err);
});



/*mongodb.connect(err => {
   db = mongodb.getDB();
   var sheets = db.collection('sheets');
   routes.route(app);
   app.listen(config.port, () => {
   })
});*/

