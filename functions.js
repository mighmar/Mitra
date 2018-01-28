var Parser = require('expr-eval').Parser;

var mongo = require('./mongodb');
var misc = require('./miscellaneous');

function listener(sheetId, target, formula, args) {
   return function (sheets, io) {
      sheets.findOne({"_id": sheetId})
         .then (sheet => {
            var vArgs = args.map (x => sheet.target[x]);
	    var variables = {};
            var parser = new Parser();

            for (var i = 1; i <= vArgs.length; i++)
               variables['x'+i] = vArgs[i];
            var newValue = parser.parse(formula).evaluate(variables);

            var id = mongo.OID(sheetId);
            sheet.update({"_id": id}, 
                         {$set: {["cells."+target+".content"]: newValue}})
               .then( () => {
                  var data = misc.cellToCoords(target);
                  data.value = newValue;
                  io.to(sheetId).emit('cell changed by function', data);
               })
               .catch( err => {
                  if (err) 
                     console.error("Function evaluation error");
               }); 
            
         })
         .catch(function(err) {
            console.error("listener call error: ", err);   
         }); 
   }
}

function parseFunction(formula){
   var result = {};

   try {
      result.args = [];
      var i = 1;
      var match;
      var re = /[A-Z]+[1-9][0-9]*/

      while((match = re.exec(formula)) != null) {
         result.args.push(match[0]);
         formula = formula.replace(match[0], "x" + i++);
      }

      result.formula = formula;
   }
   catch (err) {
      console.error("Parse function error: ", err);
   }

   return result;

}

exports.listener = listener;
exports.parse = parseFunction;
