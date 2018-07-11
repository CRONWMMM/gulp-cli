const clean = require('gulp-clean');
const replace = require('gulp-replace');
const merge = require('merge-stream');
const webpack = require('webpack');
const WEBPACK_WATCH_CONFIG = require('../../../webpack.dev.conf.js');
const TASK_CONFIG = require('../../../configs/task.config');
const PATH_CONFIG = require('../../../configs/path.config');
const { devPath, javaScriptPath, runTimePath } = PATH_CONFIG;

function watchJsTask(gulp, browserSync) {
    const reload = browserSync.reload;
    // script 任务
    gulp.task(TASK_CONFIG.RUNTIME_SCRIPT_CLEAN, () => {
        let tasks = [];
        tasks.push(
            gulp.src([`${devPath}${javaScriptPath}`], {read: false})
                .pipe(clean()),

            gulp.src(`${devPath}${runTimePath}**/*.html`)
                .pipe(replace(/<script.*src=["'](\.\.\/|\.\/|\/)[\W\w\s]+["'].*><\/script>/g, ''))
                .pipe(gulp.dest(`${devPath}${runTimePath}`))
        );
        return merge(tasks);
    });
    gulp.task(TASK_CONFIG.RUNTIME_JS, [ TASK_CONFIG.RUNTIME_SCRIPT_CLEAN ], () => {
        webpack(WEBPACK_WATCH_CONFIG, (err, stats) => {
            if (err || stats.hasErrors()) {     // webpack 打包出错信息
                // Handle errors here
                console.log('webpack bundle script errors, information: ', stats.compilation.errors);
            } else if (stats.hasWarnings()) {   // webpack 打包警告信息
                // Handle warnings here
                console.log('webpack bundle script warnings, information: ', stats.compilation.warnings);
            } else {
                // 完成之后将 build 里的模板文件重输出到temp目录，保证两个目录的文件统一
                gulp.src([`${devPath}**/*.html`, `!${devPath}${runTimePath}**/*.html`])
                    .pipe(gulp.dest(`${devPath}${runTimePath}`));
                reload();
            }
        });
    });
}

module.exports = watchJsTask;