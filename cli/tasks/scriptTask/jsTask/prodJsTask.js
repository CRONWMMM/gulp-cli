const webpack = require('webpack');
const WEBPACK_PROD_CONFIG = require('../../../webpack.prod.conf.js');
const { TASK } = require('../../../gulpfile.config');



function prodJsTask(gulp) {
    /* JS 任务 */
    gulp.task(TASK.BUILD.SCRIPT.MAIN, [TASK.BUILD.HTML], () => {
        webpack(WEBPACK_PROD_CONFIG, (err, stats) => {});
    });
}


module.exports = prodJsTask;

