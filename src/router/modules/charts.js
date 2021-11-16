/*
 * @Author: Rex Joush
 * @Date: 2021-08-11 15:19:50
 * @LastEditors: Rex Joush
 * @LastEditTime: 2021-08-11 15:37:35
 */
// /** When your routing table is too long, you can split it into small modules**/

// import Layout from '@/layout'

// const chartsRouter = {
//   path: '/charts',
//   component: Layout,
//   redirect: 'noRedirect',
//   name: 'Charts',
//   meta: {
//     title: 'Charts',
//     icon: 'chart'
//   },
//   children: [
//     {
//       path: 'keyboard',
//       component: () => import('@/views/charts/keyboard'),
//       name: 'KeyboardChart',
//       meta: { title: 'Keyboard Chart', noCache: true }
//     },
//     {
//       path: 'line',
//       component: () => import('@/views/charts/line'),
//       name: 'LineChart',
//       meta: { title: 'Line Chart', noCache: true }
//     },
//     {
//       path: 'mix-chart',
//       component: () => import('@/views/charts/mix-chart'),
//       name: 'MixChart',
//       meta: { title: 'Mix Chart', noCache: true }
//     }
//   ]
// }

// export default chartsRouter
