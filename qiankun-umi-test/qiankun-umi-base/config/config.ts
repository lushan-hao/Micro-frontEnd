/*
 * @LastEditors: haols
 */
import { defineConfig } from 'umi';
import routes from './routes';

export default defineConfig({
  routes,
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
});