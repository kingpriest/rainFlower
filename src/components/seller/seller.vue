<template>
  <div class="seller-wrapper">
    <div class="seller-content">
      <div class="shopInfo border-1px">
        <div class="shopname-content border-1px">
          <div class="shop-title">
            <h1 class="shopname">{{seller.name}}</h1>
            <div class="sell-count">
              <stars class="sell-star" :size="36" :score="seller.score"></stars>
              <span class="count">月售{{seller.sellCount}}单</span>
            </div>
          </div>
          <div class="heart">
            <div class="icon-favorite"></div>
            <div class="text">已收藏</div>
          </div>
        </div>
        <ul class="shop-ulist">
          <li>
            <div class="title">起送价</div>
            <div class="price">
              <span class="pri">{{seller.minPrice}}</span>
              <span class="pri-text">元</span>
            </div>
          </li>
          <li>
            <div class="title">商家配送</div>
            <div class="price">
              <span class="pri">{{seller.deliveryPrice}}</span>
              <span class="pri-text">元</span>
            </div>
          </li>
          <li>
            <div class="title">平均配送时间</div>
            <div class="price">
              <span class="pri">{{seller.deliveryTime}}</span>
              <span class="pri-text">分钟</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="strap border-1px"></div>
      <div class="bulletin-active border-1px">
        <div class="bulletin border-1px">
          <h1 class="bull-title">公告与活动</h1>
          <div class="bull-content">{{seller.bulletin}}</div>
        </div>
        <div ref="sale" class="sale">
          <div class="sale-item border-1px" v-for="sale in seller.supports" :key="sale.type">
            <span class="sale-icon" :class="sales[sale.type]"></span>
            <span class="sale-text">{{sale.description}}</span>
          </div>
        </div>
      </div>
      <div class="strap border-1px"></div>
      <div class="pics border-1px">
        <div class="pics-title">商家实景</div>
        <div class="pics-container">
          <ul class="pics-ulist">
            <li class="pics-list" v-for="(item, index) in seller.pics" :key="index">
              <img :src="item" width="100px" height="100px">
            </li>
          </ul>
        </div>
      </div>
      <div class="strap border-1px"></div>
      <div class="seller-infos">
        <h1 class="seller-title border-1px">商家信息</h1>
        <ul class="seller-ulist">
          <li class="seller-list border-1px" v-for="(item, index) in seller.infos" :key="index">{{item}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import stars from '../stars/stars.vue';
import axios from 'axios';
import BScroll from 'better-scroll';
import bus from '../../common/bus/bus.js';
const ERR_OK = 0;
function toFixed(num, s) {
  var times = Math.pow(10, s);
  var des = num * times + 0.5;
  des = parseInt(des, 10) / times;
  return des;
};
export default {
  name: 'seller',
  components: {
    stars
  },
  methods: {
    format(date, fmt) {
      var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds()
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
      }
      return fmt;
    },
    _initScroll() {
      if (!this.scroll) {
        this.scroll = new BScroll('.seller-wrapper', {
          probeType: 3,
          click: true,
          bounce: {
            top: false
          }
        });
      } else {
        this.scroll.refresh();
      }
      this.scroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
      if (!this.sellerScroll) {
        this.sellerScroll = new BScroll('.pics-container', {
          probeType: 3,
          click: true,
          scrollX: true,
          bounce: {
            left: false,
            right: false
          }
        });
      } else {
        this.sellerScroll.refresh();
      }
    },
    enableScroll() {
      this.scroll.enable();
    },
    disableScroll() {
      this.scroll.disable();
    }
  },
  data() {
    return {
      seller: [],
      scrollY: 0,
      scroll: null,
      sales: ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    };
  },
  watch: {
    scrollY() {
      var ss = false;
      if (this.scrollY === 0) {
        ss = true;
      } else {
        ss = false;
      }
      bus.$emit('transs', ss);
    }
  },
  created() {
    axios.get('http://47.95.250.189/api/seller').then((res) => {
      let response = res.data;
      if (response.errno === ERR_OK) {
        this.seller = response.data;
        this.$nextTick(() => {
          this._initScroll();
        });
      }
    });
  }
};
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl';

.seller-wrapper
  overflow: hidden;
  background: #fff;
  font-family: '黑体';

  .seller-content
    .shopInfo
      padding: 18px 18px;
      border-1px(rgba(7, 17, 27, 0.1));

      .shopname-content
        display: flex;
        padding-bottom: 18px;
        border-1px(rgba(7, 17, 27, 0.1));

        .shop-title
          flex: 1;

          .shopname
            font-size: 14px;
            color: rgb(7, 17, 27);
            padding-bottom: 8px;

          .sell-count
            display: flex;
            align-items: center;

            .sell-star
              display: inline-block;
              padding-right: 12px;

            .count
              display: inline-block;
              font-size: 10px;
              color: rgb(77, 85, 93);

        .heart
          flex: 0 0 40px;
          text-align: center;

          .icon-favorite
            text-align: center;
            color: rgb(240, 20, 20);
            font-size: 24px;
            padding-bottom: 4px;

          .text
            font-size: 10px;
            color: rgb(77, 85, 93);

      .shop-ulist
        display: flex;
        padding-top: 18px;

        li
          flex: 1;
          display: inline-block;
          border-right: 1px solid rgba(7, 17, 27, 0.1);
          text-align: center;

          &:last-child
            border-right: 0;

          .title
            font-size: 10px;
            color: rgb(147, 153, 159);
            padding-bottom: 4px;

          .price
            font-weight: 200;
            color: rgb(7, 17, 27);

            .pri
              font-size: 24px;

            .pri-text
              font-size: 10px;

    .strap
      height: 16px;
      background: #f3f5f7;
      border-1px(rgba(7, 17, 27, 0.1));

    .bulletin-active
      padding: 18px 18px 0 18px;
      border-1px(rgba(7, 17, 27, 0.1));

      .bulletin
        padding-bottom: 16px;
        border-1px(rgba(7, 17, 27, 0.1));

        .bull-title
          font-size: 14px;
          color: rgb(7, 17, 27);
          padding-bottom: 8px;

        .bull-content
          padding: 0 12px;
          font-size: 12px;
          font-weight: 200;
          color: rgb(240, 20, 20);
          line-height: 24px;

      .sale
        position: relative;
        text-align: left;

        .sale-item
          height: 16px;
          vertical-align: top;
          font-size: 0;
          border-1px(rgba(7, 17, 27, 0.1));
          padding: 16px 12px;

          &:last-child
            border-none();

          &:last-child
            margin-bottom: 0px;

          .sale-icon
            display: inline-block;
            vertical-align: top;
            width: 16px;
            height: 16px;
            background-size: 16px 16px;
            background-repeat: no-repeat;

            &.decrease
              bg-image('decrease_4');

            &.discount
              bg-image('discount_4');

            &.guarantee
              bg-image('guarantee_4');

            &.invoice
              bg-image('invoice_4');

            &.special
              bg-image('special_4');

          .sale-text
            display: inline-block;
            font-size: 12px;
            font-weight: 280;
            line-height: 12px;
            margin: 2px 0 0 6px;

    .pics
      padding: 18px;
      border-1px(rgba(7, 17, 27, 0.1));

      .pics-title
        font-size: 14px;
        color: rgb(7, 17, 27);
        padding-bottom: 12px;

      .pics-container
        position: relative;
        width: 100%;
        overflow: hidden;

        .pics-ulist
          display: flex;
          height: 100px;
          width: 450px;

          .pics-list
            flex: 1;
            display: inline-block;

    .seller-infos
      padding: 18px;

      .seller-title
        font-size: 14px;
        color: rgb(7, 17, 27);
        padding-bottom: 12px;
        border-1px(rgba(7, 17, 27, 0.1));

      .seller-ulist
        .seller-list
          padding: 16px 12px;
          font-size: 12px;
          font-weight: 200;
          color: rgb(7, 17, 27);
          border-1px(rgba(7, 17, 27, 0.1));
</style>
