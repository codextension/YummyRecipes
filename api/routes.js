var multer = require("multer");
//var upload = multer({ dest: "store/" });
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "store/");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname.toLowerCase());
    }
});

function fileFilter(req, file, cb) {
    if (file.mimetype.indexOf('jpeg') ||
        file.mimetype.indexOf('png') ||
        file.mimetype.indexOf('gif')) {
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

var appRouter = function(app) {
    app.get("/images/:reference", function(req, res) {
        var reference = req.params.reference;
        res.sendFile(__dirname + "/store/" + reference);
    });

    app.post("/images/upload", upload.single("recipe_img"), function(
        req,
        res,
        next
    ) {
        res.json(req.file);
    });
};

module.exports = appRouter;