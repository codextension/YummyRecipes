const API_PORT_NB = 3443;

var argv = process.env;
var valid = (argv.api_user != null) && (argv.api_pwd != null) && (argv.neo_user != null) && (argv.api_pwd != null) && (argv.store != null);

if (!valid) {
    throw new Error("you need to provide the following environment variables: \nstore=<store_location> api_user=<username> api_pwd=<pwd> neo_user=<username> neo_pwd=<pwd> neo_server=localhost");
}

const API_USERNAME = argv.api_user;
const API_PASSWORD = argv.api_pwd;

const NEO_SERVER = argv.neo_server;
const NEO_USERNAME = argv.neo_user;
const NEO_PASSWORD = argv.neo_pwd;


var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");

var https = require("https"); // http://blog.mgechev.com/2014/02/19/create-https-tls-ssl-application-with-express-nodejs/
var privateKey = fs.readFileSync("sslcert/server.key", "utf8");
var certificate = fs.readFileSync("sslcert/server.crt", "utf8");
var credentials = { key: privateKey, cert: certificate };

var http = require('http');

var util = require("util");
var path = require("path");
var app = express();
var passport = require("passport");
var BasicStrategy = require("passport-http").BasicStrategy;
var multer = require("multer");
var schedule = require("node-schedule");
var neo4j = require("neo4j-driver").v1;

function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, argv.store);
    },
    filename: function(req, file, cb) {
        cb(null, uuidv4() + "." + file.originalname.toLowerCase().split(".")[1]);
    }
});

function fileFilter(req, file, cb) {
    if (file.mimetype == null) {
        cb(null, false);
    } else if (
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/png" ||
        file.mimetype == "image/gif" ||
        file.mimetype == "image/jpg"
    ) {
        cb(null, true);
    } else {
        cb(new Error("invalid_file_type"), false);
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
        if (username == API_USERNAME && password == API_PASSWORD) {
            return done(null, username, API_PASSWORD);
        } else {
            return done("Wrong credentials.");
        }
    })
);

var driver = neo4j.driver(
    "bolt://"+NEO_SERVER,
    neo4j.auth.basic(NEO_USERNAME, NEO_PASSWORD)
);

schedule.scheduleJob("0 0 * * 0", function() {
    var imageDir = argv.store;

    var session = driver.session();
    var resultPromise = session.writeTransaction(function(tx) {
        var result = tx.run(
            "match(r:Recipe) where not r.imageUrl contains('no_image') return r.imageUrl"
        );
        return result;
    });

    resultPromise
        .then(result => {
            session.close();
            var images = [];
            if (result.records.length > 0) {
                for (var i = 0; i < result.records.length; i++) {
                    images.push(result.records[i]._fields[0]);
                }
            }
            console.log(
                `DB images found:${images.length}, and named:${images.join(",")}`
            );
            fs.readdir(imageDir, function(err, items) {
                console.log(
                    `FS images found:${items.length}, and named:${items.join(",")}`
                );
                for (var i = 0; i < items.length; i++) {
                    var index = images.findIndex(function(value, index, obj) {
                        return value.endsWith(`/${items[i]}`);
                    });
                    if (index == -1) {
                        fs.unlink(imageDir + items[i], function(err) {});
                    }
                }
            });
        })
        .catch(err => {
            session.close();
        });
});

var routes = require("./routes.js")(app, passport, upload, fs, driver, argv);

//var httpsServer = https.createServer(credentials, app);
var httpServer = http.createServer(app);

//httpsServer.listen(API_PORT_NB, function() {
//    console.log("Listening on port %s...", httpsServer.address().port);
//});
httpServer.listen(8383, function () {
    console.log("Listening on port %s...", httpServer.address().port);
});