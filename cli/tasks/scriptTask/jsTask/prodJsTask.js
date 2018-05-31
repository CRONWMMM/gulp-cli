const webpack = require('webpack');
const WEBPACK_PROD_CONFIG = require('../../../webpack.prod.conf.js');
const TASK_CONFIG = require('../../../configs/task.config');



function prodJsTask(gulp) {
    /* JS 任务 */
    gulp.task(TASK_CONFIG.BUILD.SCRIPT.MAIN, [TASK_CONFIG.BUILD.HTML.MAIN], () => {
        webpack(WEBPACK_PROD_CONFIG, (err, stats) => {});
    });
}


module.exports = prodJsTask;

