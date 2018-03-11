const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
	entry: {
		main: './src/js/index.js'
	},
	output: {
		path: path.resolve(__dirname, 'build/js'),
		filename: '[name].[chunkhash].js'
	},
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
			'@': resolve('src'),
			// 'common': resolve('src/common'),
			// 'components': resolve('src/components'),
			// 'api': resolve('src/api'),
			// 'base': resolve('src/base')
		}
	},
	module: {
		rules: [
			{
				test: /\.js$/,
        		use: 'babel-loader',
        		include: [resolve('src')]
			}
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery'
		}),
		// keep module.id stable when vender modules does not change
		// vendor不修改的话会默认使用浏览器之前缓存的vendor，webpack不会重新打包生成hash文件
    	new webpack.HashedModuleIdsPlugin(),
		new HtmlWebpackPlugin({
			filename: path.resolve(__dirname, 'build/views/index.html'),
			template: './src/views/index.html',		// 没有template的话，webpack会自动生成一份新的html文件
			inject: true,
			chunks: ['main','vendor','manifest'],
			// necessary to consistently work with multiple chunks via CommonsChunkPlugin
     	 	chunksSortMode: 'dependency'
		}),
		new HtmlWebpackPlugin({
			filename: path.resolve(__dirname, 'build/views/login.html'),
			inject: true,
			chunks: ['']
		})
	],
	optimization: {
		runtimeChunk: {
			name: 'manifest'
		},
		splitChunks: {
			cacheGroups: {
	            commons: {
	                test: /[\\/]node_modules[\\/]/,
	                name: "vendor",
	                chunks: "all"
	            }
        	}
		}
	}
};