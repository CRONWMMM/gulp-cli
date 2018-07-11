const sass = require('gulp-sass');
const merge = require('merge-stream');
const webpack = require('webpack');
const WEBPACK_DEV_CONFIG = require('../../../webpack.dev.conf.js');
const TASK_CONFIG = require('../../../configs/task.config');
const PATH_CONFIG = require('../../../configs/path.config');
const { devPath, runTimePath } = PATH_CONFIG


function devJsTask(gulp) {
    /* JS 任务 */
    gulp.task(TASK_CONFIG.DEV_JS, [TASK_CONFIG.DEV_HTML], () => {
        webpack(WEBPACK_DEV_CONFIG, (err, stats) => {
            if (err || stats.hasErrors()) {     // webpack 打包出错信息
                // Handle errors here
                console.log('webpack bundle script errors, information: ', stats.compilation.errors);
            } else if (stats.hasWarnings()) {   // webpack 打包警告信息
                // Handle warnings here
                console.log('webpack bundle script warnings, information: ', stats.compilation.warnings);
            } else {
                // 完成之后将 build 里的模板文件重输出到temp目录，保证两个目录的文件统一
                gulp.src([`${devPath}**/*.html`, `!${devPath}${runTimePath}**/*.html`])
                    .pipe(gulp.dest(`${devPath}${runTimePath}`));
            }
        });
    });
}


module.exports = devJsTask