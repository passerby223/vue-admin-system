import TabsView from '@/layouts/tabs/TabsView'
import BlankView from '@/layouts/BlankView'

// 路由配置
const options = {
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: () => import('@/views/login')
    },
    {
      path: '*',
      name: '404',
      component: () => import('@/views/exception/404')
    },
    {
      path: '/403',
      name: '403',
      component: () => import('@/views/exception/403')
    },
    {
      path: '/500',
      name: '500',
      component: () => import('@/views/exception/500')
    },
    {
      path: '/',
      name: '首页',
      component: TabsView,
      redirect: '/dashboard/workplace',
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          meta: {
            icon: 'dashboard'
          },
          component: BlankView,
          children: [
            {
              path: 'workplace',
              name: '工作台',
              meta: {
                icon: 'desktop'
              },
              component: () => import('@/views/dashboard/workplace')
            }
          ]
        }
      ]
    }
  ]
}

export default options
