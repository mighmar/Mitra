var socket  = require('socket.io');
var events  = require("events");
var express = require('express');
var app     = express();
var server  = http.createServer(app);
var io      = require('socket.io').listen(server);
var events  = require("events");
//var mongo   = require("./mongodb");
var sheets;
var cursors;

function connectSockets(app, db) {
   var server = http.createServer(app);
   var io     = socket(server); 

   io.on('connection', function (socket) {
      var sheets = db.collection('sheets');
      var cursors;
   
      var addedUser = false;
   
      socket.on('add user', function (username) {
         if (addedUser) return;
   
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
         sheets.insert({name: sheetname})
            .then( data => {
                //TODO
            })
            .catch( err => {
            }); 
      });
   
      socket.on('open sheet', function (sheetId) {
         sheets.findOne({"_id" : sheetId})
            .then(data => {
               socket.emit('sheet data', {sheet: data, users: cursors.sheetId});
            })
            .catch( err => { socket.emit('error'); }
            );
         
    
         socket.join(sheetId);      
         socket.sheet = sheetId;
         cursors.sheetId[socket.name].cell = undefined;
         cursors.sheetId[socket.name].color = "green";
   
         if (io.sockets.adapter.rooms[sheetId].length == 1){
            sheets.findOne({"_id" : sheetId})
               .then( sheet => {
                  //TODO
               })
               .catch( err => {});
         }
         else
            io.to(sheetId).emit('user joined', {
               username: socket.username
            });
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

<<<<<<< HEAD
exports.connect = connectSockets;
=======
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
