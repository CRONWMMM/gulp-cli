const { PATH_CONFIG, TASK } = require('../../../gulpfile.config');
const { srcPath, fontsPath, staticPath, devPath } = PATH_CONFIG

function devFontTask(gulp) {
    /* fonts 任务 */
    gulp.task(TASK.DEV.FONTS.MAIN, [TASK.DEV.CLEAN.ALL], () => {
        return gulp.src(`${srcPath}${fontsPath}**/*`)
            .pipe(gulp.dest(`${devPath}${staticPath}`));
    })
}

module.exports = devFontTask