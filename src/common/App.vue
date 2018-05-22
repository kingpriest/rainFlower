<template>
  <div id="app">
    <div class="bg">
      <img :src="seller.avatar" alt="bg" width="100%" height="80">
    </div>
    <div class="scroll-container">
      <div class="inner">
        <div class="block"></div>
        <apphead :seller="seller"></apphead>
        <div class="tab border-1px">
          <div class="tab-item">
            <router-link to="/goods">商品</router-link>
          </div>
          <div class="tab-item">
            <router-link to="/ratings">评论</router-link>
          </div>
          <div class="tab-item">
            <router-link to="/seller">商家</router-link>
          </div>
        </div>
        <router-view></router-view>
      </div>
    </div>
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
const ERR_OK = 0;
export default {
  name: 'App',
  data() {
    return {
      seller: {}
    };
  },
  created: function () {
    axios.get('/api/seller', {
      responseType: 'json'
    }).then((res) => {
      let response = res.data;
      if (response.errno === ERR_OK) {
        this.seller = response.data;
      }
    });
    this.$nextTick(() => {
      this.appScroll = new BScroll('.scroll-container', {
        scrollY: true
      });
    });
  },
  components: {
    apphead
  },
  router
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import './common/stylus/mixin.styl';

#app
  font-size: 0;

  .scroll-container
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;

    .inner
      height: 1000px;

  // .bg
  // position: absolute;
  // left: 0;
  // top: 0;
  // width: 100%;
  // height: 100%;
  // z-index: -1;
  // filter: blur(10px);
  .tab
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
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
</style>
