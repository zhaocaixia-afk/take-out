import {
  reqAddress,
  reqFoodCategorys,
  reqShops,
  reqUserInfo,
  reqLogout,
  reqShopGoods,
  reqShopRatings,
  reqShopInfo,
  reqSearchShop
} from '../api'

import {
  RECEIVE_ADDRESS,
  RECEIVE_CATEGORYS,
  RECEIVE_SHOPS,
  RECEIVE_USER_INFO,
  RESET_USER_INFO,
  RECEIVE_GOODS,
  RECEIVE_RATINGS,
  RECEIVE_INFO,

  INCREMENT_FOOD_COUNT,
  DECREMENT_FOOD_COUNT,

  CLEAR_CART,

  RECEIVE_SEARCH_SHOPS
} from "./mutation-types";

export default {
  //通过经纬度 异步获取地址信息
  async getAddress({commit,state}){
    const geohash = state.latitude + ',' + state.longitude
    const result = await reqAddress(geohash)
    if (result.code===0){
      const address = result.data
      commit(RECEIVE_ADDRESS,{address})
    }
  },
  //异步获取分类列表
  async getCategorys({commit}){
    const result = await reqFoodCategorys()
    if(result.code === 0){
      const categorys = result.data
      commit(RECEIVE_CATEGORYS,{categorys})
    }
  },
  //异步获取商家列表
  async getShops({commit,state}){
    const {latitude,longitude} = this
    const result = await reqShops({latitude,longitude})
    if(result.code === 0){
      const shops = result.data
      commit(RECEIVE_SHOPS,{shops})
    }
  },
  //同步记录用户信息
  recordUser({commit},userInfo){
    commit(RECEIVE_USER_INFO,{userInfo})
  },
  //异步获取用户信息
  async getUserInfo({commit}){
    const result = await reqUserInfo()
    if(result.code===0){
      const userInfo = result.data
      commit(RECEIVE_USER_INFO,{userInfo})
    }
  },
  //异步退出
  async logout({commit}){
    const result = await reqLogout()
    if(result.code === 0){
      commit(RESET_USER_INFO)
    }
  },
  //mock的数据异步获取商家商品列表
  async getShopGoods({commit},callback){
    const result = await reqShopGoods()
    if(result.code === 0){
      const goods = result.data
      commit(RECEIVE_GOODS,{goods})
      //数据更新了，传过来的函数，数据更新之后执行
      callback && callback()
    }
  },
  //异步获取商家的评论列表
  async getShopRatings({commit},callback){
    const result = await reqShopRatings()
    if(result.code === 0){
      const ratings = result.data
      commit(RECEIVE_RATINGS,{ratings})
      callback && callback()
    }
  },
  //异步获取商家信息
  async getShopInfo({commit}){
    const result = await reqShopInfo()
    if(result.code === 0){
      const info = result.data
      commit(RECEIVE_INFO,{info})
    }
  },

  //同步更新food中的count值
  updateFoodCount({commit},{isAdd,food}){
    if(isAdd){
      commit(INCREMENT_FOOD_COUNT,{food})
    }else {
      commit(DECREMENT_FOOD_COUNT,{food})
    }
  },

  clearCart({commit}){
    commit(CLEAR_CART)
  },

  async getSearchShops({commit,state},keyword){
    const geohash = state.latitude + ',' + state.longitude
    const result = await reqSearchShop(geohash,keyword)
    if (result.code===0){
      const searchShops = result.data
      commit(RECEIVE_SEARCH_SHOPS,{searchShops})
    }
  }
}
