var appRouter = function(app, passport, upload, fs) {
    app.get(
        "/images/get/:reference",
        passport.authenticate("digest", { session: false }),
        function(req, res) {
            var reference = req.params.reference;
            res.sendFile(__dirname + "/store/" + reference);
        }
    );

    app.post(
        "/images/upload",
        passport.authenticate("digest", { session: false }),
        upload.single("recipe_img"),
        function(req, res, next) {
            res.json(req.file);
        }
    );

    app.post(
        "/images/rm/:reference",
        passport.authenticate("digest", { session: false }),
        function(req, res) {
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
};

module.exports = appRouter;