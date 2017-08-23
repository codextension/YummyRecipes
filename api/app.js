var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var http = require("http");
var util = require("util");
var path = require("path");
var app = express();
var passport = require("passport");
var DigestStrategy = require("passport-http").DigestStrategy;
var multer = require("multer");
const USERNAME = "elie";
const PASSWORD = "pwd";
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "store/");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname.toLowerCase());
    }
});

function fileFilter(req, file, cb) {
    if (file.mimetype == null) {
        cb(null, false);
    } else if (
        file.mimetype.indexOf("jpeg") ||
        file.mimetype.indexOf("png") ||
        file.mimetype.indexOf("gif")
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

var upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        files: 1,
        fileSize: 1000000,
        fields: 2
    }
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

passport.use(
    new DigestStrategy({
            qop: "auth"
        },
        function(username, done) {

            if (username == USERNAME) {
                return done(null, username, PASSWORD);
            } else {
                return done("Wrong credentials.");
            }
        },
        function(params, done) {
            // validate nonces as necessary
            done(null, true);
        }
    )
);

var routes = require("./routes.js")(app, passport, upload);

var server = app.listen(3000, function() {
    console.log("Listening on port %s...", server.address().port);
});