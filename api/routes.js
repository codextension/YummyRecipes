var appRouter = function(app, passport, upload) {
    app.get(
        "/images/:reference",
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
};

module.exports = appRouter;