const path = require('path');
const imagemin = require('gulp-imagemin');
const merge = require('merge-stream');
const { deeplySearchInFolders } = require('../../../utils');
const TASK_CONFIG = require('../../../configs/task.config');
const PATH_CONFIG = require('../../../configs/path.config');
const { devPath, srcPath, imagesPath, staticPath } = PATH_CONFIG


function devImgTask(gulp) {
    /* image 任务 */
    gulp.task(TASK_CONFIG.DEV.IMAGE.MAIN, [TASK_CONFIG.DEV.SCRIPT.MAIN], () => {
        // 检测对应搜索路径下的文件夹
        let tasks = [];
        // 如果 static/images/ 下还有文件夹，继续探，并将下面的文件抽出来
        deeplySearchInFolders(`${srcPath}${imagesPath}`, (dir) => {
            tasks.push(
                gulp.src(path.join(dir, '/*.*'))
                    .pipe(imagemin())
                    .pipe(gulp.dest(`${devPath}${staticPath}`))
            )
        })
        return merge(tasks);
    });
}


module.exports = devImgTask