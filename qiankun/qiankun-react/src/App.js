/*
 * @LastEditors: haols
 */
import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Link } from 'react-router-dom'

function App() {
  return (
    <div style={{ textAlign: 'center', fontSize: 20 }}>
    <BrowserRouter basename="/react">
      <Link to="/">首页</Link>
      <Link style={{ marginLeft: 15 }} to="/about">关于页面</Link>
      <Route path="/" exact render={() => (
        <div className="App">
          我是首页
        </div>
      )}></Route>
      <Route path="/about" render={() => <h1>about页面</h1>}></Route>
    </BrowserRouter>
    </div>
  );
}

// qiankun 无关的技术栈

export default App;
