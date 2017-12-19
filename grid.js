var router = require("express").Router();

router.get("/", function(req, res) {
	res.writeHead(200, {"Content-Type": "text/html"});
        res.write("GET grids");
        res.end();
});

exports.router = router;
