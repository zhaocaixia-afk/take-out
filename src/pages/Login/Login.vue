<template>
  <section class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <div class="login_header_title">
          <a href="javascript:;" :class="{on:loginWay}" @click="loginWay=true">短信登录</a>
          <a href="javascript:;" :class="{on:!loginWay}" @click="loginWay=false">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form @submit.prevent="login">
          <div :class="{on:loginWay}">
            <section class="login_message">
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
<!--              rightPhone为（手机号码正则表达式）的监听属性，返回true or false：1、决定是否显示样式 2、button按钮是否可按-->
<!--              (禁止点击)：手机号格式不对时，rightPhone为false时-->
<!--              手机格式正确，才能点击按钮，发送获取验证码的请求，随之按钮的文本内容会显示倒计时-->
              <button :class="{right_phone:rightPhone}" @click.prevent="getCode"
                      :disabled="!rightPhone" class="get_verification">
                {{computeTime>0?`已发送(${computeTime}s)`:'获取验证码'}}
              </button>
            </section>
            <section class="login_verification">
              <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
            </section>
            <section class="login_hint">
              温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div :class="{on:!loginWay}">
            <section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
              </section>
              <section class="login_verification">
<!--                显示密码与隐藏（有两个input通过v-if和v-else控制显示）-->
                <input type="text" maxlength="8" placeholder="密码" v-if="showPwd" v-model="pwd">
                <input type="password" maxlength="8" placeholder="密码" v-else v-model="pwd">
<!--                点击切换（显示还是隐藏）-->
<!--                显示时，1、切换为type='text'的input 2、样式为on，文本为abc，添加滚动样式-->
                <div class="switch_button" :class="showPwd?'on':'off'" @click="showPwd=!showPwd">
                  <div class="switch_circle" :class="{right:showPwd}"></div>
                  <span class="switch_text">{{showPwd?'abc':'...'}}</span>
                </div>
              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                <img class="get_verification" src="http://localhost:4000/captcha" ref="captcha" @click="getCaptcha" alt="captcha">
              </section>
            </section>
          </div>
          <button class="login_submit">登录</button>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <a href="javascript:" class="go_back" @click="$router.back()">
        <i class="iconfont icon-jiantou2"></i>
      </a>
    </div>

    <AlertTip :alertText="alertText" v-show="alertShow" @closeTip="closeTip"/>
  </section>
</template>

<script>
  import AlertTip from '../../components/AlertTip/AlertTip.vue'
  import {reqSendCode,reqPwdLogin,reqSmsLogin} from '../../api'
    export default {
      name: "Login",
      data(){
        return{
          loginWay:true,//默认为短信登录
          computeTime:0,//计时为0
          showPwd: false,//是否显示密码
          //收集数据实现前端表单验证
          phone:'',//输入的手机号码
          code:'',//短信验证码
          name:'',//用户名
          pwd:'',//获取到的密码
          captcha:'',//用户名登录图形验证码

          alertText: '',//提示文本
          alertShow: false,//是否显示提示框
        }
      },
      computed:{
        rightPhone(){
          //计算属性，返回true or false
          return /^1\d{10}$/.test(this.phone)
        }
      },
      methods:{
        //手机号码登录：异步获取短信验证码
        async getCode(){
          //如果当前没有计时(computeTime=0,为false)，才需要打开计数器
          if(!this.computeTime){
            //一、启动倒计时
            this.computeTime = 30
            this.intervalId = setInterval(()=>{
              this.computeTime--
              //停止计时
              if (this.computeTime<=0){
                clearInterval(this.intervalId)
              }
            },1000)
            //二、发送ajax，获取短信验证码
            const result = await reqSendCode(this.phone)
            if(result.code===1){
              //获取没有成功，显示错误的提示
              this.showAlert(result.msg)
              //停止倒计时(数值大于0)
              if(this.computeTime){
                this.computeTime=0
                clearInterval(this.intervalId)
                this.intervalId = undefined
              }
            }
          }
        },
        //提示框为隐藏的组件
        //抽取（提示框显示和提示框内容）的函数
        showAlert(alertText){
          this.alertShow = true
          this.alertText = alertText
        },
        //异步登录(两种方式)
        async login(){
          let result;
          //前端表单验证
          //1.判断是什么方式登录
          if(this.loginWay){
            //短信登录
            //2.在不同登录方式中准备数据
            const {rightPhone,phone,code} = this
            if(!this.rightPhone){
              //rightPhone为手机号码的监听是否正确的值
              //手机号码不正确
              this.showAlert('手机号码不正确')
              return
            }else if(!/^\d{6}$/.test(code)){
              //code必须要值为6位
              //验证码错误
              this.showAlert('验证码错误')
              return;
            }
            //一、发送ajax请求短信登陆
            result = await reqSmsLogin(phone,code)

          }else{
            //密码登录
            const {name,pwd,captcha} = this
            if(!this.name){
              //用户名不能为空或不正确
              this.showAlert('用户名不正确')
              return;
            }else if(!this.pwd){
              //密码不正确
              this.showAlert('密码不正确')
              return;
            }else if(!this.captcha){
              //验证码不正确
              this.showAlert('验证码不正确')
              return;
            }
            //二、发送ajax请求密码登陆
            result = await reqPwdLogin({name,pwd,captcha})
          }
          //无论登陆成功还是失败，都要停止计数器
          if(this.computeTime){
            this.computeTime=0
            clearInterval(this.intervalId)
            this.intervalId = undefined
          }
          //三、登陆后、根据结果处理数据
          if (result.code===0){
            const user = result.data
            //1)将user保存到vuex的state中
            this.$store.dispatch('recordUser',user)
            //2)跳转页面到个人中心界面
            this.$router.replace('/profile')
          } else {
            const msg = result.msg
            //失败要显示错误信息，和更新验证码
            this.showAlert(msg)
            this.getCaptcha()
          }
        },
        //实现AlertTip关闭功能
        closeTip(){
          this.alertShow = false
          this.alertText = ''
        },
        //密码登录中：点击获取一个新的图片验证码
        getCaptcha(){
          //每次指定的src要不一样,才能发送请求
          this.$refs.captcha.src = 'http://localhost:4000/captcha?time='+Date.now()
        }
      },
      components:{
        AlertTip
      }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          >a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        >form
          >div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.right_phone
                  color black
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s,border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #02a774
                >.switch_circle
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                  transition transform .3s
                  &.right
                    transform translateX(26px)
            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              >a
                color #02a774
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        >.iconfont
          font-size 20px
          color #999
</style>
