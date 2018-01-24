var express = require("express"),
    app     = express();
    var cors = require('cors');

    app.use(cors());

var config  = require("./config").server;
    mongodb = require("./mongodb");
    socketsLib = require("./sockets");



app.set("port",process.env.PORT || 3001)

if (process.env.NODE_ENV === "production") 
   app.use(express.static("client/build"));
  
var server = app.listen(3001);
var io  = require('socket.io').listen(server);


mongodb.connect().then(db => {

    socketsLib.connect(app,db,io);
   //sockets.connect(app, db,io);
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

