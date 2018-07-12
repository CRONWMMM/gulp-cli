const path = require('path');
const rev = require('gulp-rev');
const cssmin = require('gulp-cssmin');
const base64 = require('gulp-base64');
const flatten = require('gulp-flatten');
const autoPrefixer = require('gulp-autoprefixer');
const merge = require('merge-stream');
const TASK_CONFIG = require('../../../configs/task.config');
const PATH_CONFIG = require('../../../configs/path.config');
const { AUTO_PREFIXER_CONFIG, BASE64_CONFIG } = require('../../../configs/plugins.config');
const { srcPath, revPath, cssPath, styleOutPutPath, prodPath } = PATH_CONFIG

function prodCssTask(gulp) {
    /* css 任务 */
    gulp.task(TASK_CONFIG.BUILD_CSS, [TASK_CONFIG.BUILD_CLEAN], () => {
        return gulp.src(`${srcPath}${cssPath}**/*.css`)
                    .pipe(base64(BASE64_CONFIG.BUILD))  // base64压缩小图片
                    .pipe(autoPrefixer(AUTO_PREFIXER_CONFIG.BUILD)) // css 样式前缀
                    .pipe(cssmin()) // css 压缩
                    .pipe(rev())    // 装填生产环境之前先对文件名加md5后缀，防止本地缓存
                    .pipe(flatten())
                    //.pipe(base64(BASE64_CONFIG.DEV))  // base64压缩小图片
                    .pipe(gulp.dest(`${prodPath}${styleOutPutPath}`))
                    .pipe(rev.manifest())   // 生成JSON的映射表
                    .pipe(gulp.dest(`${revPath}css`));  // 装填JSON映射表
    });
}

module.exports = prodCssTask