const sass = require('gulp-sass');
const merge = require('merge-stream');
const webpack = require('webpack');
const WEBPACK_DEV_CONFIG = require('../../../webpack.dev.conf.js');
const { PATH_CONFIG, TASK } = require('../../../gulpfile.config');
const { devPath, runTimePath } = PATH_CONFIG


function devJsTask(gulp) {
    /* JS 任务 */
    gulp.task(TASK.DEV.SCRIPT.MAIN, [TASK.DEV.HTML], () => {
        webpack(WEBPACK_DEV_CONFIG, (err, status) => {
            if (err != null) console.log('webpack bundle script error, information: ', err);
            // 完成之后将 build 里的模板文件重输出到temp目录，保证两个目录的文件统一
            gulp.src([`${devPath}**/*.html`, `!${runTimePath.dev}**/*.html`])
                .pipe(gulp.dest(`${runTimePath.dev}`));
        });
    });
}


module.exports = devJsTask