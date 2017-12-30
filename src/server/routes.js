var sheets = require("./sheets");

function route(app) {
    
   app.use("/", sheets.getRouter());
}

exports.route = route;
