module.exports = {
    /* Basic file path start */
    serverPath: 'server/server.js',                         // 服务器文件路径
    libPath: '',                                            // 依赖库路径
    srcPath: 'src/',                                        // 源码路径
    devPath: 'build/',                                      // 开发环境
    prodPath: 'dist/',                                      // 生产环境
    /* Basic file path end */

    /* Static file path start */
    staticPath: 'static/',                                  // 静态资源路径
    imagesPath: 'static/',                                  // 图片路径
    fontsPath: 'static/',                                   // 字体文件路径
    /* Static file path end */

    /* Template file path start */
    templatePath: 'views/',                                 // 模板文件路径
    /* Template file path end */

    /* Style file path start */
    stylePath: 'style/',                                    // 样式文件根路径
    cssPath: 'style/css/',                                  // css 文件路径
    sassPath: 'style/sass/',                                // sass 文件路径
    styleOutPutPath: 'css/',                                // 样式文件输出文件夹
    /* Style file path end */

    /* JavaScript file path start */
    javaScriptPath: 'js/',                                  // JavaScript 文件路径
    /* JavaScript file path end */

    /* RunTime file path start */
    runTimePath: 'runtime/',
    /* RunTime file path end */

    revPath: 'rev/',                                        // 随机文件名后生成的映射JSON地址，代表根路径开始的绝对路径（不使用随机文件名的情况下改配置不生效）

};