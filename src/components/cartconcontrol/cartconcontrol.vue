<template>
  <div class="cart-wrapper">
    <transition name="fade">
      <div class="sub"  @click="sub($event)" v-show="food.count>0">
        <div class="inner icon-remove_circle_outline"></div>
      </div>
    </transition>
    <div class="count" v-show="food.count>0">{{food.count}}</div>
    <div class="add icon-add_circle" @click.stop.prevent="add($event)"></div>
  </div>
</template>
<script>
import Vue from 'vue';
import FastClick from 'fastclick';
import bus from '../../common/bus/bus.js';
export default {
  name: 'cartconcontrol',
  props: {
    food: {
      type: Object
    }
  },
  data() {
    return {
      num: 0
    };
  },
  methods: {
    add(event) {
      FastClick.attach(event.target);
      if (!event._constructed) {
        // 去掉自带click事件的点击
        return;
      }
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1);
      } else {
        this.food.count++;
      }
      bus.$emit('increment', event.target);
    },
    sub(event) {
      if (!event._constructed) {
        // 去掉自带click事件的点击
        return;
      }
      this.food.count--;
    }
  }
};
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
.cart-wrapper
  font-size: 0;
  height: 36px;
  line-height: 36px;

  .sub, .add
    height: 24px;
    padding: 6px;
    display: inline-block;

    &.fade-enter-active, &.fade-leave-active
      transition: all 0.4s linear;

      &.fade-enter-active .inner, &.fade-leave-active .inner
        transition: all 0.4s linear;

    &.fade-enter, &.fade-leave-active
      opacity: 0;
      transform: translate3d(40px, 0, 0);

      &.fade-enter .inner, &.fade-leave-active .inner
        transform: rotate(180deg);

    .inner
      height: 100%;
      display: inline-block;
      font-size: 24px;
      line-height: 24px;
      text-align: center;
      color: rgb(0, 160, 220);

  .add
    display: inline-block;
    height: 24px;
    font-size: 24px;
    line-height: 24px;
    text-align: center;
    color: rgb(0, 160, 220);

  .count
    display: inline-block;
    height: 24px;
    font-family: '黑体';
    font-size: 10px;
    color: rgb(147, 153, 159);
    vertical-align: top;
    width: 12px;
    padding-top: 6px;
    line-height: 24px;
    text-align: center;
</style>
