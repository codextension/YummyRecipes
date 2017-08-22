var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var http = require("http");
var util = require("util");
var path = require("path");
var app = express();

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

var routes = require("./routes.js")(app);

var server = app.listen(3000, function() {
    console.log("Listening on port %s...", server.address().port);
});