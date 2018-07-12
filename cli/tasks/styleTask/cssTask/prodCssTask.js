const path = require('path');
const flatten = require('gulp-flatten');
const merge = require('merge-stream');
const TASK_CONFIG = require('../../../configs/task.config');
const PATH_CONFIG = require('../../../configs/path.config');
const { srcPath, cssPath, styleOutPutPath, prodPath } = PATH_CONFIG

function prodCssTask(gulp) {
    /* css 任务 */
    gulp.task(TASK_CONFIG.BUILD_CSS, [TASK_CONFIG.BUILD_CLEAN], () => {
        return gulp.src(`${srcPath}${cssPath}*.css`)
                    .pipe(flatten())
                    //.pipe(base64(BASE64_CONFIG.DEV))  // base64压缩小图片
                    .pipe(gulp.dest(`${prodPath}${styleOutPutPath}`))
    });
}

module.exports = prodCssTask