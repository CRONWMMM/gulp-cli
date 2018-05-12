/**
 * Created by CRONWMMM on 2018/3/29.
 */


/* tasks -------------------------------------------------------------------------------------------------- */
const devCleanTask = require('./tasks/cleanTask/devCleanTask');
const devFontTask = require('./tasks/staticTask/fontTask/devFontTask');
const devCssTask = require('./tasks/styleTask/cssTask/devCssTask');
const devSassTask = require('./tasks/styleTask/sassTask/devSassTask');
const devHtmlTask = require('./tasks/templateTask/htmlTask/devHtmlTask');
const devJsTask = require('./tasks/scriptTask/jsTask/devJsTask');
const devImgTask = require('./tasks/staticTask/imgTask/devImgTask');
const devMergeTask = require('./tasks/mergeTask/devMergeTask');
const serverTask = require('./tasks/serverTask');


/* 开发环境 (初始 npm run dev) ------------------------------------------------------------------------------- */

module.exports = (gulp, browserSync) => {

    /* clean 任务 */
    devCleanTask(gulp);
    /* font 任务 */
    devFontTask(gulp);
    /* css 任务 */
    devCssTask(gulp);
    /* sass 任务 */
    devSassTask(gulp);
    /* html 任务 */
    devHtmlTask(gulp);
    /* JS 任务 */
    devJsTask(gulp);
    /* img 任务 */
    devImgTask(gulp);
    /* dev 合并任务 */
    devMergeTask(gulp);
    /* server 启动任务 */
    serverTask(gulp, browserSync);

};