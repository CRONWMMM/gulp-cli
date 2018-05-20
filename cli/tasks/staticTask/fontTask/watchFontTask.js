const clean = require('gulp-clean');
const merge = require('merge-stream');
const { PATH_CONFIG, TASK } = require('../../../gulpfile.config');
const { srcPath, fontsPath, staticPath, devPath } = PATH_CONFIG

function watchFontTask(gulp) {
    /* fonts 任务 */
    gulp.task(TASK.DEV.RUNTIME_FONTS, () => {
        let tasks = [];
        tasks.push(
            gulp.src([`${devPath}${fontsPath}**/*`], {read: false})
                .pipe(clean()),
            gulp.src(`${srcPath}${fontsPath}**/*`)
                .pipe(gulp.dest(`${devPath}${staticPath}`))
        );
    return merge(tasks);
    })
}

module.exports = watchFontTask