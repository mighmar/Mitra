var express = require("express"),
    app     = express(),
    cors    = require("cors");

var config  = require("./config").server;
    mongodb = require("./mongodb");
    sockets = require("./sockets");


app.use(cors(credentials:true, origin:true));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept-Type');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
})
app.set("port", config.port)
//app.use(cors());
  
var server = app.listen(app.get("port")); 

console.log("connecting to mongo");
mongodb.connect().then(db => {
   console.log("connecting sockets");
   sockets.connect(server, db, mongodb.OID);

}).catch(err => {
   console.error(err);
}); 
