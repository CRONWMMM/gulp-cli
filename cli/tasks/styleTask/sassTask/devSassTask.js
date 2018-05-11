const path = require('path');
const sass = require('gulp-sass');
const modifyCssUrls = require('gulp-modify-css-urls');
const autoPrefixer = require('gulp-autoprefixer');
const merge = require('merge-stream');
const { deeplySearchInFolders } = require('../../../utils');
const { PATH_CONFIG, TASK, MODIFY_CSS_URLS_CONFIG, AUTO_PREFIXER_CONFIG } = require('../../../gulpfile.config');
const { srcPath, stylePath, devPath } = PATH_CONFIG

function devSassTask(gulp) {
    /* sass 任务 */
    gulp.task(TASK.DEV.STYLE.SASS, [TASK.DEV.CLEAN.ALL], () => {
        // 检测对应搜索路径下的文件夹
        let tasks = [];
        // 如果 style/ 下还有文件夹，继续探，并将下面的文件抽出来
        deeplySearchInFolders(`${srcPath}${stylePath.root}`, (dir) => {
            tasks.push(
                gulp.src(path.join(dir, '/*.scss'))
                    .pipe(sass().on('error', sass.logError))  // sass 文件编译
                    .pipe(autoPrefixer(AUTO_PREFIXER_CONFIG.DEV))   // css 样式前缀
                    .pipe(modifyCssUrls(MODIFY_CSS_URLS_CONFIG.DEV)) // 替换 css 样式文件中的 url 地址
                    //.pipe(base64(BASE64_CONFIG.DEV))  // base64压缩小图片
                    .pipe(gulp.dest(`${devPath}${stylePath.outputFolder}`))
            )
        })
        return merge(tasks);
    });
}

module.exports = devSassTask