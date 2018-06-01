const revCollector = require('gulp-rev-collector');
const replace = require('gulp-replace');
const TASK_CONFIG = require('../../../configs/task.config');
const PATH_CONFIG = require('../../../configs/path.config');
const { srcPath, stylePath, imagesPath, revPath, runTimePath } = PATH_CONFIG;

function prodHtmlTask(gulp) {
    /* html 任务 */
    // 通过样式映射表修改html文件上引用的css文件路径
    gulp.task(TASK_CONFIG.BUILD_HTML, [TASK_CONFIG.BUILD_SASS], () => {
        return gulp.src([`${revPath.root}**/*.json`, `${srcPath}**/*.html`])
            .pipe(revCollector())   // 替换静态资源MD5文件名
            // 替换link文件的href引用地址
            .pipe(replace(/(<link\s+rel="stylesheet"\s+href=")([\w-]+\.css)(">)/g, `$1../${stylePath.outputFolder}/$2$3`))
            // 替换除了script文件的其他src资源引用地址
            // 图片资源
            .pipe(replace(/(src=")([\w-]+\.)(jpg|jpeg|png|svg|gif|JPG|JPEG|PNG|SVG|GIF)(")/g, `$1../${imagesPath}$2$3$4`))
            // 视音频资源后面再加
            .pipe(gulp.dest(`${runTimePath.build}`));    // 将替换后的html文件装填到新目录
    });
}


module.exports = prodHtmlTask;