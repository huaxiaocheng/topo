import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: resolve => require(['@/pages/home'], resolve)
    }, {
      path: '/topo',
      name: 'Topo',
      component: resolve => require(['@/pages/topo/topo'], resolve)
    }
  ]
})
