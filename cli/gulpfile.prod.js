/**
 * Created by CRONWMMM on 2018/3/29.
 */

/* tasks -------------------------------------------------------------------------------------------------- */
const prodCleanTask = require('./tasks/cleanTask/prodCleanTask');
const prodFontTask = require('./tasks/staticTask/fontTask/prodFontTask');
const prodCssTask = require('./tasks/styleTask/cssTask/prodCssTask');
const prodSassTask = require('./tasks/styleTask/sassTask/prodSassTask');
const prodHtmlTask = require('./tasks/templateTask/htmlTask/prodHtmlTask');
const prodJsTask = require('./tasks/scriptTask/jsTask/prodJsTask');
const prodImgTask = require('./tasks/staticTask/imgTask/prodImgTask');
const prodMergeTask = require('./tasks/mergeTask/prodMergeTask');



/* 生产环境 ------------------------------------------------------------------------------------------------ */
module.exports = gulp => {

    /* clean 任务 */
    prodCleanTask(gulp);
    /* font 任务 */
    prodFontTask(gulp);
    /* css 任务 */
    prodCssTask(gulp);
    /* sass 任务 */
    prodSassTask(gulp);
    /* html 任务 */
    prodHtmlTask(gulp);
    /* js 任务 */
    prodJsTask(gulp);
    /* image 任务 */
    prodImgTask(gulp);
    /* prod 合并任务 */
    prodMergeTask(gulp);

};
