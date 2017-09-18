var copyfiles = require("copyfiles");
module.exports = function(context) {
    copyfiles(
        ["node_modules/ionic-angular/fonts/**/*", "www/assets/fonts"],
        true,
        () => {}
    );
};