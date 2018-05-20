const clean = require('gulp-clean');
const { PATH_CONFIG, TASK } = require('../../gulpfile.config');
const { prodPath, revPath } = PATH_CONFIG;


function prodCleanTask(gulp) {
    /* clean 文件清除任务 */
    gulp.task(TASK.BUILD.CLEAN.ALL, () => {
        return gulp.src([prodPath, revPath.root], {read: false})
            .pipe(clean());
    });
}


module.exports = prodCleanTask;
