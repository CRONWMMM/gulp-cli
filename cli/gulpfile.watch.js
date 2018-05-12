/**
 * Created by CRONWMMM on 2018/3/30.
 */


/* tasks -------------------------------------------------------------------------------------------------- */
const watchHtmlTask = require('./tasks/templateTask/htmlTask/watchHtmlTask');
const watchSassTask = require('./tasks/styleTask/sassTask/watchSassTask');
const watchJsTask = require('./tasks/scriptTask/jsTask/watchJsTask');
const watchImgTask = require('./tasks/staticTask/imgTask/watchImgTask');


/* watch 文件文件改变执行的分任务 --------------------------------------------------------------------------------------------------------------------------------------------------------- */

module.exports = (gulp, browserSync) => {

    /* html 任务 */
    watchHtmlTask(gulp);
    /* sass 任务 */
    watchSassTask(gulp);
    /* js 任务 */
    watchJsTask(gulp, browserSync);
    /* image 任务 */
    watchImgTask(gulp)

};