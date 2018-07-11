const flatten = require('gulp-flatten');
const TASK_CONFIG = require('../../../configs/task.config');
const PATH_CONFIG = require('../../../configs/path.config');
const { srcPath, fontsPath, staticPath, devPath } = PATH_CONFIG

function watchFontTask(gulp) {
    /* fonts 任务 */
    gulp.task(TASK_CONFIG.RUNTIME_FONTS, () => {
        return gulp.src(`${srcPath}${fontsPath}**/*`)
                    .pipe(flatten())
                    .pipe(gulp.dest(`${devPath}${staticPath}`))
    })
}

module.exports = watchFontTask