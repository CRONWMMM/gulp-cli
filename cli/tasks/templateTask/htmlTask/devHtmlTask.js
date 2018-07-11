const sass = require('gulp-sass');
const merge = require('merge-stream');
const replace = require('gulp-replace');
const TASK_CONFIG = require('../../../configs/task.config');
const PATH_CONFIG = require('../../../configs/path.config');
const { srcPath, templatePath, devPath, styleOutPutPath, staticPath, runTimePath } = PATH_CONFIG


function devHtmlTask(gulp) {
    /* html 任务 */
    gulp.task(TASK_CONFIG.DEV_HTML, [TASK_CONFIG.DEV_SASS], () => {
        return gulp.src(`${srcPath}${templatePath}**/*.html`)
            .pipe(replace(/(<link\s+rel="stylesheet"\s+href=")([\w-]+\.css)(">)/g, `$1../${styleOutPutPath}$2$3`))
            .pipe(replace(/(src=")([\w-]+\.)(jpg|jpeg|png|svg|gif|JPG|JPEG|PNG|SVG|GIF)(")/g, `$1../${staticPath}$2$3$4`))
            .pipe(gulp.dest(`${devPath}${runTimePath}${templatePath}`));
    });
}


module.exports = devHtmlTask