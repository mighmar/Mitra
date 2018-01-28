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

console.log("connecting to mongo");
/*mongodb.connect().then(db => {
   console.log("connecting sockets");
   sockets.connect(server, db, mongodb.OID);

}).catch(err => {
   console.error(err);
}); 
*/

var socketIo  = require("socket.io");
var io = socketIo(server);
io.on('connection', function (socket) {
   peraRow = 1;
   socket.on('open sheet', function (data) { 
      console.log("User ", data.name, " Opening sheet ", data.sheetId);
      socket.emit('sheet data', {sheet: {}, users: [{username:"Pera", color: "red", row: 2, col: 2}]}); 
   }
   socket.on('select cell', function (data) {
      console.log("Selecting cell ", data.row, ":", data.col);
      socket.emit('cell selected', [{username:"Pera", color: "red", row: peraRow++, col: 2}]);
   }
}

