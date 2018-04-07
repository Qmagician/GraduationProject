import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/view'
import Home from '@/view/home'
import Find from '@/view/Find/find'
import Mine from '@/view/Mine/mine'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
  	{
  		path: '/home',
  		name: 'home',
  		component: Home
  	},
    {
      path: '/find',
      name: 'find',
      component: Find
    },
    {
      path: '/mine',
      name: 'mine',
      component: Mine
    },
  ]
})
