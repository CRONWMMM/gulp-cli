const path = require('path');
const resolve = dir => path.join(__dirname, dir);

/* webpack配置 */
module.exports = {
	/* 统一JS模块入口 --------------------------------------------------------------------- */
	ENTRY: {
		main: resolve('src/js/index.js')
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
				template: resolve('src/views/index.html'),
				inject: true,
				chunks: ['main','vendor','manifest'],
				// necessary to consistently work with multiple chunks via CommonsChunkPlugin
				chunksSortMode: 'dependency'
			},{
				filename: path.resolve('build/views/login.html'),
				inject: true,
				chunks: ['']
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
				// 这块暂时没办法在同一个文件夹中更改并生成文件，只能先弄个temp文件夹承接，用完再删除
				template: resolve('temp/views/index.html'),
				inject: true,
				chunks: ['main','vendor','manifest'],
				// necessary to consistently work with multiple chunks via CommonsChunkPlugin
				chunksSortMode: 'dependency'
			},{
				filename: path.resolve('dist/views/login.html'),
				inject: true,
				chunks: ['']
			}
		]
	},
};