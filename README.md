# 微前端技术学习

### 一、简介

#### 1. 什么是微前端

> 官网定义： Techniques, strategies and recipes for building a modern web app with multiple teams that can ship features independently.

微前端是构建一个现代 Web 应用所需要的`技术、策略和方法`，并具备多个团队`独立开发`、`部署`的特性。 

#### 2. 为什么使用微前端

1) 拆分巨型应用，使应用方便迭代更新

2) 不同技术团队，不同技术栈项目整合

> 所有大型系统都将从有序变为无序，如果不是，那一定是因为这个系统使用的技术栈更新的不够快，参与系统开发的工程师不够多，产品迭代的时间不够长

#### 3. 微前端特点

1) 项目独立应用部署、避免修改一个部分就需要重新构建、发布

2) 增量迁移、团队自治、松耦合代码

### 二、技术方案

目前主流的有三种技术方案

**模块化**：通过约定进行互调，应用之间是平等的，不存在相互管理的模式。设计难度大，不方便实施。

**基座模式**：通过搭建基座、配置中心来管理子应用。如基于`Single Spa`的偏通用的`qiankun`方案，也有基于本身团队业务量身定制的方案。

**去中心模式**：脱离基座模式，每个应用之间都可以彼此分享资源。如基于`Webpack 5 Module Federation`实现的EMP微前端方案，可以实现多个应用彼此共享资源分享。（这种方案学习成本有点高，不过前景很好）

> 为什么不使用iframe ?
> 路由跳转、页面刷新会导致嵌套的iframe状态丢失

### 三、实战

#### system.js

`system.js`的模块化，在微前端架构中，微应用被打包为模块，但浏览器不支持模块化，需要使用 `system.js` 实现浏览器中的模块化。

这其中主要就是`webpack`进行配置，`libraryTarget: "system"`，将`react、react-dom、react-router-dom`打包后排除，引用`system.js`,使用`system.import()`进行引入，和single-spa其实相差不多，但是其实是不同的，

**SystemJS 的好处和优势有且仅有一点：那就是在浏览器里使用 ES6 的 import/export。**

```javascript
// 文件：webpack.config.js

const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
module.exports = {
  mode: "development",
  entry: "./src/index.js", // 入口
  output: { // 出口
    // 打包目录及文件
    path: path.join(__dirname, "build"), 
    filename: "index.js",
    // 指定构建时所需要的库
    libraryTarget: "system"
  },
  devtool: "source-map",
  // 服务器运行配置
  devServer: {
    port: 9000, // 端口
    // 静态资源文件夹
    contentBase: path.join(__dirname, "build"),
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            // 对应语法转换
            presets: ["@babel/preset-env", "@babel/react"]
          }
        }
      }
    ]
  },
  plugins: [ // 插件
    new HtmlWebpackPlugin({
      /* 打包时，不需要自动引入JS文件(<script> 标签) */
      inject: false, 
      /* 使用微前端的方式，我们需要自己加载对应的 JS 文件 */ 
 
      template: "./src/index.html"
    })
  ],
  // 添加打包排除选项，微前端中需要使用公共的 React ,打包是不需要的
  externals: ["react", "react-dom", "react-router-dom"]
}
```

```javascript
// 文件： src/index.html

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>systemjs-react</title>
    <!-- 按照 systemjs 模块化的方式引入React框架应用 -->
    <script type="systemjs-importmap">
      {
        "imports": {
          "react": "https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js",
          "react-dom": "https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js",
          "react-router-dom": "https://cdn.jsdelivr.net/npm/react-router-dom@5.2.0/umd/react-router-dom.min.js"
        }
      }
    </script>
    <!--  systemjs 库 -->
    <script src="https://cdn.jsdelivr.net/npm/systemjs@6.8.0/dist/system.min.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script>
      // 按照 systemp 的方式，引入具体应用
      System.import("./index.js")
    </script>
  </body>
</html>
```

**现在目前主流的方案就是基座模式，各种技术大部分基于这种方法去实现封装等等，所以着重查看一下这里**

#### single-spa（整体思路）

##### 1. 流程

**主项目**

通过single-spa进行注册、然后启动

**子项目**

导出三个生命周期，通过window.singleSpaNavigate判断直接启动还是基座启动

##### 2. single-spa脚手架

single-spa有脚手架工具，脚手架对于从0开始的项目，已有项目可以按照逻辑进行修改，后面我会实现

​	有三种类型的微前端应用：

```
1. single-spa-application / parcel：微前端架构中的微应用，可以使用 vue、react、angular 等框架。
2. single-spa root config：创建微前端容器应用。
3. utility modules：公共模块应用，非渲染组件，用于跨应用共享 javascript 逻辑的微应用。
```

安装脚手架:  `npm install create-single-spa@2.0.3 -g`

创建微前端容器应用: `create-single-spa` // 安装时按照子应用、容器、公共模块选择

**容器**

```javascript
//文件： src/xx-root-config.js
import { registerApplication, start } from "single-spa"; // 注册、开始

// React -- todos 
registerApplication({
  name: "@study/todos",
  app: () => System.import("@study/todos"),
  activeWhen: ["/todos"]
});
start({
  // 是否可以通过 history.pushState() 和 history.replaceState() 更改触发 single-spa 路由 true 不允许 false 允许
  urlRerouteOnly: true,
});

// 文件： index.ejs

<script type="systemjs-importmap">
    {
    	"imports": { // 这里可以将公有的模块进行导出
            "single-spa": "https://cdn.jsdelivr.net/npm/single-spa@5.9.0/lib/system/single-spa.min.js",
            "react": "https://cdn.jsdelivr.net/npm/react@17.0.1/umd/react.production.min.js",
        	"react-dom": "https://cdn.jsdelivr.net/npm/react-dom@17.0.1/umd/react-dom.production.min.js",
    	}
	}
</script>
...
<!-- JavaScript 模块下载地址 此处可放置微前端项目中的公共模块 -->
  <% if (isLocal) { %>
  <script type="systemjs-importmap">
    {
      "imports": {
        "@xl/root-config": "//localhost:9000/xl-root-config.js",
        "@study/todos": "//localhost:9002/study-todos.js" // 这里注册应用
      }
    }
  </script>
  <% } %>
...
<body>
  <main></main>
  <h2>
    <!-- 指定应用展示位置 -->
    <div id="myreact"></div>
  </h2>
  <!-- 导入微前端容器应用 -->
  <script>
    System.import('@xl/root-config');
  </script>
</body>

```

**子应用**

```javascript
// package.json 修改启动端口
子应用目标就是导出生命周期
// 文件： src\study-todos.js
import React from "react";
import ReactDOM from "react-dom";
// single-spa-react 用于创建使用 React 框架实现的微前端应用
import singleSpaReact from "single-spa-react";
// 用于渲染在页面中的根组件 就相当于传统React应用的App.js文件
import Root from "./root.component";
 
 
const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  // 渲染根组件
  rootComponent: Root,
  // 错误边界函数
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    // return null;
    return ()=> <div>发生错误时此处内容将会被渲染</div>
  },
  // 指定根组件的渲染位置
  domElementGetter:()=>document.getElementById('myreact')
});
 
// 暴露必要的生命周期函数
export const { bootstrap, mount, unmount } = lifecycles;

// 文件：webpack.config.js
return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    externals: ["react-router-dom"]
});
```

##### 3. single-spa已有项目改造

其实已有项目主要流程和脚手架是一样的，我在这里详细描绘一下流程

**构建子应用**

1) 子应用安装`npm install single-spa-vue || npm install single-spa-react`

2) 在项目挂载的地方导出生命周期`bootstrap、mount、unmount`，并且通过`window.singleSpaNavigate`判断是独立启动还是在基座中

```javascript
// 在非子应用中正常挂载应用
if(!window.singleSpaNavigate){
    delete appOptions.el;
    new Vue(appOptions).$mount('#app');
}
const vueLifeCycle = singleSpaVue({
    Vue,
    appOptions
});
// 子应用必须导出 以下生命周期 bootstrap、mount、unmount
export const bootstrap = vueLifeCycle.bootstrap;
export const mount = vueLifeCycle.mount;
export const unmount = vueLifeCycle.unmount;
export default vueLifeCycle;
const router = new VueRouter({
    mode: 'history',
    base: '/vue',
    routes
})
```

3) 配置库打包

```javascript
module.exports = {
    configureWebpack: {
        output: {
            library: 'singleVue',
            libraryTarget: 'umd'
        },
        devServer:{
            port:10000
        }
    }
}
```

**构建基座**

1） 主项目路由跳转, 子应用默认上面vue项目

```
<div id="nav">
    <router-link to="/vue">vue项目</router-link>
    <div id="vue"></div> // 子应用会挂载在这里
</div>
```

2） 在主应用挂载的地方注册, 这里需要加载子项目启动时导出的js文件进行引入

```
const loadScript = async (url)=> {
    await new Promise((resolve,reject)=>{
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script)
        });
    }
import { registerApplication, start } from 'single-spa';
registerApplication(
    'singleVue',
    async ()=>{
        await loadScript('http://localhost:10000/js/chunk-vendors.js');
        await loadScript('http://localhost:10000/js/app.js');
        return window.singleVue
    },
    location => location.pathname.startsWith('/vue')
)
start();
```

#### qiankun

##### 1. umi项目

umi对于qiankun有较好的插件umijs/plugin-qiankun，所以安装就可以

```
yarn add @umijs/plugin-qiankun -D
```

在配置中注册

```
config/config.ts 或者 .umirc 中
{
  ...
  qiankun: {
    master: {
      apps: [
        {
          name: 'qiankun-react',
          entry: '//localhost:8001',
        },
        {
          name: 'qiankun-vue',
          entry: '//localhost:8002',
        },
      ],
    },
  },
}
```

配置路由， 配置完切换路由可以在控制台查看请求本地端口的数据

```javascript
export default [
  {
    path: '/',
    component: '@/layouts/index',
    routes: [
      {
        path: '/',
        name: '首页',
        component: './index.tsx',
      },
      {
        path: '/baseInfo',
        name: '基本信息维护',
        component: './baseInfo',
      },
      {
        path: '/dataManage',
        name: '数据管理',
        component: './dataManage', // 与page同级
      },
      {
        name: 'React项目',
        path: '/react',
        microApp: 'sub-app-1', // 名称和config里面的对应上
      },
      {
        name: 'Vue项目',
        path: '/vue',
        microApp: 'qiankun-vue',
      },
    ],
  },
];
```

**子应用umi配置**

安装@umijs/plugin-qiankun

```javascript
yarn add @umijs/plugin-qiankun -D
```

注册子应用

```
.umirc.ts中添加
qiankun: {
    slave: {},
  },
```

导出生命周期钩子

```
src/app.ts中添加，如果不存在自行构建
export const qiankun = {
  // 应用加载之前
  async bootstrap(props) {
    console.log('app1 bootstrap', props);
  },
  // 应用 render 之前触发
  async mount(props) {
    console.log('app1 mount', props);
  },
  // 应用卸载之后触发
  async unmount(props) {
    console.log('app1 unmount', props);
  },
};
```

启动子项目时报错，需要在package.json中编写name属性

其中的vue项目不是umi，所以和下面的其他项目配置是一样的

##### 2. 正常项目

**主应用**

基座中挂载节点，点击切换路由

```
src/App.vue
<template>
  <div>
  <el-menu :router="true" mode="horizontal">
      <!--基座中可以放自己的路由-->
      <el-menu-item index="/">Home</el-menu-item> 
       <!--引用其他子应用-->
      <el-menu-item index="/vue">vue应用</el-menu-item>
      <el-menu-item index="/react">react应用</el-menu-item>
  </el-menu>
    <router-view ></router-view>
    <div id="vue"></div>
    <div id="react"></div>
  </div>
</template>
```

基座中安装qiankun

```javascript
npm install qiankun
```

注册子应用

```
src/main.js
1、引入qiankun、注册应用、开启
import {registerMicroApps,start} from 'qiankun';
const apps = [ 
  {
    name:'vueApp', // 应用的名字
    entry:'//localhost:10000', // 默认会加载这个html 解析里面的js 动态的执行 （子应用必须支持跨域）fetch
    container:'#vue', // 挂载的元素
    activeRule:'/vue', // 激活的路径
    props:{a:1}

  },
  {
    name:'reactApp',
    entry:'//localhost:20000', // 默认会加载这个html 解析里面的js 动态的执行 （子应用必须支持跨域）fetch
    container:'#react',
    activeRule:'/react',
  }
]
registerMicroApps(apps); // 注册应用
start({
  prefetch:false // 取消预加载
});// 开启
```

**Vue子应用改造**

子应用导出方法

```
main.js中导出三个方法、必须是promise的，可以不写函数内容，但是必须存在，内部会校验
bootstrap 、mount、unmount

let instance = null
function render(props) {
    instance = new Vue({
        router,
        render: h => h(App)
    }).$mount('#app'); // 这里是挂载到自己的html中  基座会拿到这个挂载后的html 将其插入进去
}

if (window.__POWERED_BY_QIANKUN__) { // 动态添加webpack的publicPath
    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

if (!window.__POWERED_BY_QIANKUN__) { // 默认独立运行，属性不存在直接渲染
    render();
}

export async function bootstrap(props) {

};
export async function mount(props) { // 父应用传来的属性：props
  console.log(props)
  render(props) 创建vue实例
}
export async function unmount(props) {
    instance.$destroy();  // 卸载
}
```

配置打包文件

```
vue.config.js
module.exports = {
    devServer:{
        port:10000,
        headers:{
            'Access-Control-Allow-Origin':'*' // 跨域
        }
    },
    configureWebpack:{ // 打包后的结果
        output:{
            library:'vueApp',
            libraryTarget:'umd'
        }
    }
}
```

router默认base改变

```
src/router/index.js
const router = new VueRouter({
  mode: 'history',
  base: '/vue',
  routes
})
```

**React子应用**

react需要重写配置文件

```
yarn add react-app-rewired
config-overrides.js文件重写webpack
module.exports = {
    webpack:(config)=>{
        config.output.library = 'reactApp';
        config.output.libraryTarget = 'umd';
        config.output.publicPath = 'http://localhost:20000/';
        return config;
    },
    devServer:(configFunction)=>{
        return function (proxy,allowedHost){
            const config = configFunction(proxy,allowedHost);
            config.headers = {
                "Access-Control-Allow-Origin":'*'
            }
            return config
        }
    }
}
```

导出三个函数

```
function render(){
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}
if(!window.__POWERED_BY_QIANKUN__){ // 不存在时默认渲染render
  render();
}

export async function bootstrap(){

}
export async function mount() {
  render()
}
export async function unmount(){
  ReactDOM.unmountComponentAtNode( document.getElementById('root'));
}
```

配置端口号

```
.env文件
PORT=20000
WDS_SOCKET_PORT=20000 // websocket，防止热更新出错
```

重写配置，项目启动

```
package.json
"scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-app-rewired eject"
  },
```

基座会把子应用的整个html获取到，然后将js注释掉，再去fecth请求js，再加载加入沙箱，样式也是一样 

### 四、css隔离，js沙箱隔离

##### css隔离

css隔离目前主流四种方式

1. BEM (Block Element Modifier) 约定项目前缀：视已有项目的规范而定，大部分改动较多，容易出现未知错误

2. CSS-Modules 打包时生成不冲突的选择器名 

3. Shadow DOM 真正意义上的隔离：利用的是js本身的属性进行`shadow.attachShadow({ mode: 'open' });`

4. css-in-js 在已有项目中编写的规范问题，不会出现未知错误

##### js沙箱机制

**快照沙箱**

通过记录当前window属性进行存储，失活时和记录的属性进行对比，将对比结果保存起来，还原时直接将状态和记录的对比结果结合起来，还原上次的window的属性

**proxy代理沙箱**

每个应用都创建一个proxy来代理window，好处是每个应用都是相对独立，不需要直接更 改全局window属性

### 思考：

​		微前端不是一门具体的技术，而是整合了技术、策略和方法，好处就是没有了技术栈的约束，但是如果只是简单的几个组合，或许不会出现问题，但是当多层，层层嵌套，就会带来很多未知的问题

​		仅仅是几个系统的组合嵌套也是符合要求，两个系统耦合性较高，不然用户交互体验就会有很大的差别。

> 新的技术、体系出现肯定是为了解决某个特定的问题而存在，不过个人感觉还是，新的技术可以掌握，学习是为了以后出现问题，可以思考更加全面，规避一些开发中遇到的问题，不过用不用上还是得看具体需求，以上仅仅是个人理解。整个文档只是自己学习微前端的一个理解。

### 参考资料：

Micro frontends官网：https://microfrontends.com/

Systemjs：https://github.com/systemjs/systemjs

single-spa官网： https://single-spa.js.org/

qiankun官网： https://qiankun.umijs.org/zh/api

umi-qiankun插件： https://umijs.org/zh-CN/plugins/plugin-qiankun

single-spa脚手架文章： https://zhuanlan.zhihu.com/p/367710216









