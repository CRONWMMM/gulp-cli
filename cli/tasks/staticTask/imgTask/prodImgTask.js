const path = require('path');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const merge = require('merge-stream');
const { deeplySearchInFolders } = require('../../../utils');
const TASK_CONFIG = require('../../../configs/task.config');
const PATH_CONFIG = require('../../../configs/path.config');
const { srcPath, prodPath, staticPath, imagesPath } = PATH_CONFIG;

function prodImgTask(gulp) {
    /* image 任务 */
    gulp.task(TASK_CONFIG.BUILD.IMAGE.MAIN, () => {
        // 检测对应搜索路径下的文件夹
        let tasks = [];
        tasks.push(
            gulp.src([ `${prodPath}${imagesPath}` ], {read: false})
                .pipe(clean())
        )
        // 如果 static/images/ 下还有文件夹，继续探，并将下面的文件抽出来
        deeplySearchInFolders(`${srcPath}${imagesPath}`, (dir) => {
            tasks.push(
                gulp.src(path.join(dir, '/*.*')).pipe(imagemin({
                    progressive: true,// 无损压缩JPG图片
                    svgoPlugins: [{removeViewBox: false}], // 不移除svg的viewbox属性
                })).pipe(gulp.dest(`${prodPath}${staticPath}`))
            )
        })
        return merge(tasks);
    });
}


module.exports = prodImgTask;