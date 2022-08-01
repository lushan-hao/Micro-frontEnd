/*
 * @LastEditors: haols
 */
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
        microApp: 'qiankun-react',
      },
      {
        name: 'Vue项目',
        path: '/vue',
        microApp: 'qiankun-vue',
      },
    ],
  },
];
