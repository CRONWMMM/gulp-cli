const TASK_CONFIG = require('../../../configs/task.config');
const PATH_CONFIG = require('../../../configs/path.config');
const { srcPath, fontsPath, staticPath, prodPath } = PATH_CONFIG

function prodFontTask(gulp) {
    /* fonts 任务 */
    gulp.task(TASK_CONFIG.BUILD_FONTS, [TASK_CONFIG.BUILD_CLEAN], () => {
        return gulp.src(`${srcPath}${fontsPath}**/*`)
            .pipe(gulp.dest(`${prodPath}${staticPath}`));
    })
}

module.exports = prodFontTask