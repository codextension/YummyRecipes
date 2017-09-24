var appRouter = function(app, passport, upload, fs, driver) {
    function uuidv4() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            var r = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    app.post(
        "/ping",
        passport.authenticate("basic", {
            session: false
        }),
        function(req, res, next) {
            res.json({
                answer: "pong"
            });
        }
    );

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Length, Content-Disposition"
        );
        next();
    });

    app.get("/images/get/:reference", function(req, res) {
        var reference = req.params.reference;
        res.sendFile(__dirname + "/store/" + reference);
    });

    app.post(
        "/images/upload",
        passport.authenticate("basic", {
            session: false
        }),
        upload.single("recipe_img"),
        function(req, res, next) {
            res.json(req.file);
        }
    );

    app.post(
        "/images/rm/:reference",
        passport.authenticate("basic", {
            session: false
        }),
        function(req, res, next) {
            var fileUri = __dirname + "/store/" + req.params.reference;
            fs.unlink(fileUri, function(err) {
                if (err) {
                    res.json("{deleted: false}");
                } else {
                    res.json("{deleted: true}");
                }
            });
        }
    );

    app.post(
        "/db/query",
        passport.authenticate("basic", {
            session: false
        }),
        function(req, res, next) {
            var queries = req.body.query;
            if (queries == null || queries.length == 0) {
                res.json("{error: 'no query provided'}");
            } else {
                var session = driver.session();
                var resultPromise = session.writeTransaction(function(tx) {
                    var results = [];
                    for (var i = 0; i < queries.length; i++) {
                        var result = tx.run(queries[i]);
                        results.push(
                            result.then(r => {
                                return r;
                            })
                        );
                    }
                    return Promise.all(results);
                });

                resultPromise
                    .then(result => {
                        session.close();
                        res.json(result);
                    })
                    .catch(err => {
                        session.close();
                        res.status(500).json(`{error:'${err}'}`);
                    });
            }
        }
    );
};

module.exports = appRouter;