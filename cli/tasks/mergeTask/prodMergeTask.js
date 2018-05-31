const clean = require('gulp-clean');
const TASK_CONFIG = require('../../configs/task.config');
const PATH_CONFIG = require('../../configs/path.config');
const { runTimePath } = PATH_CONFIG;

function prodMergeTask(gulp) {
    /* build 合并构建任务 */
    gulp.task(TASK_CONFIG.BUILD.MAIN,
                [
                    TASK_CONFIG.BUILD.CLEAN.MAIN,
                    TASK_CONFIG.BUILD.FONTS.MAIN,
                    TASK_CONFIG.BUILD.STYLE.CSS,
                    TASK_CONFIG.BUILD.STYLE.SASS,
                    TASK_CONFIG.BUILD.HTML.MAIN,
                    TASK_CONFIG.BUILD.SCRIPT.MAIN,
                    TASK_CONFIG.BUILD.IMAGE.MAIN
                ], () => {
        gulp.src([runTimePath.build], {read: false})
            .pipe(clean());
    });
}


module.exports = prodMergeTask;