/*
 * @LastEditors: haols
 */
import React from "react";
// 引入路由相关组件
import {BrowserRouter, Switch, Route, Redirect, Link} from "react-router-dom"
import Home from './Home'
import About from './About'



export default function Root(props) {
  return (
    // 使用路由组件，设计基础路由路径
    <BrowserRouter basename="/todos">
      <div>模块传值：{props.name}</div>
      {/* 设置点击链接，跳转路由 */}
      <div>
        <Link to="/home">Home</Link> | 
        <Link to="/about">About</Link>
      </div>
 
      {/* 路由展示 */}
      <Switch>
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/about">
          <About></About>
        </Route>
        <Route path="/">
          {/* 路由重定向 */}
          <Redirect to="/home"></Redirect>
        </Route>
      </Switch>
    </BrowserRouter>
  )
}
