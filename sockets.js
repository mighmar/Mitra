var events   = require("events");
var socketIo = require("socket.io");
var listener = require("./listener");

function connectSockets(server, db) {
   var io = socketIo(server);
   var sheets = db.collection('sheets');
   var cursors = {};
   const colors = ["red", "green", "blue",
                   "yellow", "black", "purple",
                   "mint", "orange", "cyan",
                   "brown", "teal", "black",
                   "lavander", "lime", "navy",
                   "olive", "pink", "beige",
                   "maroon", "coral"];
   const nColors = colors.length;
   var colorPointer = {};
   var listeners = {};

   io.on('connection', function (socket) {
      console.log('Connected');

   
      var addedUser = false;
   
      socket.on('add user', function (username) {
         if (addedUser) return;
         console.log('User added');
         socket.username = username;
         addedUser = true;
         socket.emit('login', username);
      });
   
      socket.on('disconnect', function () {
         if (addedUser) {
            socket.broadcast.emit('user left', {
               username: socket.username,
               numUsers: numUsers
            });   
         }
      });
   
      socket.on('create sheet', function (sheetName) {
         sheets.insert({name: sheetName})
            .then( data => {
               var id = data.insertedIds[0].toString();
               socket.emit('new sheet', id);
               colorPointer[id] = 0;
               cursors[id] = {};
            })
            .catch( err => {
            }); 
      });
   
      socket.on('open sheet', function (sheetId) {
         sheets.findOne({"_id" : sheetId})
            .then(data => {
               socket.emit('sheet data', {sheet: data, users: cursors.sheetId});
               socket.join(sheetId);      
               socket.sheet = sheetId;
               cursors[sheetId][socket.name].cell = undefined;
               colorPointer[sheetId]++;
               colorPointer[sheetId] %= nColors;
               cursors.sheetId[socket.name].color = colors[colorPointer[sheetId]];
   
               if (io.sockets.adapter.rooms[sheetId].length == 1){
                  sheets.findOne({"_id" : sheetId})
                     .then( sheet => {
                        listeners[sheetId] = [];
                        //TODO
                        
                     })
                     .catch( err => {});
               }
               else
                  io.to(sheetId).emit('user joined', {
                     username: socket.username,
                     cursor: cursors.sheetId[socket.name]
                  });
                  })
                  .catch( err => { socket.emit('error'); }
                  );
         
    
      }); 
   
      socket.on('close sheet', function () {
         socket.leave(socket.sheet);      
         socket.sheet = undefined;
         delete cursors[sheetId][socket.name];
         io.to(sheetId).emit('user left', {
            username: socket.username
         });
      }); 
   
      socket.on('change sheet style', function (style) {
         sheets.update({"_id": socket.sheet},
                      {$set: {"style": style}})
            .then(() => {
               io.in('sheet style changed', style);
            })
            .catch( err => {
               if (err)
                  socket.emit('error');
            });
      });
   
      socket.on('select cell', function (cell) {
         cursors[socket.sheet][socket.name].cell = cell;
         io.to(socket.sheet).emit('cell selected', {
            username: socket.username
         });
      });
   
      socket.on('write to cell', function (value, cell) {
         sheets.update({"_id": socket.sheet}, 
                      {$set: {["cells."+cell+".content"]: value}})
            .then( () => {
               io.to(socket.sheet).emit('cell written to', value, cell);
            })
            .catch( err => {
               if (err) 
                  socket.emit('error'); 
            }); 
      });
   
      socket.on('change cell style', function (style, cell) {
         sheets.update({"_id": socket.sheet}, 
                      {$set: {["cells."+cell+".style"]: style}},
                       err => {
                          if (err) 
                             socket.emit('error'); 
                       }
         );
      });
      socket.on('change cell style', function (style, cell) {
         sheets.update({"_id": socket.sheet}, 
                      {$set: {["cells"+cell+".style"]: value}})
            .then( () => {
               io.to(socket.sheet).emit('cell changed syle', style, cell);
            })
            .catch( err => {
               if (err) 
                  socket.emit('error'); 
            }); 
      });
         
   
   });
}

exports.connect = connectSockets;
