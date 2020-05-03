import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/index',
    name: 'index',
    component: () => import('../views/Index.vue'),
    // redirect:'/index/user-info',
    children: [
      {
        path: 'user-info',
        name: 'userInfo',
        component: () => import('../components/UserInfo.vue')
      },
      {
        path: 'user-manage',
        name: 'userManage',
        component: () => import('../components/UserManage.vue')
      },
      {
        path: 'school-manage',
        name: 'schoolManage',
        component: () => import('../components/SchoolManage.vue')
      },
      {
        path: 'class-manage',
        name: 'classManage',
        component: () => import('../components/ClassManage.vue')
      },
      {
        path: 'leave-manage',
        name: 'leaveManage',
        component: () => import('../components/LeaveManage.vue')
      },
      {
        path: 'leave-detail',
        name: 'leaveDetail',
        component: () => import('../components/LeaveDetail.vue')
      },
      {
        path: 'log-manage',
        name: 'logManage',
        component: () => import('../components/LogManage.vue')
      },
      {
        path: 'album-manage',
        name: 'albumManage',
        component: () => import('../components/AlbumManage.vue')
      }
    ]
  }
]

// 问题:在vue项目中出现点击同一个路由地址时会报错[ Navigating to current location ("") is not allowed ]
// 重写路由的push方法
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

const router = new VueRouter({
  routes
})

export default router
