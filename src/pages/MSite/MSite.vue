<template>
  <section class="msite">
    <!--首页头部-->
    <HeaderTop :title="address.name">
      <span slot="search" class="header_search">
        <i class="iconfont icon-sousuo"></i>
      </span>
      <router-link :to="userInfo._id?'/userinfo':'/login'" slot="login" class="header_login">
        <span class="header_login_text" v-if="!userInfo._id">
          登录|注册
        </span>
        <span class="header_login_text" v-else>
          <i class="iconfont icon-person"></i>
        </span>
      </router-link>
    </HeaderTop>
    <!--首页导航-->
    <nav class="msite_nav">
      <!--div和img是让加载缓慢时，有图片的显示-->
      <div class="swiper-container" v-if="categorys.length">
        <div class="swiper-wrapper">
          <!--为一个二维数组（两页）（每一页8个a）-->
          <div class="swiper-slide" v-for="(categorys,index) in categorysArr" :key="index">
            <a href="javascript:" class="link_to_food" v-for="(category,index) in categorys" :key="index">
              <div class="food_container">
                <img :src="baseImgUrl+category.image_url">
              </div>
              <span>{{category.title}}</span>
            </a>
          </div>
        </div>
        <!-- Add Pagination -->
        <div class="swiper-pagination"></div>
      </div>
      <img src="./images/msite_back.svg" v-else/>
    </nav>
    <!--首页附近商家-->
    <div class="msite_shop_list">
      <div class="shop_header">
        <i class="iconfont icon-xuanxiang"></i>
        <span class="shop_header_title">附近商家</span>
      </div>
      <ShopList/>
    </div>
  </section>
</template>

<script>
  import HeaderTop from '../../components/HeaderTop/HeaderTop.vue'
  import Swiper from 'swiper'
  import 'swiper/css/swiper.min.css'
  import ShopList from '../../components/ShopList/ShopList.vue'
  import {mapState} from 'vuex'

    export default {
      name: "MSite",
      components:{
        HeaderTop,
        ShopList
      },
      data(){
        return{
          baseImgUrl:'https://fuss10.elemecdn.com'
        }
      },
      mounted() {
        this.$store.dispatch('getCategorys')
        this.$store.dispatch('getShops')
      },
      computed: {
        ...mapState(['address','categorys','userInfo']),
        //问题：根据categorys一维数组，生成一个二维数组，小数组的元素个数永远为8
        categorysArr(){
          const {categorys} = this
          //准备一个空的二维数组
          const arr = []
          let minArr = []
          //遍历一维数组
          categorys.forEach(c => {
            //如果小数组长度为8时，就再添加一个小数组
            if (minArr.length === 8){
              minArr = []
            }
            //数组刚遍历时，或者小数组长度为8之后添加的新数组，添加到大数组中
            if (minArr.length === 0){
              arr.push(minArr)
            }
            minArr.push(c)
          })
          return arr
        }
      },
      watch:{
        categorys(value){
          //方法一：使用setTimeout事件不确定
          //方法二：界面更新就立即创建swiper对象
          this.$nextTick(() => {
            new Swiper ('.swiper-container', {
              loop: true, // 循环模式选项
              // 如果需要分页器
              pagination: {
                el: '.swiper-pagination',
              }
            })
          })
        }
      }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .msite  //首页
    width 100%
    .msite_nav
      bottom-border-1px(#e4e4e4)
      margin-top 45px
      height 200px
      background #fff
      .swiper-container
        width 100%
        height 100%
        .swiper-wrapper
          width 100%
          height 100%
          .swiper-slide
            display flex
            justify-content center
            align-items flex-start
            flex-wrap wrap
            .link_to_food
              width 25%
              .food_container
                display block
                width 100%
                text-align center
                padding-bottom 10px
                font-size 0
                img
                  display inline-block
                  width 50px
                  height 50px
              span
                display block
                width 100%
                text-align center
                font-size 13px
                color #666
        .swiper-pagination
          >span.swiper-pagination-bullet-active
            background #02a774
  .msite_shop_list
    top-border-1px(#e4e4e4)
    margin-top 10px
    background #fff
    .shop_header
      padding 10px 10px 0
      .shop_icon
        margin-left 5px
        color #999
      .shop_header_title
        color #999
        font-size 14px
        line-height 20px
</style>
