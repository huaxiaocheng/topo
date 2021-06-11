# tornorroyv

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

  https://www.runoob.com/vue2/vue-install.html

  import 'babel-polyfill'

  https://www.yuque.com/alsmile/topology

  npm install --save @topology/core html2canvas

  npm install --save @topology/layout

  npm install node-sass sass-loader style-loader --save-dev

  webpack.base.config.js
  rules
  {
    test: /\.scss$/,
    loaders: ["style", "css", "sass"]
  }

  https://blog.csdn.net/cs23405/article/details/109305516

  @import './assets/topology-font/iconfont.css'

  @topology/core@0.3.28 默认取消画布滚动条（改用大家熟悉的缩放移动显示其他区域）

  npm install echarts --save

问题：
1.多选移动导致调整过的连线弧度复原
2.gif的text无法显示 【解决：hideInput双击不显示输入框，右侧属性也不显示】
3.图片按比例缩放会超过选框（@0.3.28不存在）
4.镜像移动导致图表报错（@0.3.28不存在）
5.撤销和重做对prop的影响
6.节点长宽固定，如果更新的数据超过不能自适应
