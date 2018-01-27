var events   = require("events");
var socketIo = require("socket.io");
var listener = require("./listener").listener;

function connectSockets(server, db, OID) {
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
   var emitters = {};

   io.on('connection', function (socket) {
      console.log('Connected');

   
      var addedUser = false;
   
      /*
      socket.on('add user', function (name) {
         if (addedUser) return;
         console.log('User added');
         socket.name = name;
         addedUser = true;
         socket.emit('login', name);
      });
      */
   
      socket.on('disconnect', function () {
         console.log("Disconnecting");

         try {
            if (typeof socket.sheet !== 'undefined'){
               var sheetId = socket.sheet;
            
               io.to(sheetId).emit('user left', { 
                  name: socket.name
               });   

               delete cursors[socket.sheet][socket.name];
               if (io.sockets.adapter.rooms[sheetId].length == 1){
                  delete cursors[socket.sheet];
                  delete emitters[socket.sheet];
                  delete colorPointer[socket.sheet];
               }
               else 
                  io.to(sheetId).emit('user left', {
                     name: socket.name
                  }); 
            }
         }
         catch(e) {
            console.error("Disconnect error", e);
         }
      });
   
      socket.on('create sheet', function (sheetName) {
         console.log("Creating sheet: ", sheetName);
         sheets.insert({name: sheetName})
            .then( function(data) {
               var id = data.insertedIds[0].toString();
               socket.emit('new sheet', id);
               colorPointer[id] = 0;
               cursors[id] = {};
               emitters[id] = {};
            })
            .catch( function(err) {
            }); 
      });
   
      socket.on('open sheet', function (data) {
         var sheetId = data.sheetId, name = data.name;
         console.log("Opening sheet: ", sheetId, ", User: ", name, ")");

         var id = new OID(sheetId);

         sheets.findOne({"_id" : id})
            .then(function(sheet) {
               socket.name = name;
               socket.join(sheetId);      
               socket.sheet = sheetId;
               if (io.sockets.adapter.rooms[sheetId].length == 1){
                  cursors[sheetId] = {};
                  emitters[sheetId] = new events.EventEmitter();
                  for (let f in sheet.functions){
                     var fun = sheet.functions[f],
                     target  = fun.target, 
                     formula = fun.formula, 
                     args    = fun.args; 

                     for (let a in args){
                        emitters[sheetId].on(args[a],
                                 listener(sheetId, target, formula, args));
                     } 
                  }
               }
               cursors[sheetId][socket.name].cell = undefined;
               colorPointer[sheetId]++;
               colorPointer[sheetId] %= nColors;
               cursors.sheetId[socket.name].color = colors[colorPointer[sheetId]];
               socket.emit('sheet data', {sheet: sheet, users: cursors.sheetId});
   
               io.to(sheetId).emit('user joined', {
                  name: socket.name,
                  cursor: cursors.sheetId[socket.name]
               });
            })
            .catch( function(err) { socket.emit('error', err); }); 
    
      }); 
   
      socket.on('close sheet', function () {
         console.log("closing sheet");
    
         var sheetId = socket.sheet;
         socket.leave(sheetId);      
         socket.sheet = undefined;
         delete cursors[sheetId][socket.name];
         if (io.sockets.adapter.rooms[sheetId].length == 1){
            delete cursors[sheetId];
            delete emitters[sheetId];
            delete colorPointer[sheetId];
         }
         else 
            io.to(sheetId).emit('user left', {
               name: socket.name
            }); 
      }); 
   
      socket.on('change sheet style', function (style) {
         console.log("changing sheet style");
         
         sheets.update({"_id": socket.sheet},
                      {$set: {"style": style}})
            .then(function() {
               io.in('sheet style changed', style);
            })
            .catch( function(err) {
               if (err)
                  socket.emit('error');
            });
      });
   
      socket.on('select cell', function (cell) {
         console.log("selecting cell ", cell);
         cursors[socket.sheet][socket.name].cell = cell;
         io.to(socket.sheet).emit('cell selected', {
            name: socket.name
         });
      });
   
      socket.on('write to cell', function (value, cell) {
         console.log("writing \"", value, "\" to cell ",  cell);
         var id = new OID(socket.sheet);
         sheets.update({"_id": socket.sheet}, 
                      {$set: {["cells."+cell+".content"]: value}})
            .then( function() {
               io.to(socket.sheet).emit('cell written to', value, cell);
               emitters[socket.sheet].emit(cell, sheets, io);
            })
            .catch( function(err) {
               if (err) 
                  socket.emit('error'); 
            }); 
      });
   
      socket.on('change cell style', function (style, cell) {
         console.log("changing style of cell ",  cell);
         var id = new OID(socket.sheet);
         sheets.update({"_id": id}, 
                      {$set: {["cells"+cell+".style"]: value}})
            .then( function() {
               io.to(socket.sheet).emit('cell changed syle', style, cell);
            })
            .catch( function (err) {
               if (err) 
                  socket.emit('error'); 
            }); 
      });
         
   
   });
}

exports.connect = connectSockets;
