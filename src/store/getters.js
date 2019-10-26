export default {
  //这两个属性是基于cartFoods:[]
  totalCount(state){
    return state.cartFoods.reduce((preTotal,food)=>preTotal + food.count ,0)
  },
  totalPrice(state){
    return state.cartFoods.reduce((preTotal,food) => preTotal + food.count*food.price,0)
  },
  positiveSize(state){
    //rateType的0代表满意，1代表不满意
    return state.ratings.reduce((preTotal,rating) => preTotal + (rating.rateType===0?1:0),0)
  }
}
