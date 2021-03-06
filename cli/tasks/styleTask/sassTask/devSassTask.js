const path = require('path');
const sass = require('gulp-sass');
const flatten = require('gulp-flatten');
const autoPrefixer = require('gulp-autoprefixer');
const merge = require('merge-stream');
const TASK_CONFIG = require('../../../configs/task.config');
const PATH_CONFIG = require('../../../configs/path.config');
const { AUTO_PREFIXER_CONFIG } = require('../../../configs/plugins.config');
const { srcPath, sassPath, styleOutPutPath, devPath } = PATH_CONFIG

function devSassTask(gulp) {
    /* sass 任务 */
    gulp.task(TASK_CONFIG.DEV_SASS, [TASK_CONFIG.DEV_CLEAN], () => {
        return gulp.src(`${srcPath}${sassPath}*.scss`)
                    .pipe(sass().on('error', sass.logError))  // sass 文件编译
                    .pipe(autoPrefixer(AUTO_PREFIXER_CONFIG.DEV))   // css 样式前缀
                    .pipe(flatten())
                    //.pipe(base64(BASE64_CONFIG.DEV))  // base64压缩小图片
                    .pipe(gulp.dest(`${devPath}${styleOutPutPath}`))
    });
}

module.exports = devSassTask