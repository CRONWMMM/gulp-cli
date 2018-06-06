const cheerio = require('gulp-cheerio');
const changed = require('gulp-changed');
const replace = require('gulp-replace');
const merge = require('merge-stream');
const TASK_CONFIG = require('../../../configs/task.config');
const PATH_CONFIG = require('../../../configs/path.config');
const { srcPath, devPath, stylePath, imagesPath, runTimePath } = PATH_CONFIG;

function prodHtmlTask(gulp) {
    // html 任务
    gulp.task(TASK_CONFIG.RUNTIME_HTML, () => {
        let tasks = [],
            scriptSrcList = [];
        tasks.push(
            gulp.src(`${runTimePath.dev}**/*.html`)
                .pipe(cheerio({
                    run($, file, done) {
                        scriptSrcList = [];
                        $('script').each(function() {
                            let $script = $(this),
                                reg = /^(\.\/|\.\.\/|\/)[\W\w\s]+$/g,
                                src = $script.attr('src');
                            if (reg.test(src)) scriptSrcList.push(src);
                        });
                        done()
                    },
                    parserOptions: {
                        decodeEntities: false
                    }
                })),

            gulp.src(`${srcPath}**/*.html`)
                .pipe(changed(`${devPath}`))
                .pipe(cheerio({
                    run($, file, done) {
                        let $body = $('body');
                        scriptSrcList.forEach(item => {
                            $body.append(`<script type="text/javascript" src="${item}"></script>`);
                        });
                        scriptSrcList = [];
                        done()
                    },
                    parserOptions: {
                        // 不加这个cheerio会转换html实体
                        decodeEntities: false
                    }
                }))
                .pipe(replace(/(<link\s+rel="stylesheet"\s+href=")([\w-]+\.css)(">)/g, `$1../${stylePath.outputFolder}/$2$3`))
                .pipe(replace(/(src=")([\w-]+\.)(jpg|jpeg|png|svg|gif|JPG|JPEG|PNG|SVG|GIF)(")/g, `$1../${imagesPath}$2$3$4`))
                .pipe(gulp.dest(`${devPath}`))
        );
        return merge(tasks);
    });
    // 模板文件同步
    gulp.task(TASK_CONFIG.RUNTIME_FILE_SYNC, [TASK_CONFIG.RUNTIME_HTML], () => {
        gulp.src([`${devPath}**/*.html`, `!${runTimePath.dev}**/*.html`])
            .pipe(gulp.dest(`${runTimePath.dev}`));
    });
}


module.exports = prodHtmlTask;