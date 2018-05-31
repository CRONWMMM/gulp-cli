const clean = require('gulp-clean');
const sass = require('gulp-sass');
const autoPrefixer = require('gulp-autoprefixer');
const modifyCssUrls = require('gulp-modify-css-urls');
const merge = require('merge-stream');
const TASK_CONFIG = require('../../../configs/task.config');
const PATH_CONFIG = require('../../../configs/path.config');
const { AUTO_PREFIXER_CONFIG, MODIFY_CSS_URLS_CONFIG } = require('../../../configs/plugins.config');
const { srcPath, devPath, stylePath } = PATH_CONFIG;

function prodSassTask(gulp) {
    // sass 任务
    gulp.task(TASK_CONFIG.DEV.RUNTIME_STYLE.SASS, () => {
        let tasks = [];
        tasks.push(
            gulp.src([`${devPath}${stylePath.outputFolder}/**/*`], {read: false})
                .pipe(clean()),

            gulp.src(`${srcPath}${stylePath.sass.entry}`)
                .pipe(sass().on('error', sass.logError))  // sass 文件编译
                // .pipe(base64(BASE64_CONFIG.DEV))  // base64压缩小图片
                .pipe(autoPrefixer(AUTO_PREFIXER_CONFIG.DEV))   // css 样式前缀
                .pipe(modifyCssUrls(MODIFY_CSS_URLS_CONFIG.DEV)) // 替换 css 样式文件中的 url 地址
                .pipe(gulp.dest(`${devPath}${stylePath.outputFolder}`))
        );
        return merge(tasks);
    });
}


module.exports = prodSassTask;