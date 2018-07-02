const path = require('path');
const modifyCssUrls = require('gulp-modify-css-urls');
const merge = require('merge-stream');
const { deeplySearchInFolders } = require('../../../utils');
const TASK_CONFIG = require('../../../configs/task.config');
const PATH_CONFIG = require('../../../configs/path.config');
const { MODIFY_CSS_URLS_CONFIG } = require('../../../configs/plugins.config');
const { srcPath, stylePath, devPath } = PATH_CONFIG

function watchCssTask(gulp) {
    /* css 任务 */
    gulp.task(TASK_CONFIG.RUNTIME_CSS, [TASK_CONFIG.RUNTIME_SASS], () => {
        // 检测对应搜索路径下的文件夹
        let tasks = [];
        // 如果 style/ 下还有文件夹，继续探，并将下面的文件抽出来
        deeplySearchInFolders(`${srcPath}${stylePath.root}`, (dir) => {
            tasks.push(
                gulp.src(path.join(dir, '/*.css'))
                    .pipe(modifyCssUrls(MODIFY_CSS_URLS_CONFIG.DEV)) // 替换 css 样式文件中的 url 地址
                    //.pipe(base64(BASE64_CONFIG.DEV))  // base64压缩小图片
                    .pipe(gulp.dest(`${devPath}${stylePath.outputFolder}`))
            )
        })
        return merge(tasks);
    });
}

module.exports = watchCssTask