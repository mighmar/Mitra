var events    = require("events");
var socketIo  = require("socket.io");
var functions = require("./functions");

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

   io.on('connection', function (socket) {
      console.log('Connected');

   
      var userJoined = false;
   
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
               enteredSheet = false;
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


      function setFunctionListeners (fun, emitter) {
         var target  = fun.target, 
         formula     = fun.formula, 
         args        = fun.args; 

         for (let i in args){
            emitter.on(args[i],
                        functions.listener(sheetId, target, formula, args));
         } 
      }


      function cellToCoords (cell) {
         var res = {};
         if (typeof cell !== 'undefined') { 
            var re = /^([A-Z]+)([1-9][0-9]*)$/
            var split = re.exec(cell);
            res.row = split[2];
            var alpha = split[1];
            var A = 'A'.charCodeAt(0);
            
            var val = 0;
            for (var i = 0; i < alpha.length; i++) {
               val *= 26;
               val += alpha[i].charCodeAt(0) - A + 1;
            } 
            res.col = val;
         }
         else {
            res.col = null;
            res.row = null;
         }

         return res;
      }

      function coordsToCell (coord) {
         var res = "";
         if (coord.row != null && coord.col != null) { 
            var A = 'A'.charCodeAt(0);
            
            var val;
            for (val = coord.col; val != 0; val = Math.floor(val/26)) {
               res = String.fromCharCode(A + val % 26 - 1) + res;
            } 
            res+= coord.row;
         }
         else {
            res = undefined;
         }

         return res;
      }


      function cursorsToArray (curses) {
         var result = [];
         var user = {};

         for (let c in curses){
            user = {};
            user.username = c;
            user.color = curses[c].color; 


            var coords = cellToCoords(curses[c].cell);
            user.row = coords.row;
            user.col = coords.col;

            result.push(user);
         }  
         return result;
      }
   
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
                  colorPointer[sheetId] = 0; 
                  emitters[sheetId] = new events.EventEmitter();
                  for (let f in sheet.functions)
                     setFunctionListeners(f, emitters[sheetId]); 
               }
 
               var color = colors[colorPointer[sheetId]];
               colorPointer[sheetId]++;
               colorPointer[sheetId] %= nColors;


               cursors[sheetId][socket.name] = {};
               cursors[sheetId][socket.name].color = color;
               cursors[sheetId][socket.name].cell = undefined;

               var users = cursorsToArray(cursors[sheetId]); 
               console.log("curses: ", cursors[sheetId], " => users: ", users);
               socket.emit('sheet data', {sheet: sheet, users: users, curses: cursors[sheetId]} );
 
               userJoined = true;
               io.to(sheetId).emit('user joined', {
                  name: socket.name,
                  cursor: cursors[sheetId][socket.name]
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
   
      socket.on('select cell', function (coord) {
         try {
            if (userJoined) {
               var cell = coordsToCell(coord);
               console.log("selecting cell ", cell);
 
               cursors[socket.sheet][socket.name].cell = cell;
               var clone = Object.assign({}, cursors[socket.sheet]);
               //delete clone[socket.name];
               
               var users = cursorsToArray(clone); 
               io.to(socket.sheet).emit('cell selected', users);
            }
            else 
               socket.emit('selection denied');
         }
         catch (err) {
            console.error("select cell error");
         }
      });
   
      socket.on('write to cell', function (data) {
         var value = data.value;
         var cell = data.cell;

         console.log("writing \"", value, "\" to cell ",  cell);
         var id = new OID(socket.sheet);
         sheets.update({"_id": socket.sheet}, 
                       {$set: {["cells."+cell+".content"]: value}})
            .then( function() {
               io.to(socket.sheet).emit('cell written to', data);
               emitters[socket.sheet].emit(cell, sheets, io);
            })
            .catch( function(err) {
               if (err) 
                  socket.emit('cell write error'); 
            }); 
      });
   
      socket.on('change cell style', function (data) {
         var style = data.style;
         var cell = data.cell;
         console.log("changing style of cell ",  cell);
         var id = new OID(socket.sheet);
         sheets.update({"_id": id}, 
                       {$set: {["cells"+cell+".style"]: value}})
            .then( function() {
               io.to(socket.sheet).emit('cell changed syle', data);
            })
            .catch( function (err) {
               if (err) 
                  socket.emit('cell style error'); 
            }); 
      });

      socket.on('set function', function (data) {
         var target = data.target;
         var formula = data.formula;

         var fun = functions.parse(formula);
         fun.target = target;

         var id = new OID(socket.sheet);
         sheets.update({"_id": id},
                       {"$push": 
                          {"functions": fun}
                       
         })
            .then(function () {
               setFunctionListeners(fun, emitters[socket.sheet]);
               io.to(socket.sheet).emit('function set', data);
         })
            .catch(function (err) {
               if (err){
                  io.emit('setting function error');
               }
         });

      });
         
   
   });
}

exports.connect = connectSockets;
