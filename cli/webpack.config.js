const { resolve } = require('./utils');
const PATH_CONFIG = require('./configs/path.config');
const { srcPath, devPath, prodPath, javaScriptPath, runTimePath, templatePath } = PATH_CONFIG;


/* webpack配置 */
module.exports = {
	/* 统一JS模块入口 --------------------------------------------------------------------- */
	ENTRY: {
        main: resolve(`${srcPath}${javaScriptPath}` + 'index.js'),
        login: resolve(`${srcPath}${javaScriptPath}` + 'login.js')
	},

	/* 开发环境 --------------------------------------------------------------------------- */
	DEV: {
		OUTPUT: {
			// path: resolve('build/js'),
            path: resolve(`${devPath}${javaScriptPath}`),
			filename: '[name].[chunkhash].js'
		},
		HTML_PLUGINS: [		// webpack的HtmlWebpackPlugin实例数组，对应每个页面文件
			{
                filename: resolve(`${devPath}${templatePath}` + 'index.html'),
				// 没有template的话，webpack会自动生成一份新的html文件
                template: resolve(`${devPath}${runTimePath}${templatePath}` + 'index.html'),
				inject: true,
				chunks: ['main','vendor','manifest'],
				// necessary to consistently work with multiple chunks via CommonsChunkPlugin
				chunksSortMode: 'dependency'
			},{
                filename: resolve(`${devPath}${templatePath}` + 'login.html'),
                template: resolve(`${devPath}${runTimePath}${templatePath}` + 'login.html'),
				inject: true,
				chunks: ['login', 'vendor', 'manifest']
			}
		],
        /**
         * Source Maps
         */
        // https://webpack.js.org/configuration/devtool/#development
        DEVTOOL: 'eval-source-map',
	},


	/* 生产环境 --------------------------------------------------------------------------- */
	BUILD: {
		OUTPUT: {
            path: resolve(`${prodPath}${javaScriptPath}`),
			filename: '[name].[chunkhash].js'
		},
		// 其中external配置表示我们的模块中的 require(‘jquery’) 中的 jquery 来自于 window.jQuery
		// 而不要单独打包到我们的入口文件的bundle中，在页面中我们通过script标签来引入【cdn】
        externals: {
            jquery: 'jQuery'
        },
		HTML_PLUGINS: [		// webpack的HtmlWebpackPlugin实例数组，对应每个页面文件
			{
                filename: resolve(`${prodPath}${templatePath}` + 'index.html'),
				// 没有template的话，webpack会自动生成一份新的html文件
                template: resolve(`${prodPath}${runTimePath}${templatePath}` + 'index.html'),
				inject: true,
				chunks: ['main','vendor','manifest'],
				// necessary to consistently work with multiple chunks via CommonsChunkPlugin
				chunksSortMode: 'dependency'
			},{
                filename: resolve(`${prodPath}${templatePath}` + 'login.html'),
                template: resolve(`${prodPath}${runTimePath}${templatePath}` + 'login.html'),
				inject: true,
                chunks: ['login','vendor','manifest']
			}
		],
        /**
         * Source Maps
         */
		// productionSourceMap 字段开启，生产环境下也能打开 sourceMap 映射，不过推荐是 false，讲道理线上环境不应该能看到源码
		PRODUCTION_SOURCEMAP: false,
        // https://webpack.js.org/configuration/devtool/#production
        DEVTOOL: '#source-map',
	},
};