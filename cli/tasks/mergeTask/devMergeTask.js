const { TASK } = require('../../gulpfile.config');

function devMergeTask(gulp) {

    /* dev 合并构建任务 */
    gulp.task(TASK.DEV.MAIN, [TASK.DEV.CLEAN.ALL, TASK.DEV.STYLE.CSS, TASK.DEV.STYLE.SASS, TASK.DEV.HTML, TASK.DEV.SCRIPT.MAIN, TASK.DEV.IMAGE.MAIN, TASK.DEV.FONTS.MAIN, TASK.DEV.NODEMON, TASK.DEV.BROWSER_SYNC], () => {});

}


module.exports = devMergeTask