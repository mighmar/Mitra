var Parser = require('expr-eval').Parser;

function listener(sheetId, cell, formula, args) {
   return function (sheets, io) {
      sheets.findOne({"_id": sheetId})
         .then (sheet => {
            var vArgs = args.map (x => sheet.cells[x]);
	    var variables = {};
            var parser = new Parser();

            for (var i = 1; i <= vArgs.length; i++)
               variables['x'+i] = vArgs[i];
            var newValue = parser.parse(formula).evaluate(variables);

            sheet.update({"_id": sheetId}, 
                         {$set: {["cells."+cell+".content"]: newValue}})
               .then( () => {
                  io.to(sheetId).emit('cell written to', newValue, cell);
               })
               .catch( err => {
                  if (err) 
                     console.error("Function evaluation error");
               }); 
            
         })
         .catch(err => {}); 
   }
}
