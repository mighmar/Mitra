
function getRouter(){
   var db = require("./mongodb").getDB();
   var OID = require("./mongodb").OID;
   var sheets = db.collection('sheets');
   var router = require("express").Router();

   router.get("/sheets", (req, res) => {
      sheets.find().toArray((err, data) => {
         res.send(data);
      });
      res.set({
         'Cache-Control': 'no-cache'
      });
   });

   router.get("/sheets/:sheetId", (req, res) => {
      var id = new OID(req.params.sheetId);
      sheets.findOne({"_id" : id}, (err, data) => {
         res.send(data);
      });
      res.set({
         'Cache-Control': 'no-cache'
      });
   });

   router.delete("/sheets/:sheetId", (req, res) => {
      var id = new OID(req.params.sheetId);
      sheets.findOneAndDelete({"_id" : id}, (err, data) => {
         res.send(data);
      });
      res.set({
         'Cache-Control': 'no-cache'
      });
   });
 
   return router;
} 

exports.getRouter = getRouter;
