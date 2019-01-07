var path = require('path')
// var service='http://47.107.100.26/wkrent-web';
var service='http://101.132.76.68/wkrent-web';

module.exports = {
	build: {
		env: require('./prod.env'),
		index: path.resolve(__dirname, '../dist/index.html'),
		assetsRoot: path.resolve(__dirname, '../dist'),
		assetsSubDirectory: 'static',
		assetsPublicPath: './',
		productionSourceMap: false,
		// Gzip off by default as many popular static hosts such as
		// Surge or Netlify already gzip all static assets for you.
		// Before setting to `true`, make sure to:
		// npm install --save-dev compression-webpack-plugin
		productionGzip: false,
		productionGzipExtensions: ['js', 'css'],
		// Run the build command with an extra argument to
		// View the bundle analyzer report after build finishes:
		// `npm run build --report`
		// Set to `true` or `false` to always turn it on or off
		bundleAnalyzerReport: process.env.npm_config_report
	},
	dev: {
		env: require('./dev.env'),
		port: 9000,
		autoOpenBrowser: true,
		assetsSubDirectory: 'static',
		assetsPublicPath: '/',
		proxyTable: {
			//后台账户（平台账号接口）
			'/bgUser': {
				target: service +'/bgUser/',
				changeOrigin: true,
				pathRewrite: {
					'^/bgUser': '/'
				}
			},
			//  商家接口
			'/merchant': {
				target: service +'/merchant/',
				changeOrigin: true,
				pathRewrite: {
					'^/merchant': '/'
				}
			},
			//  房源接口
			'/room': {
				target: service +'/room/',
				changeOrigin: true,
				pathRewrite: {
					'^/room': '/'
				}
			},
			//  数据字典-房屋性质
			'/houseProperty': {
				target: service +'/houseProperty/',
				changeOrigin: true,
				pathRewrite: {
					'^/houseProperty': '/'
				}
			},
			//  数据字典-房屋类型
			'/houseType': {
				target: service +'/houseType/',
				changeOrigin: true,
				pathRewrite: {
					'^/houseType': '/'
				}
			},
			//  数据字典-房源标签
			'/houseLabel': {
				target: service +'/houseLabel/',
				changeOrigin: true,
				pathRewrite: {
					'^/houseLabel': '/'
				}
			},
			// 模块设置
			'/moduleSetting': {
				target: service +'/moduleSetting/',
				changeOrigin: true,
				pathRewrite: {
					'^/moduleSetting': '/'
				}
			},
			//  系统接口
			'/system': {
				target: service +'/system/',
				changeOrigin: true,
				pathRewrite: {
					'^/system': '/'
				}
			},
			//  菜单接口
			'/bgMenu': {
				target: service +'/bgMenu/',
				changeOrigin: true,
				pathRewrite: {
					'^/bgMenu': '/'
				}
			},
			//  角色接口
			'/bgRole': {
				target: service +'/bgRole/',
				changeOrigin: true,
				pathRewrite: {
					'^/bgRole': '/'
				}
			},
			//获取文件流
			'/attach': {
				target: service +'/attach/',
				changeOrigin: true,
				pathRewrite: {
					'^/attach': '/'
				}
			},
			//获取国家
			'/area': {
				target: service +'/area/',
				changeOrigin: true,
				pathRewrite: {
					'^/area': '/'
				}
			},
			//用户管理
			'/appUser': {
				target: service +'/appUser/',
				changeOrigin: true,
				pathRewrite: {
					'^/appUser': '/'
				}
			},
			//预约订单管理
			'/order': {
				target: service +'/order/',
				changeOrigin: true,
				pathRewrite: {
					'^/order': '/'
				}
			},
			//用户反馈
			'/feedBack': {
				target: service +'/feedBack/',
				changeOrigin: true,
				pathRewrite: {
					'^/feedBack': '/'
				}
			},
			// 获取权限树
			'/bgMenu':{
				target: service +'/bgMenu/',
				changeOrigin: true,
				pathRewrite: {
					'^/bgMenu': '/'
				}
			},
		}
	}, 
	// CSS Sourcemaps off by default because relative paths are "buggy"
	// with this option, according to the CSS-Loader README
	// (https://github.com/webpack/css-loader#sourcemaps)
	// In our experience, they generally work as expected,
	// just be aware of this issue when enabling this option.
	cssSourceMap: false
};