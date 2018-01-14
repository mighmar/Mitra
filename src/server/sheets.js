
function getRouter() {
   var mongodb = require("./mongodb");
   var sheetDB = mongodb.getSheetDB();
   var logDB = mongodb.getLogDB();
   var createLog = mongodb.createLog;
   var OID = mongodb.OID;
   var sheets = sheetDB.collection('sheets');
   var router = require("express").Router();
   var locks = {};

   

   router.get("/sheets", (req, res) => {
      sheets.find().toArray((err, data) => {
         if (err) 
            res.status(404).send(err);
         else 
	    res.status(200).send(data);
      });
      res.set({
	 'Cache-Control': 'no-cache'
      });
   });

   router.get("/sheets/:sheetId", (req, res) => {
      var id = new OID(req.params.sheetId);

      if (req.get('If-Modified-Since')){
         var time = req.get('If-Modified-Since');
         logDB.collection(id.toString()).find(
            {
               'time': {$gt: time}
            }, (err, data) => {
            if (err){
               res.status(404).send(err);
               console.error(err);
            }
            else{
               res.status(200).send(data);
               console.log(data);
            }
         });
      }

      else {
         sheets.findOne({"_id" : id}, (err, data) => {
            if (err) 
               res.status(404).send(err);
            else
               res.status(200).send(data);
         });
         res.set({
            'Cache-Control': 'no-cache'
         });
      }

   });

   router.delete("/sheets/:sheetId", (req, res) => {
      var id = new OID(req.params.sheetId);
      sheets.findOneAndDelete({"_id" : id}, (err, data) => {
         if (err) 
            res.status(404).send(err); 
         else 
            logDB.collection(id.toString()).drop( (err, data) => {
               if (err) 
                  res.status(404).send(err); 
               else
               res.status(200).send("Sheet deleted");
            }); 
      });
      res.set({
         'Cache-Control': 'no-cache'
      });
   });

   router.post("/sheets/", (req, res) => {
      sheets.insert({}, (err, data) => {
         if (err) 
            res.status(500).send(err);
         else {
            var id = data.insertedIds[0].toString();
            createLog(id, (err, data) => {
               if (err)
                  res.status(500).send(err); 
               else 
                  res.status(201).send(id);
            });
         }
      });
      res.set({
         'Cache-Control': 'no-cache'
      });
   });

   router.put("/sheets/:sheetId/:cell/content", (req, res) => { 
      var id = new OID(req.params.sheetId);
      var log = logDB.collection(id.toString());
      var cell = req.params.cell;

      if (locks[cell])
         res.status(409).send("Conflict");
      else { 
              locks[cell] = true;
	      sheets.update({"_id": id}, 
                            { $set: {["cells."+cell+".content"]: req.body}},
                            (err, data) => {
                               if (err)
		                  res.status(500).send(err); 
                               else 
                                  log.insert(
                                  {
                                     "cell" : cell, 
                                     "property" : "value",
                                     "content" : req.body,
                                     "time" : new Date()
                                  }
                                  , (err, data) => { 
                                     if (err)
		                        res.status(500).send(err); 
                                     else
			                res.status(204).send("No content");
                                  });
                               locks[cell] = false;
	      });
      }
      res.set({
         'Cache-Control': 'no-cache'
      });
   });

   router.put("/sheets/:sheetId/:cell/style", (req, res) => { 
      var id = new OID(req.params.sheetId);
      var cell = req.params.cell;

      sheets.update({"_id": id}, {$set: {["cells."+cell+".style"]: req.body}}, (err, data) => {
         if (err)
            res.status(500).send(err);
         else
            res.status(204).send("No content");
      });
      res.set({
         'Cache-Control': 'no-cache'
      });
   });

   router.put("/sheets/:sheetId/:cell", (req, res) => {            //merge
      var id = new OID(req.params.sheetId);
   });
 
   return router;
} 

exports.getRouter = getRouter;
