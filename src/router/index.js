import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/view'
import Home from '@/view/home'
import Find from '@/view/Find/find'
import Details from '@/view/Find/details'
import Mine from '@/view/Mine/mine'
import addPark from '@/view/Mine/addPark'

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
      path: '/details',
      name: 'details',
      component: Details
    },
    {
      path: '/mine',
      name: 'mine',
      component: Mine
    },
    {
      path: '/addPark',
      name: 'addPark',
      component: addPark
    },
  ]
})
