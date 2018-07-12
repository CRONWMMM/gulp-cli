/**
 * Created by CRONWMMM on 2018/3/30.
 */


/* tasks -------------------------------------------------------------------------------------------------- */
const watchHtmlTask = require('./tasks/templateTask/htmlTask/watchHtmlTask');
const watchSassTask = require('./tasks/styleTask/sassTask/watchSassTask');
const watchCssTask = require('./tasks/styleTask/cssTask/watchCssTask');
const watchJsTask = require('./tasks/scriptTask/jsTask/watchJsTask');
const watchImgTask = require('./tasks/staticTask/imgTask/watchImgTask');
const watchFontTask = require('./tasks/staticTask/fontTask/watchFontTask');


/* watch 文件文件改变执行的分任务 --------------------------------------------------------------------------------------------------------------------------------------------------------- */

module.exports = (gulp, browserSync) => {

    /* html 任务 */
    watchHtmlTask(gulp);
    /* css 任务 */
    watchCssTask(gulp);
    /* sass 任务 */
    watchSassTask(gulp);
    /* js 任务 */
    watchJsTask(gulp, browserSync);
    /* image 任务 */
    watchImgTask(gulp)
    /* fonts 任务 */
    watchFontTask(gulp)

};