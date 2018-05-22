<template>
  <div ref="apphead" class="apphead" v-if="seller" :style="{height:height+ 'px'}">
    <div ref="icon" class="icon" @click="changeCol">
      <span class="icon-favorite" :class="changeColor"></span>
    </div>
    <div class="container" :style="{height:height-18+ 'px'}">
      <h1 class="title">{{seller.name}}</h1>
      <div ref="sTaps" class="small-taps">
        <span>
          <stars :score="seller.score" :size="24"></stars>
        </span>
        <span>{{seller.score}}</span>
        <span class="count">月售{{seller.sellCount}}</span>
        <span>{{seller.description}}约{{seller.deliveryTime}}分钟{{posTabY}}</span>
      </div>
      <ul ref="lTaps" class="large-taps">
        <li>
          <div class="tit">
            <stars :score="seller.score" :size="24"></stars>
          </div>
          <div class="cou">{{seller.score}}</div>
        </li>
        <li>
          <div class="tit">月售</div>
          <div class="cou">{{seller.sellCount}}</div>
        </li>
        <li>
          <div class="tit">约{{seller.deliveryTime}}分钟</div>
          <div class="cou">{{seller.description}}</div>
        </li>
        <li>
          <div class="tit">距离</div>
          <div class="cou">{{seller.distance}}km</div>
        </li>
      </ul>
      <div ref="bulletin" class="bulletin">
        <div ref="bulTitle" class="bul-title">
          <span class="line"></span>
          <span class="text">公告</span>
          <span class="line"></span>
        </div>
        <div ref="content" class="content" :class="showText">{{posTabY}}{{seller.bulletin}}</div>
      </div>
      <div ref="saleContent" class="sale-content">
        <div ref="saleTitle" class="sale-title">
          <span class="line"></span>
          <span class="text">优惠</span>
          <span class="line"></span>
        </div>
        <div class="salesCut" @click="getTicket">
          <img class="image" ref="image" width="20%" height="20%" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1526704795&di=089171c5e9dea22a232f2b2c86b00428&imgtype=jpg&er=1&src=http%3A%2F%2Fpicapi.zhituad.com%2Fphoto%2F140%2F07%2F79FFB.jpg">
        </div>
      </div>
      <div ref="sale" class="sale">
        <div class="sale-item" v-for="sale in seller.supports" :key="sale.type">
          <span class="sale-icon" :class="sales[sale.type]"></span>
          <span class="sale-text">{{sale.description}}</span>
        </div>
      </div>
      <div ref="arrow" class="up-arrow" @click.stop.prevent="scrollUp">
        <div class="icon-arrow_lift"></div>
      </div>
    </div>
  </div>
</template>
<script>
import stars from '../stars/stars.vue';
import detailtitle from '../detail-title/detailtitle.vue';
import bus from '../../common/bus/bus.js';
function scrollToOpacityOff(el, posY, posNow, posStart) {
  el.style.opacity = 1 - parseFloat((posNow - posStart) / posY).toFixed(2);
};
function scrollToOpacityOn(el, posY, posNow, posStart) {
  el.style.opacity = parseFloat((posNow - posStart) / posY).toFixed(2);
};
function scrollToScaleOff(el, posY, posNow, posStart) {
  if ((1 + posNow / posY) >= 0) {
    el.style.transform = `scale(${1 + posNow / posY})`;
  }
};
function scrollToScaleOn(el, posY, posNow, posStart) {
  let num = parseFloat((posNow - posStart) / posY).toFixed(1);
  el.style.transform = `scale(${1 + Number(num)})`;
};
function heightToProp(el, propStart, posNow, posStart, prop, speed) {
  var accr;
  if (speed !== void 0) {
    accr = speed;
  } else {
    accr = 1;
  }
  el.style[prop] = propStart + (posNow - posStart) * accr + 'px';
};
function toFixed(num, s) {
  var times = Math.pow(10, s);
  var des = num * times + 0.5;
  des = parseInt(des, 10) / times;
  return des;
};
export default {
  name: 'apphead',
  props: {
    'seller': {
      type: Object
    },
    posTabY: {
      type: Number
    },
    elHeight: {
      type: Number
    },
    posY: {
      type: Number
    },
    posEndY: {
      type: Number
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
      sales: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
      changeColor: 'icon-uncolor',
      showText: 'unshow'
    };
  },
  computed: {
    choise() {
      return this.sales[this.seller.supports[0].type];
    },
    height() {
      return this.elHeight + this.posTabY + 134;
    }
  },
  watch: {
    posTabY() {
      scrollToOpacityOff(this.$refs.sTaps, 60, this.posTabY, -this.elHeight);
      scrollToOpacityOn(this.$refs.lTaps, 60, this.posTabY, -this.elHeight);
      if (this.posTabY >= -this.elHeight + 50 && this.posTabY <= -this.elHeight + 90) {
        scrollToOpacityOn(this.$refs.bulTitle, 40, this.posTabY, -this.elHeight + 50);
        heightToProp(this.$refs.bulletin, -15, this.posTabY - 50, -this.elHeight, 'top');
        heightToProp(this.$refs.content, 20, this.posTabY - 50, -this.elHeight, 'height');
        if (this.posTabY >= -this.elHeight + 70) {
          this.showText = 'show';
        } else {
          this.showText = 'unshow';
        }
      }
      if (this.posTabY >= -this.elHeight + 60 && this.posTabY <= -this.elHeight + 110) {
        scrollToOpacityOn(this.$refs.saleTitle, 50, this.posTabY, -this.elHeight + 60);
        heightToProp(this.$refs.saleContent, -32, this.posTabY - 60, -this.elHeight, 'top');
      }
      if (this.posTabY >= -this.elHeight + 110 && this.posTabY <= -this.elHeight + 140) {
        scrollToScaleOn(this.$refs.image, 30, this.posTabY, -this.elHeight + 110);
      }
      if (this.posTabY >= -this.elHeight + 60 && this.posTabY <= -this.elHeight + 140) {
        heightToProp(this.$refs.sale, -30, this.posTabY - 60, -this.elHeight, 'top');
      }
      if (this.posTabY >= -this.elHeight + 260 && this.posTabY <= -this.elHeight + 360) {
        scrollToOpacityOn(this.$refs.arrow, 50, this.posTabY, -this.elHeight + 260);
      } else if (this.posTabY < -this.elHeight + 260) {
        this.$refs.arrow.style.opacity = 0;
      } else {
        this.$refs.arrow.style.opacity = 1;
      }
    }
  },
  methods: {
    scrollUp() {
      this.$emit('scrUp');
    },
    getTicket() {
      alert('优惠券领取成功！');
    },
    toggle() {
      this.show = !this.show;
    },
    changeCol() {
      this.changeColor = (this.changeColor === 'icon-uncolor') ? 'icon-colored' : 'icon-uncolor';
    },
    changeRect() {
      scrollToOpacityOff(this.$refs.icon, 20, this.posY);
      scrollToScaleOff(this.$refs.icon, 20, this.posY);
    }
  }
};
</script>
<style lang="stylus">
@import '../../common/stylus/mixin.styl';

@keyframes scal
  0%
    transform: scale(1);

  50%
    transform: scale(1.5);

  100%
    transform: scale(1);

.apphead
  background: #fff;
  width: 100%;
  color: black;
  text-align: center;

  .icon
    font-size: 20px;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    background: #FFF;
    border-radius: 50%;
    right: 10px;
    top: -15px;
    z-index: 100;

    .icon-uncolor
      color: pink;

    .icon-colored
      color: red;

  .container
    padding: 18px 18px 0 18px;
    position: relative;

    .title
      font-size: 16px;
      font-weight: 700;
      padding-bottom: 12px;
      letter-spacing: 2px;

    .small-taps
      font-size: 10px;
      padding-bottom: 4px;

      span
        display: inline-block;

        &.count
          padding: 0 10px;

    .large-taps
      position: absolute;
      top: 46px;
      left: 50%;
      margin-left: -106px;
      opacity: 0;

      li
        display: inline-block;
        padding-right: 10px;

        &:last-child
          padding-right: 0;

        .tit
          font-size: 12px;
          color: rgba(7, 17, 27, 0.5);
          padding-bottom: 4px;

        .cou
          font-family: '黑体';
          font-size: 14px;
          font-weight: 400;

    .bulletin
      position: relative;
      top: -15px;

      .bul-title
        display: flex;
        justify-content: space-between;
        width: 60px;
        margin: 0 auto;
        opacity: 0;
        padding-bottom: 6px;

        .text
          flex: 0 0 30px;
          font-size: 10px;
          font-weight: 400;
          text-align: center;
          padding: 0 2px;

        .line
          flex: 1;
          display: inline-block;
          height: 4px;
          border-bottom: 2px solid rgba(7, 17, 27, 0.1);

      .content
        font-size: 10px;
        height: 20px;
        line-height: 20px;
        color: rgba(7, 17, 27, 0.5);
        overflow: hidden;
        padding-bottom: 4px;
        text-align: left;

        &.unshow
          white-space: nowrap;
          text-overflow: ellipsis;

        &.show
          font-size: 10px;

    .sale-content
      position: relative;
      top: -32px;

      .sale-title
        display: flex;
        justify-content: space-between;
        width: 60px;
        margin: 0 auto;
        opacity: 0;
        padding-bottom: 6px;

        .text
          flex: 0 0 30px;
          font-size: 10px;
          font-weight: 400;
          text-align: center;
          padding: 0 2px;

        .line
          flex: 1;
          display: inline-block;
          height: 4px;
          border-bottom: 2px solid rgba(7, 17, 27, 0.1);

      .salesCut
        .image
          transform-origin: top center;

    .sale
      position: relative;
      text-align: left;
      top: -30px;

      &.bull
        font-size: 12px;
        font-weight: 200;
        line-height: 24px;

      .sale-item
        height: 16px;
        vertical-align: top;
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

    .up-arrow
      position: absolute;
      bottom: 10px;
      left: 50%;
      margin-left: -15px;
      width: 100%;
      font-size: 20px;
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      opacity: 0;

      .icon-arrow_lift
        transform: rotate(90deg);
        height: 30px;
        line-height: 30px;
        color: rgba(7, 17, 27, 0.5);
</style>
