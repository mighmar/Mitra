var express = require("express"),
    app     = express(); 

var grid    = require("./grid");

var router = express.Router();

router.get('/', function(req, res) {
   res.json({ message: "Hello world." })
});

app.use("/api", router);
app.use("/grid", grid.router);

app.listen(8080);
