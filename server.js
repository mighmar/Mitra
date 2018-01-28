var express = require("express"),
    app     = express(),
    cors    = require("cors");


var config  = require("./config").server;
    mongodb = require("./mongodb");
    sockets = require("./sockets");
 
    process.on('uncaughtException', function (err) {
        console.log(err);
    }); 

app.use(cors());
app.set("port", config.port)

if (process.env.NODE_ENV === "production") 
   app.use(express.static("client/build"));
  
var server = app.listen(app.get("port")); 

mongodb.connect().then(db => {
   sockets.connect(server, db, mongodb.OID);

}).catch(err => {
   console.error(err);
}); 
