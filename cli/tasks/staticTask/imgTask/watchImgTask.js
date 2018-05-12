const path = require('path');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const { deeplySearchInFolders } = require('../../../utils');
const { PATH_CONFIG, TASK } = require('../../../gulpfile.config');
const { srcPath, devPath, staticPath, imagesPath } = PATH_CONFIG;


function watchImgTask(gulp) {
    // image 任务
    gulp.task(TASK.DEV.RUNTIME_IMAGE.MAIN, () => {
        // 检测对应搜索路径下的文件夹
        let tasks = [];
        tasks.push(
            gulp.src([ `${devPath}${imagesPath}` ], {read: false})
                .pipe(clean())
        )
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


module.exports = watchImgTask;