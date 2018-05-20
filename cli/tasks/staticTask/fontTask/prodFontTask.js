const { PATH_CONFIG, TASK } = require('../../../gulpfile.config');
const { srcPath, fontsPath, staticPath, prodPath } = PATH_CONFIG

function prodFontTask(gulp) {
    /* fonts 任务 */
    gulp.task(TASK.BUILD.FONTS.MAIN, [TASK.BUILD.CLEAN.ALL], () => {
        return gulp.src(`${srcPath}${fontsPath}**/*`)
            .pipe(gulp.dest(`${prodPath}${staticPath}`));
    })
}

module.exports = prodFontTask