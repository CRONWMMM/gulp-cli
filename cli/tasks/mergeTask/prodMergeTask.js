const clean = require('gulp-clean');
const { PATH_CONFIG, TASK } = require('../../gulpfile.config');
const { runTimePath } = PATH_CONFIG;

function prodMergeTask(gulp) {
    /* build 合并构建任务 */
    gulp.task(TASK.BUILD.MAIN, [TASK.BUILD.CLEAN, TASK.BUILD.STYLE.SASS, TASK.BUILD.HTML, TASK.BUILD.SCRIPT.MAIN, TASK.BUILD.IMAGE.MAIN], () => {
        gulp.src([runTimePath.build], {read: false})
            .pipe(clean());
    });
}


module.exports = prodMergeTask;