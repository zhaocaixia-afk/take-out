import Vue from 'vue'
import Router from 'vue-router'

//路由组件的懒加载
const Msite = () => import('../pages/MSite/MSite.vue')
const Search = () => import('../pages/Search/Search.vue')
const Order = () => import('../pages/Order/Order.vue')
const Profile = () => import('../pages/Profile/Profile.vue')

import Login from '../pages/Login/Login.vue'

import Shop from '../pages/Shop/Shop.vue'
import ShopGoods from '../pages/Shop/ShopGoods/ShopGoods.vue'
import ShopRating from '../pages/Shop/ShopRating/ShopRating.vue'
import ShopInfo from '../pages/Shop/ShopInfo/ShopInfo.vue'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/msite'},
    { path: '/msite', component:Msite,meta:{showFooter:true}},
    { path: '/search', component: Search,meta: {showFooter:true}},
    { path: '/order', component: Order,meta: {showFooter:true}},
    { path: '/profile', component: Profile,meta: {showFooter:true}},
    { path: '/login', component: Login },
    {
      path: '/shop',
      component: Shop,
      children: [
        { path: '', redirect: '/shop/goods'},
        { path: '/shop/goods', component: ShopGoods},
        { path: '/shop/ratings', component: ShopRating},
        { path: '/shop/info', component: ShopInfo}
      ]
    }
  ]
})
