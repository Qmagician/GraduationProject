import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/view'
import Home from '@/view/home'
import SearchMap from '@/view/searchmap'
import Find from '@/view/Find/find'
import Details from '@/view/Find/details'
import Reserve from '@/view/MyReserve/myreserve'
import Personal from '@/view/Mine/personal'
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
      path: '/searchmap',
      name: 'searchmap',
      component: SearchMap
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
      path: '/myreserve',
      name: 'myreserve',
      component: Reserve
    },
    {
      path: '/personal',
      name: 'personal',
      component: Personal
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
