import Vue from 'vue'

import {
  RECEIVE_ADDRESS,
  RECEIVE_CATEGORYS,
  RECEIVE_SHOPS,
  RECEIVE_USER_INFO,
  RESET_USER_INFO,
  RECEIVE_GOODS,
  RECEIVE_RATINGS,
  RECEIVE_INFO,

  DECREMENT_FOOD_COUNT,
  INCREMENT_FOOD_COUNT,

  CLEAR_CART,

  RECEIVE_SEARCH_SHOPS
}from './mutation-types'
export default {
  [RECEIVE_ADDRESS](state,{address}){
    state.address = address
  },
  [RECEIVE_CATEGORYS](state,{categorys}){
    state.categorys = categorys
  },
  [RECEIVE_SHOPS](state,{shops}){
    state.shops = shops
  },
  [RECEIVE_USER_INFO](state,{userInfo}){
    state.userInfo = userInfo
  },
  [RESET_USER_INFO](state){
    state.userInfo = {}
  },
  //商家的操作
  [RECEIVE_GOODS](state,{goods}){
    state.goods = goods
  },
  [RECEIVE_RATINGS](state,{ratings}){
    state.ratings = ratings
  },
  [RECEIVE_INFO](state,{info}){
    state.info = info
  },
  //实时修改数量
  [INCREMENT_FOOD_COUNT](state,{food}){
    if(!food.count){
      // food.count = 1 //为新增属性，无法实时显示
      Vue.set(food,'count',1)
      //将food添加到cartFoods中
      state.cartFoods.push(food)
    }else {
      food.count++
    }
  },
  [DECREMENT_FOOD_COUNT](state,{food}){
    //不能减成负数
    if(food.count){
      food.count--
      if(food.count===0){
        //将food从cartFoods中移除
        state.cartFoods.splice(state.cartFoods.indexOf(food),1)
      }
    }
  },
  //清空购物车
  [CLEAR_CART](state){
    //清除food中的count
    state.cartFoods.forEach(food => food.count = 0)
    //移除购物车中所有购物项
    state.cartFoods = []
  },
  //得到搜索的商家列表
  [RECEIVE_SEARCH_SHOPS](state,{searchShops}){
    state.searchShops = searchShops
  }
}
