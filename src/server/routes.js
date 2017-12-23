var grid = require("./grid");

function route(app) {
    app.use("/grid", grid.router);
}

exports.route = route;
