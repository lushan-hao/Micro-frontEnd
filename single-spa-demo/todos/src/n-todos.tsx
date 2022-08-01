/*
 * @LastEditors: haols
 */
import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import Root from "./root.component";

if (!(window as any).singleSpaNavigate) {
  ReactDOM.render(<Root />, document.getElementById('root'));
}

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
  // 错误边界函数
  errorBoundary(err, info, props) {
    // Customize the root error boundary for your microfrontend here.
    return <div>发生错误时此处内容将会被渲染</div>;
  },
  // 指定根组件的渲染位置
  domElementGetter: () => document.getElementById("myreact"),
});

// if (!window.) {
//   ReactDOM.render(<Root />, document.getElementById("app"));
// }

export const { bootstrap, mount, unmount } = lifecycles;
