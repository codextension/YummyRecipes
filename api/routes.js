var appRouter = function(app, passport, upload, fs, driver) {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
        next();
    });

    app.get(
        "/images/get/:reference",
        passport.authenticate("basic", { session: false }),
        function(req, res) {
            var reference = req.params.reference;
            res.sendFile(__dirname + "/store/" + reference);
        }
    );

    app.post(
        "/images/upload",
        passport.authenticate("basic", { session: false }),
        upload.single("recipe_img"),
        function(req, res, next) {
            res.json(req.file);
        }
    );

    app.post(
        "/images/rm/:reference",
        passport.authenticate("basic", { session: false }),
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
        passport.authenticate("basic", { session: false }),
        function(req, res, next) {
            var query = req.body.query;
            if (query == null || query.trim().length == 0) {
                res.json("{error: 'no query provided'}");
            } else {
                var session = driver.session();
                var resultPromise = session.writeTransaction(
                    tx => tx.run(query) // unescape(query).replace(/\+/g, " ")
                );

                resultPromise.then(result => {
                    session.close();
                    res.json(result.records);
                });
            }
        }
    );
};

module.exports = appRouter;