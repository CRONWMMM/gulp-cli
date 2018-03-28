const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 这块也是他妈的一个天坑，path.join编译出来的反斜杠windows下Nodejs根本不识别，要自己再转译
const resolve = dir => path.join(__dirname, '..', dir).replace(/\\/g, '\\\\');
const CONFIG = require('./webpack.config');
const {ENTRY, BUILD} = CONFIG;
const HTML_PLUGINS = (list => list.map(item => new HtmlWebpackPlugin(item)))(BUILD.HTML_PLUGINS);

module.exports = {
	entry: ENTRY,
	output: BUILD.OUTPUT,
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
			'@': resolve('src')
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
    devtool: BUILD.PRODUCTION_SOURCEMAP ? BUILD.DEVTOOL : false,
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery'
		}),
		// keep module.id stable when vender modules does not change
		// vendor不修改的话会默认使用浏览器之前缓存的vendor，webpack不会重新打包生成hash文件
    	new webpack.HashedModuleIdsPlugin(),
    	...HTML_PLUGINS
	],
	optimization: {		// webpack4+相对于3+的版本修改
		runtimeChunk: {
			name: 'manifest'
		},
		splitChunks: {
			cacheGroups: {
	            commons: {
	                test: /[\\/]node_modules[\\/]/,
	                name: "vendor",
	                chunks: "all",
					minChunks: 2	// 公共模块被使用的最小次数。比如配置为3，也就是同一个模块只有被3个以外的页面同时引用时才会被提取出来作为common chunks。
	            }
        	}
		}
	}
};