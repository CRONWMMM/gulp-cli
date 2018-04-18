/**
 * Created by CRONWMMM on 2018/3/29.
 */
const fs = require('fs');
const path = require('path');


/* utils */
/**
 * 获取指定文件架下，子文件夹名称
 * @param dir {String}    需要查找的文件夹名称
 * @returns   {Array}     子文件夹数组
 */
exports.getFolders = dir => {
    return fs.readdirSync(dir).filter(file => {
        return fs.statSync(path.join(dir, file)).isDirectory();
    });
};

/**
 * 绝对路径拼接
 * @param dir  {String}   相对路径字符串
 */
exports.resolve = dir => {
    const OS_TYPE = process.platform
    // 这块要根据操作系统分别处理，暂时没有找到更好方法
    if (OS_TYPE.includes('win')) {
        return path.resolve(__dirname, `../${dir}`).replace(/\\/g, '\\\\')
    } else {
        return path.resolve(__dirname, `../${dir}`)
    }
}