// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import state from './state'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import '@/assets/iconfont/iconfont.css'
import '@/assets/styles/index.css'
import 'font-awesome/css/font-awesome.min.css'
import { postRequest } from './utils/api'

Vue.config.productionTip = false
Vue.use(ElementUI)
window.bus = new Vue()

/* eslint-disable no-new */
// 可以在此处设置当查看具体博客时查看是否存在读者信息，如果不存在则通过token获取
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if (localStorage.getItem('token')) { // 获取当前的token是否存在
      console.log('Token存在')
      postRequest('/checkToken', {}).then(resp => {
        // 后台响应成功
        if (resp.status === 200) {
          // token查找不到（账户信息被修改）
          if (resp.data.code === 401) {
            console.log('Token过期')
            localStorage.removeItem('token')
            next({
              path: '/login', // 将跳转的路由path作为参数，登录成功后跳转到该路由
              query: { redirect: to.fullPath }
            })
          }
        } else {
          next()
        }
      })
    } else {
      console.log('token不存在')
      next({
        path: '/login', // 将跳转的路由path作为参数，登录成功后跳转到该路由
        query: { redirect: to.fullPath }
      })
    }
  } else { // 如果不需要权限校验，直接进入路由界面
    next()
  }
})

new Vue({
  el: '#app',
  router,
  components: { App },
  data: { // only place where data is not a function
    state,
    adminUrl: 'http://admin.yhhu.xyz',
    ABOUT_ID: 1,
    userId: 0,
    loginFormVisible: false
  },
  template: '<App/>'
})
