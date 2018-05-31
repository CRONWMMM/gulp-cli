const TASK_CONFIG = require('../../../configs/task.config');
const PATH_CONFIG = require('../../../configs/path.config');
const { srcPath, fontsPath, staticPath, devPath } = PATH_CONFIG

function devFontTask(gulp) {
    /* fonts 任务 */
    gulp.task(TASK_CONFIG.DEV.FONTS.MAIN, [TASK_CONFIG.DEV.CLEAN.MAIN], () => {
        return gulp.src(`${srcPath}${fontsPath}**/*`)
            .pipe(gulp.dest(`${devPath}${staticPath}`));
    })
}

module.exports = devFontTask