const path = require('path');
const svgSpriteDirs = [
  require.resolve('antd-mobile').replace(/warn\.js$/, ''), // antd-mobile 内置svg
  // require.resolve('antd').replace(/warn\.js$/, ''), // antd 内置svg
  // path.resolve(__dirname, 'src/my-project-svg-foler'),  // 业务代码本地私有 svg 存放目录
];
export default {
  // 阿当比鸡
  "entry": "src/index.js",
  "publicPath": "/generalManage/adangbiji/",
  "outputPath": "./dist",
  // // 博饼
  // "entry": "src/bobing.js",
  // "publicPath": "/generalManage/bobing/",
  // "outputPath": "./bobing",

  "env": {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr",
        "transform-runtime"
      ]
    },
    "production": {
      "extraBabelPlugins": [
        "transform-runtime"
      ]
    }
  },
  "extraBabelPlugins": [
    ["module-resolver", {
      "root": ["./src"],
      "alias": {
        "@": "./src"
      }
    }],
    ["import", { "libraryName": "antd-mobile", "libraryDirectory": "lib", "style": "css" }]
  ],
  "extraPostCSSPlugins": [],
  "autoprefixer": {
    "browsers": [
      "iOS >= 8", "Android >= 4"
    ]
  },
  "resolve": {
    //自行补全路径中文件的后缀, 第一个是空字符串，对应不需要后缀的情况
      "extensions": ['', '.webpack.js', '.web.js', '.js', '.jsx']
  },
  // "proxy": null,
  "svgSpriteLoaderDirs": svgSpriteDirs,
  // "externals": null,
  // "library": null,
  // "libraryTarget": "var",
  // "multipage": false,
  // "define": null,
  // "theme": null
}
