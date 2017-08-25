var appRouter = function(app, passport, upload, fs, driver) {
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
            var session = driver.session();
            var resultPromise = session.writeTransaction(tx =>
                tx.run(unescape(req.body.query).replace(/\+/g, " "))
            );

            resultPromise.then(result => {
                session.close();

                const singleRecord = result.records[0];
                const node = singleRecord.get(0);

                console.log(node.properties.name);

                res.json(node.properties);
            });
        }
    );
};

module.exports = appRouter;