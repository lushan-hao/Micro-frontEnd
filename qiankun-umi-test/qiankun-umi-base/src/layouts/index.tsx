/*
 * @LastEditors: haols
 */
import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import menuRouterConfig from '../../config/routes';
import { history, Link } from 'umi';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default (props) => {
  return (
    <div className='test-umi'>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider>
          <div
            className="logo"
            style={{ minHeight: '45px', fontSize: '24px', color: '#fff', marginLeft: 15, marginTop: 15 }}
          >
            微前端umi基座
          </div>
          <Menu
            theme="dark"
            defaultSelectedKeys={['/']}
            mode="inline"
            onClick={(e: any) => {
              // 点击时，history修改url
              // history.push(e.key);
            }}
          >
            {menuRouterConfig[0].routes.map(
              (
                item: any, // 遍历路由信息，展示名称
              ) => (
                <Menu.Item key={item.path}><Link to={item.path}>{item.name}</Link></Menu.Item>
              ),
            )}
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              {props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2018 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
};
