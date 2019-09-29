import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    }, {
      path: '/login',
      name: '登录',
      hidden: true,
      component: () => import('@/components/User/Login')
    }, {
      path: '/logOut',
      name: '登出',
      hidden: true,
      component: () => import('@/components/User/logOut')
    }, {
      path: '/user',
      name: '存储用户信息',
      hidden: true,
      component: () => import('@/components/User/user')
    }, {
      path: '/register',
      name: '注册',
      hidden: true,
      component: () => import('@/components/User/Register')
    }, {
      path: '/home',
      name: '主页',
      hidden: true,
      component: () => import('@/components/Home/index')
    }, {
      path: '/blog/:blogId',
      // meta: {
      //   requireAuth: true,  // 该路由项需要权限校验
      // },
      component: () => import('@/components/blog'),
      // 类型转换，否则会将字符串类型的数字传递给blog组件
      props: (route) => ({ blogId: Number(route.params.blogId) })
    }, {
      path: '/Blog/' + 1,
      alias: '/about'
    }
  ]
})
