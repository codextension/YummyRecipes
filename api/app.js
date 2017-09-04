//TODO find a better solution
const API_USERNAME = "elie";
const API_PASSWORD = "pwd";

const NEO_USERNAME = "neo4j";
const NEO_PASSWORD = "pwd";

const API_PORT_NB = 3443;

var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
var https = require("https"); // http://blog.mgechev.com/2014/02/19/create-https-tls-ssl-application-with-express-nodejs/
var privateKey = fs.readFileSync("sslcert/server.key", "utf8");
var certificate = fs.readFileSync("sslcert/server.crt", "utf8");

var credentials = { key: privateKey, cert: certificate };

var util = require("util");
var path = require("path");
var app = express();
var passport = require("passport");
var BasicStrategy = require("passport-http").BasicStrategy;
var multer = require("multer");

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
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

passport.use(
    new BasicStrategy(function(username, password, done) {
        if (username == API_USERNAME) {
            return done(null, username, API_PASSWORD);
        } else {
            return done("Wrong credentials.");
        }
    })
);

var neo4j = require("neo4j-driver").v1;
var driver = neo4j.driver(
    "bolt://localhost",
    neo4j.auth.basic(NEO_USERNAME, NEO_PASSWORD)
);

var routes = require("./routes.js")(app, passport, upload, fs, driver);

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(API_PORT_NB, function() {
    console.log("Listening on port %s...", httpsServer.address().port);
});
