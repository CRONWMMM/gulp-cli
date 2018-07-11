/**
 * Created by CRONWMMM on 2018/3/29.
 */
const fs = require('fs');
const path = require('path');


/* utils */
/**
 * 获取指定文件架下，子文件夹名称
 * @param dir {String}    需要查找的文件夹名称
 * @returns   {Array}     子文件夹数组, 例如 [ 'dir1', 'dir2' ]
 */
function getFolders(dir) {
    return fs.readdirSync(dir).filter(file => {
        return fs.statSync(path.join(dir, file)).isDirectory();
    });
};

/**
 * 绝对路径拼接
 * @param dirList  {Array}   相对路径字符串组成的数组
 */
function resolve(...dirList) {
    const OS_TYPE = process.platform
    // 这块要根据操作系统分别处理，暂时没有找到更好方法
    if (OS_TYPE.includes('win')) {
        return path.resolve(__dirname, '../', ...dirList).replace(/\\/g, '\\\\')
    } else {
        return path.resolve(__dirname, '../', ...dirList)
    }
}

/**
 * 文件深度查找（支持文件夹嵌套）
 * @param folder  { String }    文件夹字符串
 * @param cb      { callback }  每深入一层文件夹执行的回调函数，该回调函数接收当前的dir 路径作为参数
 */
function deeplySearchInFolders(folder, cb) {
    let folderList = getFolders(folder)
    // 如果 static/images/ 下还有文件夹，继续探，并将下面的文件抽出来
    cb && cb(folder)
    folderList.forEach(item => {
        let dir = _normalizeDir(folder) + item
        deeplySearchInFolders(dir, cb)
    })
}

function _normalizeDir(dir) {
    let lastStr = dir[dir.length - 1]
    if (lastStr !== '/') dir += '/'
    return dir
}

module.exports = { getFolders, resolve, deeplySearchInFolders }