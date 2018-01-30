var events    = require("events");
var socketIo  = require("socket.io");

var functions = require("./functions");
var misc = require("./miscellaneous");


function connectSockets(server, db, OID) {
   var io = socketIo(server);
   var sheets = db.collection('sheets');
   var cursors = {};
   const colors = ["red", "green", "blue",
                   "yellow", "black", "purple",
                   "orange", "cyan", //"mint",
                   "brown", "teal", "black",
                   "lavander", "lime", "navy",
                   "olive", "pink", "beige",
                   "maroon", "coral"];
   const nColors = colors.length;
   var colorPointer = {};
   var emitters = {};

   io.origins('*:*');

   io.on('connection', function (socket) {
      console.log('Connected');
      var userJoined = false;
   
      socket.on('disconnect', function () {
         console.log("Disconnecting");

         try {
            if (typeof socket.sheet !== 'undefined'){
               var sheetId = socket.sheet;
            
               delete cursors[socket.sheet][socket.name];
               if (io.sockets.adapter.rooms[sheetId].length == 1){
                  delete cursors[socket.sheet];
                  delete emitters[socket.sheet];
                  delete colorPointer[socket.sheet];
               }
               else { 
                  var clone = Object.assign({}, cursors[socket.sheet]);
                  delete clone[socket.name];
                  
                  var users = misc.cursorsToArray(clone); 
                  socket.to(socket.sheet).emit('user left', users);
               }
               userJoined = false;
            }
            else 
               socket.emit('disconnect denied'); 
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
                  console.log("First visitor: ", socket.name);
                  cursors[sheetId] = {};
                  colorPointer[sheetId] = 0; 
                  emitters[sheetId] = new events.EventEmitter();
                  for (let f in sheet.functions)
                     misc.setFunctionListeners(f, emitters[sheetId]); 
               }
 
               var color = colors[colorPointer[sheetId]];
               colorPointer[sheetId]++;
               colorPointer[sheetId] %= nColors;


               cursors[sheetId][socket.name] = {};
               cursors[sheetId][socket.name].color = color;
               cursors[sheetId][socket.name].cell = undefined;

               var users = misc.cursorsToArray(cursors[sheetId]); 
               console.log("curses: ", cursors[sheetId], " => users: ", users);
               socket.emit('sheet data', {sheet: sheet, users: users});
 
               userJoined = true;
               socket.to(sheetId).emit('user joined', users);

               if (!sheet.visitors.includes(socket.name)) {
                  sheets.update({"_id": id}, 
                                {"$push": {"visitors": socket.name}
                  })
                     .catch(function () {
                        console.error("Mark visitor error");
                     });
               }
                  
            })
            .catch( function(err) { socket.emit('error', err); }); 
    
      }); 
   
/*
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
            socket.to(sheetId).emit('user left', {
               name: socket.name
            }); 
      }); 
*/
   
      socket.on('change sheet style', function (style) {
         console.log("changing sheet style");
         
         var id = new OID(socket.sheet);
         sheets.update({"_id": id},
                      {$set: {"style": style}})
            .then(function() {
               io.to(socket.sheet).emit('sheet style changed', style);
            })
            .catch( function(err) {
               if (err)
                  socket.emit('error');
            });
      });
   
      socket.on('select cell', function (coord) {
         try {
            if (userJoined) {
               var cell = misc.coordsToCell(coord);
               console.log("selecting cell ", cell);
 
               cursors[socket.sheet][socket.name].cell = cell;
               
               var users = misc.cursorsToArray(cursors[socket.sheet]); 
               io.to(socket.sheet).emit('cell selected', users);
            }
            else {
               console.log("selection denied");
               socket.emit('selection denied');
            }
         }
         catch (err) {
            console.error("select cell error");
         }
      });
   
      socket.on('write to cell', function (data) {
         var value = data.value;
         var coords = {row: data.row, col: data.col};
         var cell = misc.coordsToCell(coords);

         console.log("writing \"", value, "\" to cell ",  cell);
         var id = new OID(socket.sheet);
         sheets.update({"_id": id}, 
                       {"$set": {["cells."+cell+".content"]: value}})
            .then( function() {
               socket.to(socket.sheet).emit('cell written to', data);
               emitters[socket.sheet].emit(cell, sheets, io);
            })
            .catch( function(err) {
               if (err) 
                  socket.emit('cell write error'); 
            }); 
      });
   
      socket.on('change cell style', function (data) {
         var style = data.style;
         var coords = {"row": data.row, "col": data.col};
         var cell = misc.coordsToCell(coords);

         console.log("changing style of cell ",  cell);
         var id = new OID(socket.sheet);
         sheets.update({"_id": id}, 
                       {$set: {["cells"+cell+".style"]: value}})
            .then( function() {
               socket.to(socket.sheet).emit('cell changed syle', data);
            })
            .catch( function (err) {
               if (err) 
                  socket.emit('cell style error'); 
            }); 
      });

      socket.on('visited sheets', function (name) {
         sheets.find({"visitors": socket.name}).project({}).toArray()
            .then(function(data) {
               socket.emit('sheets visited', data);
            });
      });

      socket.on('set function', function (data) {
         var coords = {"row": data.row, "col": data.col};
         var formula = data.formula;
         var target = misc.coordsToCell(coords);

         var fun = functions.parse(formula);
         fun.target = target;

         var id = new OID(socket.sheet);
         sheets.update({"_id": id},
                       {"$push": 
                          {"functions": fun}
                       
         })
            .then(function () {
               misc.setFunctionListeners(fun, emitters[socket.sheet], socket.sheet);
               socket.to(socket.sheet).emit('function set', data);
         })
            .catch(function (err) {
               if (err){
                  socket.emit('setting function error');
               }
         });

      }); 
   
   });
}

exports.connect = connectSockets;
