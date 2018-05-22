<template>
  <div class="apphead" v-if="seller">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar" alt="avatar">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">{{seller.description}}/{{seller.deliveryTime}}分钟送达</div>
        <div class="supports" v-if="seller.supports">
          <span class="icon" :class="choise"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div class="support-count" v-if="seller.supports" @click="toggle">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin" @click="toggle">
      <span class="bul"></span><span class="bulText">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <transition name="detailcont">
      <div v-show="show" class="detail">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1 class="detail-tltle">{{seller.name}}</h1>
            <div class="star-wrapper">
              <stars :score="seller.score" :size="48"></stars>
            </div>
            <div class="title-wrapper">
              <detailtitle :content="'优惠信息'"></detailtitle>
            </div>
            <div class="sale">
              <div class="sale-item" v-for="sale in seller.supports" :key="sale.type">
                <span class="sale-icon" :class="sales[sale.type]"></span>
                <span class="sale-text">{{sale.description}}</span>
              </div>
            </div>
            <div class="title-wrapper">
              <detailtitle :content="'商家公告'"></detailtitle>
            </div>
            <div class="sale bull">
              {{seller.bulletin}}
            </div>
          </div>
        </div>
        <div class="detail-close" @click="toggle">
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import stars from '../stars/stars.vue';
import detailtitle from '../detail-title/detailtitle.vue';
export default {
  name: 'apphead',
  props: {
    'seller': {
      type: Object
    }
  },
  components: {
    stars,
    detailtitle
  },
  data() {
    return {
      num: 0,
      show: false,
      sales: ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    };
  },
  computed: {
    choise() {
      return this.sales[this.seller.supports[0].type];
    }
  },
  methods: {
    toggle() {
      this.show = !this.show;
    }
  }
};
</script>
<style lang="stylus">
@import '../../common/stylus/mixin.styl';

.apphead
  position: relative;
  background: rgba(7, 17, 27, 0.5);
  overflow: hidden;

  .content-wrapper
    position: relative;
    padding: 24px 12px 18px 24px;
    font-size: 0;
    color: rgba(7, 17, 27, 0.5);

    .avatar
      display: inline-block;
      vertical-align: top;

      img
        width: 64px;
        height: 64px;
        border-radius: 2px;

    .content
      display: inline-block;
      color: #ffffff;
      margin-left: 16px;

      .title
        margin: 2px 0 8px 0;

        .brand
          display: inline-block;
          vertical-align: top;
          width: 30px;
          height: 18px;
          bg-image('brand');
          background-size: 30px 18px;
          background-repeat: no-repeat;

        .name
          margin-left: 6px;
          font-size: 16px;
          font-weight: bold;
          line-height: 18px;

      .description
        margin-bottom: 10px;
        font-size: 12px;
        line-height: 12px;

      .supports
        .icon
          display: inline-block;
          vertical-align: top;
          margin-right: 4px;
          width: 12px;
          height: 12px;
          background-size: 12px 12px;
          background-repeat: no-repeat;

          &.decrease
            bg-image('decrease_1');

          &.discount
            bg-image('discount_1');

          &.guarantee
            bg-image('guarantee_1');

          &.invoice
            bg-image('invoice_1');

          &.special
            bg-image('special_1');

        .text
          font-size: 10px;
          line-height: 12px;

    .support-count
      position: absolute;
      right: 12px;
      bottom: 18px;
      padding: 0 8px;
      height: 24px;
      line-height: 24px;
      border-radius: 14px;
      color: #ffffff;
      background: rgba(0, 0, 0, 0.2);
      text-align: center;

      .count
        vertical-align: top;
        font-size: 10px;
        margin-left: 4px;

      .icon-keyboard_arrow_right
        font-size: 10px;
        line-height: 24px;

  .bulletin
    position: relative;
    height: 28px;
    line-height: 28px;
    padding: 0 22px 0 22px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background: rgba(7, 17, 27, 0.2);
    color: #ffffff;

    .bul
      display: inline-block;
      vertical-align: top;
      margin-top: 8px;
      width: 22px;
      height: 12px;
      bg-image('bulletin');
      background-size: 22px 12px;
      background-repeat: no-repeat;

    .bulText
      vertical-align: top;
      font-size: 10px;
      margin: 0 4px;

    .icon-keyboard_arrow_right
      position: absolute;
      right: 12px;
      top: 9px;
      font-size: 10px;

  .detail
    position: fixed;
    z-index: 100;
    width: 100%;
    height: 100%;
    overflow: auto;
    background: rgba(7, 17, 27, 0.8);
    backdrop-filter: blur(10px);
    top: 0;
    left: 0;

    .detail-wrapper
      min-height: 100%;
      width: 100%;

      .detail-main
        margin-top: 64px;
        padding-bottom: 64px;
        color: rgb(255, 255, 255);
        text-align: center;

        .detail-title
          text-align: center;
          font-size: 16px;
          font-weight: 700;
          line-height: 16px;

        .star-wrapper
          margin-top: 16px;
          padding: 2px 0;
          text-align: center;

        .title-wrapper
          margin-top: 28px;

        .sale
          margin: 24px 60px 0 60px;
          text-align: left;

          &.bull
            font-size: 12px;
            font-weight: 200;
            line-height: 24px;

          .sale-item
            height: 16px;
            vertical-align: top;
            margin-bottom: 12px;
            font-size: 0;

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
                bg-image('decrease_1');

              &.discount
                bg-image('discount_1');

              &.guarantee
                bg-image('guarantee_1');

              &.invoice
                bg-image('invoice_1');

              &.special
                bg-image('special_1');

            .sale-text
              display: inline-block;
              font-size: 12px;
              font-weight: 280;
              line-height: 12px;
              margin: 2px 0 0 6px;

    .detail-close
      position: relative;
      width: 32px;
      height: 32px;
      margin: -64px auto 0 auto;
      clear: both;
      font-size: 32px;
      color: rgba(255, 255, 255, 0.5);

  .detailcont-enter, .detailcont-leave-to
    opacity: 0;

  .detailcont-enter-to, .detailcont-leave
    opacity: 1;

  .detailcont-enter-active, .detailcont-leave-active
    transition: all 1s ease;
</style>
