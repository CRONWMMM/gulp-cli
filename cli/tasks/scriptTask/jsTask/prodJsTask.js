const webpack = require('webpack');
const WEBPACK_PROD_CONFIG = require('../../../webpack.prod.conf.js');
const TASK_CONFIG = require('../../../configs/task.config');



function prodJsTask(gulp) {
    /* JS 任务 */
    gulp.task(TASK_CONFIG.BUILD_JS, [TASK_CONFIG.BUILD_HTML], () => {
        webpack(WEBPACK_PROD_CONFIG, (err, stats) => {
            if (err || stats.hasErrors()) {     // webpack 打包出错信息
                // Handle errors here
                console.log('webpack bundle script errors, information: ', stats.compilation.errors);
            } else if (stats.hasWarnings()) {   // webpack 打包警告信息
                // Handle warnings here
                console.log('webpack bundle script warnings, information: ', stats.compilation.warnings);
            }
        });
    });
}


module.exports = prodJsTask;

