<template>
  <div id="app">
    <div class="banner">
      <div ref="inputbox" class="inputbox">
        <input type="text" name="search" class="search" placeholder="想搜点什么" size="100" width="300" height="30">
      </div>
      <div class="bg">
        <img :src="seller.bground" alt="bg" width="100%" height="80">
      </div>
      <div ref="avatar" class="avatar">
        <img :src="seller.avatar" alt="avatar" width="60" height="60">
      </div>
    </div>
    <div class="scroll-container" >
      <div class="inner" :style="{height:innerHei+'px'}">
        <div class="block"></div>
        <apphead @scrUp="scrUp" ref="ahead" :posEndY="posEndY" :posY="posY" :posTabY="posTabY" :elHeight="tabBlockHei" :seller="seller" class="apphead"></apphead>
        <div class="tab-container" :style="{height:tabContainHei+'px'}">
          <div class="tab-inner">
            <div class="tab-block" :style="{height:tabBlockHei+'px'}"></div>
            <div class="tab border-1px">
              <div class="tab-item" @click="tabCount=1">
                <router-link to="/goods">商品</router-link>
              </div>
              <div class="tab-item" @click="tabCount=2">
                <router-link to="/ratings">评论</router-link>
              </div>
              <div class="tab-item" @click="tabCount=3">
                <router-link to="/seller">商家</router-link>
              </div>
            </div>
            <div v-show="isLoading" class="loading">
              <ul class="animate">
                  <li></li><li></li><li></li>
              </ul>
              <div class="loading-text">是谁呼叫舰队</div>
            </div>
            <router-view ref="goods" @toDetail="toDetail" :style="{height:tabContainHei-40+'px'}"></router-view>
          </div>
        </div>
      </div>
    </div>
    <shopcart :shopZIndex="shopZIndex" :shopBottom="shopcartBottom" class="shop" ref="shopcart" :select-foods="selectFood" :deliver-price="seller.deliveryPrice" :minPrice="seller.minPrice"></shopcart>
    <transition name="fdetail">
      <div class="fade" v-show="showFood"></div>
    </transition>
    <transition name="scroll">
      <goods-detail v-show="showFood" ref="fd" class="wrap" :food="foodDetail" @clk="clk" :showFood="showFood"></goods-detail>
    </transition>
  </div>
</template>
<script>
import Vue from 'vue';
import apphead from './components/apphead/apphead.vue';
import VueRouter from 'vue-router';
import seller from './components/seller/seller';
import goods from './components/goods/goods';
import ratings from './components/ratings/ratings';
import axios from 'axios';
import BScroll from 'better-scroll';
import shopcart from './components/shopcart/shopcart';
import goodsDetail from './components/goods-detail/goods-detail';
import FastClick from 'fastclick';
import bus from './common/bus/bus.js';
// import store from './store/store.js';
// import { mapState } from 'vuex';
function scrollToOpacityOff(el, posY, posNow) {
  el.style.opacity = 1 + (posNow / posY);
};
function scrollToOpacityOn(el, posY, posNow) {
  el.style.opacity = 0 - (posNow / posY);
};
function scrollToScaleOff(el, posY, posNow) {
  if ((1 + posNow / posY) >= 0) {
    el.style.transform = `scale(${1 + posNow / posY})`;
  }
};
function scrollToPositionTop(el, posNow) {
  let currTop = window.getComputedStyle(el).top;
  var current = 0;
  var u = navigator.userAgent;
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  if (u.indexOf('Chrome') > -1) {
    current = Math.floor(currTop.substr(0, 2));
  } else if (isiOS) {
    current = Math.floor(currTop.substr(0, 2));
  }
  el.style.top = current + posNow + 'px';
};
Vue.use(VueRouter);
let router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/goods'
    },
    {
      path: '/seller',
      component: seller
    },
    {
      path: '/goods',
      component: goods
    },
    {
      path: '/ratings',
      component: ratings
    }
  ],
  linkActiveClass: 'active'
});
// router.beforeEach((to, form, next) => {
//   store.dispatch('onLoading', true);
//   console.log(store.state.isLoading);
//   next();
// });
// router.afterEach((to, form) => {
//   store.dispatch('onLoading', false);
//   console.log(store.state.isLoading);
// });
const ERR_OK = 0;
export default {
  name: 'App',
  data() {
    return {
      seller: {},
      innerHei: 164 + window.innerHeight,
      tabContainHei: window.innerHeight - 98,
      tabBlockHei: window.innerHeight - 50,
      appScroll: {},
      tabScroll: {},
      posY: -1,
      posTabY: -(window.innerHeight - 50),
      posEndY: -1,
      showFood: false,
      selectFood: [],
      foodDetail: {},
      foodScrollMove: false,
      tabCount: 1,
      shopcartBottom: 0,
      shopZIndex: 50,
      isLoading: false
    };
  },
  created: function () {
    axios.get('http://47.95.250.189/api/seller', {
      responseType: 'json'
    }).then((res) => {
      console.log(res);
      this.seller = res.data.data;
      console.log(this.seller);
      this.$nextTick(() => {
        FastClick.attach(document.body);
        this._initSc();
        bus.$on('increment', target => {
          this.$refs.shopcart.drop(target);
        });
        bus.$on('showSel', target => {
          this.selectFood = target;
        });
        bus.$on('transw', (sw) => {
          if (sw === true) {
            this.tabScroll.enable();
            this.appScroll.enable();
          } else {
            this.tabScroll.disable();
            this.appScroll.disable();
          }
        });
        bus.$on('transr', (sr) => {
          if (sr === true) {
            this.tabScroll.enable();
            this.appScroll.enable();
          } else {
            this.tabScroll.disable();
            this.appScroll.disable();
          }
        });
        bus.$on('transs', (ss) => {
          if (ss === true) {
            this.tabScroll.enable();
            this.appScroll.enable();
          } else {
            this.tabScroll.disable();
            this.appScroll.disable();
          }
        });
        bus.$on('shopBottom', (pos) => {
          this.shopcartBottom = pos;
        });
        bus.$on('shopzIndex', (pos) => {
          this.shopZIndex = pos;
        });
      });
    });
  },
  watch: {
    posEndY() {
      let scTo = window.innerHeight - 214;
      if (this.tabScroll && this.posEndY >= -480) {
        this.tabScroll.scrollTo(0, -(this.tabBlockHei - scTo), 2000);
      } else if (this.tabScroll && this.posEndY < -480) {
        this.tabScroll.scrollTo(0, -(this.tabBlockHei), 2000);
      }
    },
    posTabY() {
      if (this.posTabY === -(this.tabBlockHei)) {
        this.appScroll.enable();
      } else {
        this.appScroll.disable();
      }
      if (this.posTabY >= -450) {
        this.shopcartBottom = -(this.posTabY + 450);
      }
    },
    posY() {
      this.$refs.ahead.changeRect();
      scrollToScaleOff(this.$refs.avatar, 20, this.posY);
      scrollToOpacityOn(this.$refs.inputbox, 20, this.posY);
      scrollToOpacityOff(this.$refs.avatar, 20, this.posY);
      if (this.posY === 0) {
        this.tabScroll.enable();
      } else {
        this.tabScroll.disable();
      }
      if (this.posY === -164 && this.posTabY === -(this.tabBlockHei)) {
        this.$refs.goods.enableScroll();
      } else {
        this.$refs.goods.disableScroll();
      }
      if (this.posY <= -10) {
        this.$refs.inputbox.style.zIndex = 20;
        this.$refs.avatar.style.zIndex = -100;
      } else {
        this.$refs.inputbox.style.zIndex = -100;
        this.$refs.avatar.style.zIndex = 20;
      }
    },
    tabCount() {
      switch (this.tabCount) {
        case 1:
          bus.$on('transw', (sw) => {
            if (sw === true) {
              this.tabScroll.enable();
              this.appScroll.enable();
            } else {
              this.tabScroll.disable();
              this.appScroll.disable();
            }
          });
          break;
        case 2:
          bus.$on('transr', (sr) => {
            if (sr === true) {
              this.tabScroll.enable();
              this.appScroll.enable();
            } else {
              this.tabScroll.disable();
              this.appScroll.disable();
            }
          });
          break;
        case 3:
          bus.$on('transs', (ss) => {
            if (ss === true) {
              this.tabScroll.enable();
              this.appScroll.enable();
            } else {
              this.tabScroll.disable();
              this.appScroll.disable();
            }
          });
          break;
      }
    },
    tabScroll() {
      this.tabScroll.on('scroll', (pos) => {
        this.posTabY = Math.floor(pos.y);
      });
      this.tabScroll.on('touchEnd', (pos) => {
        this.posEndY = Math.floor(pos.y);
      });
    },
    appScroll() {
      this.appScroll.on('scroll', (pos) => {
        this.posY = Math.floor(pos.y);
      });
    },
    showFood() {
      if (this.showFood) {
        this.shopZIndex = 20;
      } else {
        this.shopZIndex = 50;
        this.shopcartBottom = 0;
      }
    }
  },
  methods: {
    scrUp() {
      this.tabScroll.scrollTo(0, -(this.tabBlockHei), 2000);
    },
    toDetail(food, event) {
      this.foodDetail = food;
      this.showFood = true;
      this.$refs.fd._initFoodScroll();
    },
    doneSel(sel) {
      this.selectFood = sel;
    },
    clk() {
      this.showFood = false;
    },
    _initSc() {
      this.appScroll = new BScroll('.scroll-container', {
        probeType: 3,
        scrollY: true,
        tap: true,
        bounce: {
          top: false,
          bottom: false
        }
      });
      this.tabScroll = new BScroll('.tab-container', {
        probeType: 3,
        scrollY: true,
        startY: -(this.tabBlockHei),
        tap: true,
        bounce: {
          top: false,
          bottom: false
        }
      });
    }
  },
  components: {
    apphead,
    shopcart,
    goodsDetail
  },
  router
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import './common/stylus/mixin.styl';

@keyframes load
  0%
    margin-top: 25%;
    height: 45%;

  50%
    margin-top: 0%;
    height: 100%;

  100%
    margin-top: 25%;
    height: 45%;

@keyframes load2
  0%
    margin-top: 0%;
    height: 100%;

  50%
    margin-top: 25%;
    height: 45%;

  100%
    margin-top: 0%;
    height: 100%;

#app
  font-size: 0;
  touch-action: none;

  .banner
    position: relative;
    overflow: hidden;

    .inputbox
      width: 100%;
      height: 50px;
      line-height: 50px;
      position: absolute;
      z-index: -100;
      text-align: center;
      opacity: 0;
      font-size: 14px;

      .search
        width: 300px;
        height: 30px;
        z-index: -100;

    .bg
      width: 100%;
      height: 80px;
      filter: blur(10px);

    .avatar
      position: fixed;
      top: 30px;
      left: 50%;
      margin-left: -30px;
      z-index: 20;

      img
        border-radius: 4px;

  .scroll-container
    position: fixed;
    top: 50px;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .inner
      position: absolute;
      width: 100%;

      .block
        height: 30px;

      .apphead
        height: 134px;
        width: 100%;
        position: relative;

      .tab-container
        overflow: hidden;
        background: #fff;

        .tab-inner
          position: relative;

          .tab
            display: flex;
            width: 100%;
            height: 40px;
            line-height: 40px;
            background: #fff;
            // border-bottom :1px solid rgba(7,17,27,0.1)
            border-1px(rgba(7, 17, 27, 0.1));

            .tab-item
              flex: 1;
              display: inline-block;
              text-align: center;
              font-size: 14px;

              & > a
                display: block;
                color: rgb(77, 85, 93);

                &.active
                  color: rgb(240, 20, 20);

          .loading
            position: absolute;
            width: 100%;
            height: 100%;
            background: #fff;
            z-index: 20;

            .animate
              margin: 0 auto;
              padding-top: 100px;
              width: 45px;
              height: 40px;

              li
                display: block;
                width: 5px;
                height: 10%;
                background: white;
                margin-left: 10px;
                float: left;
                border-radius: 14px;
                margin-top: 35%;
                background: rgb(0, 160, 220);

                &:nth-child(1)
                  margin-left: 5px;
                  animation: load 2.5s infinite linear;

                &:nth-child(2)
                  animation: load2 2.5s infinite linear;

                &:nth-child(3)
                  animation: load 2.5s infinite linear;

            .loading-text
              width: 100px;
              padding-top: 15px;
              text-align: center;
              margin: 0 auto;
              font-size: 8px;
              letter-spacing: 2px;
              font-family: '黑体';

  .fade
    position: fixed;
    height: 100%;
    width: 100%;
    overflow: hidden;
    z-index: 25;
    top: 0;
    left: 0;
    background: rgba(7, 17, 27, 0.5);
    backdrop-filter: blur(10px);

    &.fdetail-enter-active, &.fdetail-leave-active
      transition: all 0.5s linear;
      transition-delay: 0.3s;

    &.fdetail-enter, &.fdetail-leave-active
      opacity: 0;

  .wrap
    position: fixed;
    height: 100%;
    width: 100%;
    overflow: hidden;
    z-index: 30;
    top: 0;
    left: 0;

    &.scroll-enter-active, &.scroll-leave-active
      transition: all 0.5s linear;

    &.scroll-enter, &.scroll-leave-active
      transform: translate3d(0, 100%, 0);
</style>
