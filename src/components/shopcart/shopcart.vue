<template>
    <div>
        <div class="shopcart" :style="{bottom:shopBottom+'px',zIndex:shopZIndex}">
            <div class="content">
                <div class="left">
                        <div class="icon" @click="listShow">
                            <div class="logo" :class="totalCount>0?'highlight':''">
                                <span class="icon-shopping_cart" :class="totalCount>0?'highlight':''"></span>
                            </div>
                            <div v-if="totalCount>0" class="count">{{totalCount}}</div>
                        </div>
                        <div class="content">
                            <span class="price" :class="totalCount>0?'highlight':''">￥{{totalPrice}}</span>
                            <span class="text">另需配送费￥{{deliverPrice}}元</span>
                        </div>
                </div>
                <div class="right" :class="exPrice<=0?'highlight':''">
                    <span v-if="exPrice===minPrice">￥{{minPrice}}起送</span>
                    <span v-else-if="exPrice>0 && exPrice<minPrice">还差￥{{exPrice}}起送</span>
                    <span v-else>去结算</span>
                </div>
            </div>
            <div class="ball-container">
                <div v-for="(ball,index) in balls" :key="index">
                    <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
                        <div class="ball" v-show="ball.show">
                            <div class="inner inner-hook"></div>
                        </div>
                    </transition>
                </div>
            </div>
            <transition name="content">
                <div class="cart-content" v-show="show">
                    <div class="cart-title border-1px">
                        <span class="title">购物车</span>
                        <span class="clear" @click="clearCart">清空</span>
                    </div>
                    <div class="cart-list">
                        <ul>
                            <li class="cart-item border-1px" v-for="(food,index) in selectFoods" :key="index">
                                <h1 class="item-title">{{food.name}}</h1>
                                <div class="control">
                                    <div class="price">
                                        <span class="sig">￥</span>
                                        <span class="num">{{food.price*food.count}}</span>
                                    </div>
                                    <div class="cartconcontrol-wrapper">
                                        <cartconcontrol @increment="addFood" :food="food"></cartconcontrol>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </transition>
        </div>
        <transition name="msk">
            <div class="mask" v-show="maskShow" @click="hideList"></div>
        </transition>
    </div>
</template>
<script>
import cartconcontrol from '../cartconcontrol/cartconcontrol';
import Vue from 'vue';
import BScroll from 'better-scroll';
export default {
    name: 'shopcart',
    data() {
        return {
            balls: [
                {
                    show: false
                },
                {
                    show: false
                },
                {
                    show: false
                },
                {
                    show: false
                },
                {
                    show: false
                }
            ],
            dropBalls: [],
            show: false,
            maskShow: false
        };
    },
    components: {
        cartconcontrol
    },
    props: {
        'deliver-price': {
            type: Number
        },
        'minPrice': {
            type: Number
        },
        selectFoods: {
            type: Array,
            default() {
                return [];
            }
        },
        shopBottom: {
            type: Number
        },
        shopZIndex: {
            type: Number
        }
    },
    computed: {
        totalPrice() {
            let total = 0;
            this.selectFoods.forEach((val, index) => {
                total += val.price * val.count;
            });
            return total;
        },
        totalCount() {
            let total = 0;
            this.selectFoods.forEach((val, index) => {
                total += val.count;
            });
            return total;
        },
        exPrice() {
            let ex = this.minPrice - this.totalPrice;
            return ex;
        }
    },
    methods: {
        hideList() {
            this.maskShow = this.show = false;
        },
        listShow() {
            if (!this.totalPrice) {
                return false;
            }
            this.show = !this.show;
            this.maskShow = this.show;
            if (this.show) {
                this.$nextTick(() => {
                    if (!this.scroll) {
                        this.scroll = new BScroll('.cart-list', {
                            click: true
                        });
                    } else {
                        this.scroll.refresh();
                    }
                });
            }
        },
        addFood(target) {
            this.drop(target);
        },
        clearCart() {
            this.maskShow = this.show = false;
            for (let val of this.selectFoods) {
                Vue.set(val, 'count', 0);
            }
        },
        beforeEnter(el) {
            this.balls.forEach(value => {
                if (value.show) {
                    let rect = value.el.getBoundingClientRect();
                    let x = rect.left - el.style.left - value.el.clientWidth;
                    let y = -(window.innerHeight - rect.top - el.style.bottom - value.el.clientHeight);
                    el.style.display = '';
                    el.style.webkitTransform = `translate3d(0,${y}px,0)`;
                    el.style.transform = `translate3d(0, ${y}px, 0)`;
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                    inner.style.transform = `translate3d(${x}px,0,0)`;
                }
            });
        },
        enter(el) {
            /* eslint-disable no-unused-vars */
            let rf = el.offsetHeight;
            this.$nextTick(() => {
                el.style.webkitTransform = 'translate3d(0,0,0)';
                el.style.transform = 'translate3d(0,0,0)';
                let inner = el.getElementsByClassName('inner-hook')[0];
                inner.style.webkitTransform = 'translate3d(0,0,0)';
                inner.style.transform = 'translate3d(0,0,0)';
            });
        },
        afterEnter(el) {
            let ball = this.dropBalls.shift();
            if (ball) {
                ball.show = false;
                el.style.display = 'none';
            }
        },
        drop(el) {
            this.balls.forEach(value => {
                if (!value.show) {
                    value.show = true;
                    value.el = el;
                    this.dropBalls.push(value);
                    return true;
                }
            });
        }
    }
};
</script>
<style lang="stylus" scoped rel="sheetstyle/stylus">
@import '../../common/stylus/mixin.styl';

.shopcart
    position: fixed;
    height: 48px;
    line-height: 48px;
    width: 100%;
    left: 0;
    bottom: 0;
    z-index: 50;

    // z-index: 50;
    .content
        display: flex;
        background: #141d27;
        font-size: 0;
        color: rgba(255, 255, 255, 0.4);

        .left
            flex: 1;

            .icon
                display: inline-block;
                position: relative;
                background: #141d27;
                border-radius: 50%;
                top: -10px;
                height: 56px;
                width: 56px;
                margin: 0 12px;
                box-sizing: border-box;
                padding: 6px;

                .logo
                    background: #2b343c;
                    width: 44px;
                    height: 44px;
                    text-align: center;
                    border-radius: 50%;

                    &.highlight
                        background: rgb(0, 160, 220);

                    .icon-shopping_cart
                        font-size: 24px;
                        line-height: 44px;
                        color: rgba(255, 255, 255, 0.4);

                        &.highlight
                            color: rgb(255, 255, 255);

                .count
                    position: absolute;
                    top: 2px;
                    right: 0;
                    z-index: 100;
                    width: 24px;
                    height: 16px;
                    border-radius: 15px;
                    font-family: '黑体';
                    font-size: 9px;
                    font-weight: 700;
                    color: rgb(255, 255, 255);
                    line-height: 16px;
                    background: rgb(240, 20, 20);
                    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.4);
                    text-align: center;

            .content
                height: 48px;
                display: inline-block;
                color: rgba(255, 255, 255, 0.4);
                vertical-align: top;
                box-sizing: border-box;

                .price
                    font-family: '黑体';
                    font-size: 16px;
                    font-weight: 700;
                    padding-right: 12px;
                    border-right: 1px solid rgba(255, 255, 255, 0.1);

                    &.highlight
                        color: rgb(255, 255, 255);

                .text
                    font-size: 14px;
                    font-weight: 200;
                    padding-left: 12px;

        .right
            flex: 0 0 105px;
            width: 105px;
            background: rgba(255, 255, 255, 0.4);
            text-align: center;
            font-family: '黑体';
            font-size: 12px;
            color: rgba(255, 255, 255, 0.4);
            font-weight: 700;

            &.highlight
                background: #00b43c;
                color: #fff;

    .ball-container
        .ball
            position: fixed;
            left: 32px;
            bottom: 22px;
            z-index: 200;
            transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);

            .inner
                width: 16px;
                height: 16px;
                border-radius: 100px;
                background: rgb(0, 160, 220);
                transition: all 0.4s linear;

    .cart-content
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        width: 100%;
        transform: translate3d(0, -100%, 0);

        &.content-enter-active, &.content-leave-active
            transition: all 0.5s;

        &.content-enter, &.content-leave-active
            transform: translate3d(0, 100%, 0);

        .cart-title
            display: flex;
            justify-content: space-between;
            height: 40px;
            line-height: 40px;
            background: #f3f5f7;
            padding: 0 18px;
            border-1px(rgba(7, 17, 27, 0.1));

            .title
                flex: 1;
                font-size: 14px;
                font-weight: 200;
                color: rgb(7, 17, 27);

            .clear
                flex: 0 0 24px;
                font-size: 12px;
                color: rgb(0, 160, 220);

        .cart-list
            background: #fff;
            width: 100%;
            max-height: 217px;
            overflow: hidden;

            .cart-item
                display: flex;
                justify-content: space-between;
                height: 48px;
                margin: 0 18px;
                border-1px(rgba(7, 17, 27, 0.1));

                &:last-child
                    border-none();

                .item-title
                    flex: 1;
                    font-size: 14px;
                    color: rgb(7, 17, 27);

                .control
                    flex: 0 0 120px;
                    display: flex;
                    justify-content: space-between;

                    .price
                        flex: 0 0 40px;
                        display: inline-block;
                        color: rgb(240, 20, 20);
                        height: 100%;

                        .sig
                            font-size: 10px;
                            font-weight: normal;

                        .num
                            font-size: 14px;
                            font-weight: 700;

                    .cartconcontrol-wrapper
                        flex: 0 0 84px;
                        height: 48px;
                        display: flex;
                        align-items: center;

.mask
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    backdrop-filter: blur(10px);
    background: rgba(7, 17, 27, 0.6);
    z-index: 40;

    &.msk-enter, &.msk-leave-active
        opacity: 0;

    &.msk-enter-active, &.msk-leave-active
        transition: all 0.5s linear;
</style>
