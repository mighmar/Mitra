var express = require("express"),
    app     = express(),
    cors    = require("cors");


var config  = require("./config").server;
    mongodb = require("./mongodb");
    sockets = require("./sockets");
 


app.set("port", config.port)
app.use(cors());

//var intervalID = setInterval(function(){console.log("I'm alive!");}, 50000);
  
var server = app.listen(app.get("port")); 

console.log("connecting to mongo");
mongodb.connect().then(db => {
   console.log("connecting sockets");
   sockets.connect(server, db, mongodb.OID);

}).catch(err => {
   console.error(err);
}); 
