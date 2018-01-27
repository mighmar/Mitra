var Parser = require('expr-eval').Parser;

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

            sheet.update({"_id": sheetId}, 
                         {$set: {["cells."+target+".content"]: newValue}})
               .then( () => {
                  io.to(sheetId).emit('cell changed by function', newValue, target);
               })
               .catch( err => {
                  if (err) 
                     console.error("Function evaluation error");
               }); 
            
         })
         .catch(err => {}); 
   }
}

function parseFunction(formula){
   var result = {};
   result.args = [];
   var i = 1;
   var match;
   var re = /[A-Z]+[1-9][0-9]*/

   while((match = re.exec(formula)) != null) {
      result.args.push(match[0]);
      formula = formula.replace(match[0], "x" + i++);
   }

   result.formula = formula;

   return result;

}

exports.listener = listener;
exports.parse = parseFunction;
