const path = require('path');
const resolve = dir => path.join(__dirname, dir);

/* webpack配置 */
module.exports = {
    /* 统一JS模块入口 --------------------------------------------------------------------- */
    ENTRY: {
        main: resolve('src/js/index.js'),
        login: resolve('src/js/login.js')
    },

    /* 开发环境 --------------------------------------------------------------------------- */
    DEV: {
        OUTPUT: {
            path: resolve('build/js'),
            filename: '[name].[chunkhash].js'
        },
        HTML_PLUGINS: [		// webpack的HtmlWebpackPlugin实例数组，对应每个页面文件
            {
                filename: resolve('build/views/index.html'),
                // 没有template的话，webpack会自动生成一份新的html文件
                template: resolve('temp-dev/views/index.html'),
                inject: true,
                chunks: ['main','vendor','manifest'],
                // necessary to consistently work with multiple chunks via CommonsChunkPlugin
                chunksSortMode: 'dependency'
            },{
                filename: path.resolve('build/views/login.html'),
                template: resolve('temp-dev/views/login.html'),
                inject: true,
                chunks: ['login', 'vendor', 'manifest']
            }
        ]
    },


    /* 生产环境 --------------------------------------------------------------------------- */
    BUILD: {
        OUTPUT: {
            path: resolve('dist/js'),
            filename: '[name].[chunkhash].js'
        },
        HTML_PLUGINS: [		// webpack的HtmlWebpackPlugin实例数组，对应每个页面文件
            {
                filename: resolve('dist/views/index.html'),
                // 没有template的话，webpack会自动生成一份新的html文件
                template: resolve('temp-build/views/index.html'),
                inject: true,
                chunks: ['main','vendor','manifest'],
                // necessary to consistently work with multiple chunks via CommonsChunkPlugin
                chunksSortMode: 'dependency'
            },{
                filename: path.resolve('dist/views/login.html'),
                template: resolve('temp-build/views/login.html'),
                inject: true,
                chunks: ['login','vendor','manifest']
            }
        ]
    },
};