import Vue from 'vue'
import Router from 'vue-router'
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

// 所有权限通用路由表
// 如首页和登录页和一些不用权限的公用页面
export const constantRouterMap = [{
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
},
{
  path: '/404',
  component: () =>
    import('@/views/404'),
  hidden: true
},
{
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  name: '实验室系统',
  hidden: true,
  children: [{
    path: 'dashboard',
    component: () =>
      import('@/views/laboratory/booking')
  }]
},
{
  path: '*',
  redirect: '/404',
  hidden: true
}]

// 实例化vue的时候只挂载constantRouter
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
/* 异步挂载的路由
动态需要根据权限加载的路由表
*/
export const asyncRouterMap = [{
  path: '/personal',
  component: Layout,
  name: '个人中心',
  alwaysShow: true,
  meta: {
    title: '个人中心',
    icon: 'example' },
  children: [{
    path: 'info',
    component: () =>
      import('@/views/personal/info'),
    name: '修改密码',
    meta: {
      title: '修改密码',
      roles: ['admin', 'student', 'teacher']
    }// 页面需要的权限
  }]
}, {
  path: '/account',
  component: Layout,
  name: '用户管理中心',
  alwaysShow: true,
  meta: {
    title: '用户管理中心',
    icon: 'example',
    roles: ['admin'] },
  children: [{
    path: 'userInfo',
    component: () =>
      import('@/views/account/userInfo'),
    name: '学生信息',
    meta: {
      title: '学生信息',
      roles: ['admin']
    }// 页面需要的权限
  }, {
    path: 'teacherInfo',
    component: () =>
      import('@/views/account/teacherInfo'),
    name: '教师信息',
    meta: {
      title: '教师信息',
      roles: ['admin']
    }// 页面需要的权限
  }]
}, {
  path: '/laboratory',
  component: Layout,
  name: '实验室中心',
  alwaysShow: true,
  meta: {
    title: '实验室中心',
    icon: 'example' },
  children: [{
    path: 'category',
    component: () =>
      import('@/views/laboratory/category'),
    name: '分类管理',
    meta: {
      title: '分类管理',
      roles: ['admin']
    }// 页面需要的权限
  },
  {
    path: 'manage',
    component: () =>
      import('@/views/laboratory/manage'),
    name: '数据管理',
    meta: {
      title: '数据管理',
      roles: ['admin']
    }
  },
  {
    path: 'booking',
    component: () =>
      import('@/views/laboratory/booking'),
    name: '预约管理',
    meta: {
      title: '预约管理',
      roles: ['student', 'teacher']
    }
  }, {
    path: 'auditing',
    component: () =>
      import('@/views/laboratory/auditing'),
    name: '审核管理',
    meta: {
      title: '审核管理',
      roles: ['admin']
    }
  }, {
    path: 'myBooking',
    component: () =>
      import('@/views/laboratory/myBooking'),
    name: '审核结果',
    meta: {
      title: '结果查询',
      roles: ['student', 'teacher']
    }
  }]
},
{
  path: '/equipment',
  component: Layout,
  name: '设备中心',
  alwaysShow: true,
  meta: {
    title: '设备中心',
    icon: 'example' },
  children: [{
    path: 'manage',
    component: () =>
      import('@/views/equipment/manage'),
    name: '设备数据管理',
    meta: {
      title: '数据管理',
      roles: ['admin']
    }
  }, {
    path: 'loan',
    component: () =>
      import('@/views/equipment/loan'),
    name: '暂借管理',
    meta: {
      title: '暂借管理',
      roles: ['admin', 'student', 'teacher']
    }
  }, {
    path: 'auditing',
    component: () =>
      import('@/views/equipment/auditing'),
    name: '审核管理',
    meta: {
      title: '审核管理',
      roles: ['admin']
    }
  }, {
    path: 'repair',
    component: () =>
      import('@/views/equipment/repair'),
    name: '维修中心',
    meta: {
      title: '维修中心',
      roles: ['admin']
    }
  }, {
    path: 'myAuditing',
    component: () =>
      import('@/views/equipment/myLoan'),
    name: '我的租借',
    meta: {
      title: '我的租借',
      roles: ['admin', 'student', 'teacher']
    }
  }]
},
{
  path: '*',
  redirect: '/404',
  hidden: true
}]
