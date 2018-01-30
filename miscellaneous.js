
function setFunctionListeners (fun, emitter, sheetId) {
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

function cellsToArray (cells) {
   var res = [];
   var newCell = {};
   for (c in cells){
      newCell = cellToCoords(c);
      newCell.value = cells[c].content;
      newCell.style = cells[c].style;
      res.push(newCell);
   }
   return res; 
}

exports.setFunctionListeners = setFunctionListeners;
exports.cellToCoords = cellToCoords;
exports.coordsToCell = coordsToCell;
exports.cursorsToArray = cursorsToArray;
exports.cellsToArray = cellsToArray;
