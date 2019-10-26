<template>
  <div class="search">
    <HeaderTop title="搜索"/>
    <form class="search_form" @submit.prevent="search">
        <input type="search" placeholder="请输入商家名称" class="search_input" v-model="keyword">
        <input type="submit" class="search_submit">
      </form>
    <div class="list">
      <ul class="list_container">
        <li class="list_li" v-for="(searchShop,index) in searchShops" :key="index">
          <section class="item_left">
            <img src="./Search/1.jpg" class="restaurant_img">
          </section>
          <section class="item_right">
            <div class="item_right_text">
              <p><span>{{searchShop.name}}</span> </p>
              <p>月售 {{searchShop.month_sales||searchShop.recent_order_num}} 单</p>
              <p>{{searchShop.delivery_fee||searchShop.float_minimum_order_amount}} 元起送 / 距离 {{searchShop.distance}}</p>
            </div>
          </section>
        </li>
      </ul>
    </div>
    <div class="search_none" v-show="noSearchShop">很抱歉！无搜索结果</div>
  </div>
</template>

<script>
  import HeaderTop from '../../components/HeaderTop/HeaderTop.vue'
  import {mapState} from 'vuex'
  import BScroll from 'better-scroll'

    export default {
      name: "Search",
      data(){
        return{
          keyword:'',//输入搜索的关键字
          noSearchShop:false//开始进入时，为默认不显示。搜索之后才确定是否显示（所以设置为监听属性）
        }
      },
      computed:{
        ...mapState(['searchShops'])
      },
      methods:{
        search(){
          //得到搜索关键字（trim去掉空格）
          const keyword = this.keyword.trim()
          //进行搜索
          if(keyword){
            this.$store.dispatch('getSearchShops',keyword)
          }
        }
      },
      watch:{
        //监听数组，完了之后
        searchShops(value){
          //value.length没有值进入（显示提示）
          if(!value.length){
            this.noSearchShop = true
          }else{
            //有值的话，就不显示，数据会有滚动效果
            this.noSearchShop = false
          }
        }
      },
      components:{
        HeaderTop
      }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .search
    width 100%
    overflow hidden
    padding-bottom 50px
    .search_form
      clearFix()
      margin-top 45px
      background-color #fff
      padding 12px 8px
      input
        height 35px
        padding 0 4px
        border-radius 2px
        font-weight bold
        outline none
        &.search_input
          float left
          width 79%
          border 4px solid #f2f2f2
          font-size 14px
          color #333
          background-color #f2f2f2
        &.search_submit
          float right
          width 18%
          border 4px solid #02a774
          font-size 16px
          color #fff
          background-color #02a774

    .list
      width 100%
      .list_container
        background-color: #fff;
        .list_li
          display: flex;
          justify-content: center;
          padding: 10px
          border-bottom: 1px solid $bc;
          .item_left
            margin-right: 10px
            .restaurant_img
              width 50px
              height 50px
              display block
          .item_right
            font-size 12px
            flex 1
            .item_right_text
              p
                line-height 12px
                margin-bottom 6px
                &:last-child
                  margin-bottom 0
    .search_none
      margin: 0 auto
      color: #333
      background-color: #fff
      text-align: center
      margin-top: 0.125rem
</style>
