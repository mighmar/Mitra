var express = require("express"),
    app     = express(),
    cors    = require("cors");


var config  = require("./config").server;
    mongodb = require("./mongodb");
    sockets = require("./sockets");
 


app.use(cors());
app.set("port", config.port)

if (process.env.NODE_ENV === "production") 
   app.use(express.static("client/build"));
  
var server = app.listen(app.get("port")); 

mongodb.connect().then(db => {
   sockets.connect(server,db);

}).catch(err => {
   console.error(err);
}); 
