const path = require('path');
const flatten = require('gulp-flatten');
const modifyCssUrls = require('gulp-modify-css-urls');
const merge = require('merge-stream');
const TASK_CONFIG = require('../../../configs/task.config');
const PATH_CONFIG = require('../../../configs/path.config');
const { MODIFY_CSS_URLS_CONFIG } = require('../../../configs/plugins.config');
const { srcPath, cssPath, styleOutPutPath, devPath } = PATH_CONFIG

function devCssTask(gulp) {
    /* css 任务 */
    gulp.task(TASK_CONFIG.DEV_CSS, [TASK_CONFIG.DEV_CLEAN], () => {
        return gulp.src(`${srcPath}${cssPath}**/*.css`)
                    .pipe(modifyCssUrls(MODIFY_CSS_URLS_CONFIG.DEV)) // 替换 css 样式文件中的 url 地址
                    .pipe(flatten())
                    //.pipe(base64(BASE64_CONFIG.DEV))  // base64压缩小图片
                    .pipe(gulp.dest(`${devPath}${styleOutPutPath}`))
    });
}

module.exports = devCssTask