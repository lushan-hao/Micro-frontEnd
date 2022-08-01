#### 一、基座

```
import { registerApplication, start } from "single-spa";
 
/*
注册微前端应用
        1. name: 字符串类型, 微前端应用名称 "@组织名称/应用名称"
   		2. app: 函数类型, 返回 Promise, 通过 systemjs 引用打包好的微前端应用模块代码 (umd)
        3. activeWhen: 路由匹配时激活应用
*/
registerApplication({
  name: "@single-spa/welcome",
  app: () =>
    System.import(
      "https://unpkg.com/single-spa-welcome/dist/single-spa-welcome.js"
    ),
  activeWhen: ["/"],
});

registerApplication({
  name: "@study/todos",
  app: () => System.import("@study/todos"), // index.html对应的名字
  activeWhen: ["/todos"]
});

start({
  // 是否可以通过 history.pushState() 和 history.replaceState() 更改触发 single-spa 路由
  // true 不允许 false 允许 （先了解，有印象）
  urlRerouteOnly: true,
});

```

index.html中

```
 <script type="systemjs-importmap"> // 公共库存储
    {
      "imports": {
        "single-spa": "https://cdn.jsdelivr.net/npm/single-spa@5.9.0/lib/system/single-spa.min.js",
        "react": "https://cdn.jsdelivr.net/npm/react@17.0.1/umd/react.production.min.js",
        "react-dom": "https://cdn.jsdelivr.net/npm/react-dom@17.0.1/umd/react-dom.production.min.js",
      }
    }
  </script>
  
  <!-- <script type="systemjs-importmap" src="/importmap.json"></script> -->
	<!-- JavaScript 模块下载地址 此处可放置微前端项目中的公共模块 -->
  <% if (isLocal) { %>
  <script type="systemjs-importmap">
    {
      "imports": {
        "@xl/root-config": "//localhost:9000/xl-root-config.js", // 子应用打包好的js文件
        "@study/todos": "//localhost:9002/study-todos.js",
      }
    }
  </script>
  
   <h2>
    <!-- 指定应用展示位置 -->
    <div id="myreact"></div>
  </h2>

```

#### 二、 React应用

```
安装single-spa-react 然后singleSpaReact包裹，返回生命周期
import singleSpaReact from "single-spa-react";
const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  // 渲染根组件
  rootComponent: Root,
  // 错误边界函数
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    return null;
  },
  // 指定根组件的渲染位置
  domElementGetter:()=>document.getElementById('myreact')
});

// 暴露必要的生命周期函数
export const { bootstrap, mount, unmount } = lifecycles;
```

webpack中排除打包模块， 配置打包出来名称，以便在基座中引用

有问题： 此时本地的应用还不能独立启动，因为打包完生成.js文件在基座进行引入，子应用独立打包无法获取