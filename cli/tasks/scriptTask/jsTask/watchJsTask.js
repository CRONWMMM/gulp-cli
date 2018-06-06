const clean = require('gulp-clean');
const replace = require('gulp-replace');
const webpack = require('webpack');
const WEBPACK_WATCH_CONFIG = require('../../../webpack.dev.conf.js');
const TASK_CONFIG = require('../../../configs/task.config');
const PATH_CONFIG = require('../../../configs/path.config');
const { devPath, scriptPath, runTimePath } = PATH_CONFIG;

function watchJsTask(gulp, browserSync) {
    const reload = browserSync.reload;
    // script 任务
    gulp.task(TASK_CONFIG.RUNTIME_SCRIPT_CLEAN, () => {
        let tasks = [];
        tasks.push(
            gulp.src([`${devPath}${scriptPath.root}`], {read: false})
                .pipe(clean()),

            gulp.src(`${runTimePath.dev}**/*.html`)
                .pipe(replace(/<script.*src=["'](\.\.\/|\.\/|\/)[\W\w\s]+["'].*><\/script>/g, ''))
                .pipe(gulp.dest(`${runTimePath.dev}`))
        );
        return merge(tasks);
    });
    gulp.task(TASK_CONFIG.RUNTIME_JS, [ TASK_CONFIG.RUNTIME_SCRIPT_CLEAN ], () => {
        webpack(WEBPACK_WATCH_CONFIG, (err, stats) => {
            if (err != null) console.log('webpack bundle script error, information: ', err);
            // 完成之后将 build 里的模板文件重输出到temp目录，保证两个目录的文件统一
            gulp.src([`${devPath}**/*.html`, `!${runTimePath.dev}**/*.html`])
                .pipe(gulp.dest(`${runTimePath.dev}`));
            reload();
        });
    });
}


module.exports = watchJsTask;