/*
 * @LastEditors: haols
 */
// 从框架中引入 两个 方法，下面调用
import { registerApplication, start } from "single-spa";


/*
注册微前端应用
    1. name: 字符串类型, 微前端应用名称 "@组织名称/应用名称"
    2. app: 函数类型, 返回 Promise, 通过 systemjs 引用打包好的微前端应用模块代码 (umd)
    3. activeWhen: 路由匹配时激活应用
*/
registerApplication(
  "@single-spa/welcome",
  () => System.import(
    "https://unpkg.com/single-spa-welcome/dist/single-spa-welcome.js"
  ),
  location=>location.pathname === '/'
);

// React -- todos 
registerApplication({
  name: "@study/todos",
  app: () => System.import("@study/todos"),
  activeWhen: ["/todos"]
});

// Vue -- todos
registerApplication({
  name: "@study/realworld",
  app: () => System.import("@study/realworld"),
  activeWhen: ["/realworld"]
});

// start 方法必须在 single spa 的配置文件中调用
// 在调用 start 之前, 应用会被加载, 但不会初始化, 挂载或卸载.
start({
  // 是否可以通过 history.pushState() 和 history.replaceState() 更改触发 single-spa 路由
  // true 不允许 false 允许 （先了解，有印象）
  urlRerouteOnly: true,
});
