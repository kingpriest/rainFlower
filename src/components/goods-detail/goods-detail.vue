<template>
    <div class="wrapper">
        <div ref="det" class="detail">
            <div ref="sky" :style="{height:height,width:width}"></div>
            <div class="image">
                <div class="icon" @click="close">
                    <span class="icon-close"></span>
                </div>
                <img ref="image" :src="food.image" width="100%" height="100%">
            </div>
            <div ref="content" class="content border-1px">
                <h1 class="title">{{food.name}}</h1>
                <div class="ratings">
                    <span class="sell-count">月售{{food.sellCount}}份</span>
                    <span class="rating">好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol">
                    <cartconcontrol @increment="add" :food="food"></cartconcontrol>
                </div>
            </div>
            <div ref="arrow" class="arrow" @click="scrollUp($event)">
                <div class="icon-arrow_lift"></div>
            </div>
            <div class="ratingWrapper">
                <div ref="ratWrapper" class="container">
                    <div class="rating-content border-1px">
                        <div class="rating-option">
                            <h1 class="rating-title">商品评价</h1>
                            <ul class="btn-group border-1px">
                                <li class="btn" v-for="(item, index) in btnArr" :class="index===2?'btn-b':'btn-g'" :key="index">
                                    <span class="name">{{item.name}}</span>
                                    <span class="count">{{count(index)}}</span>
                                </li>
                            </ul>
                        </div>
                        <div class="rating-selector">
                            <span class="icon-check_circle"></span>
                            <span class="text">只看有评价的内容</span>
                        </div>
                    </div>
                    <ul class="rating-list">
                        <li class="rating-item border-1px" v-for="(item,index) in food.ratings" :key="index">
                            <div class="user-time">
                                <span class="time">{{format(new Date(item.rateTime),'yyyy-MM-dd  hh:mm')}}</span>
                                <div class="user">
                                    <span class="username">{{item.username}}</span>
                                    <img class="rating-icon" src="item.avatar" alt="icon" width="12" height="12">
                                </div>
                            </div>
                            <div class="rating-cont border-1px">
                                <span v-show="item.rateType===0" class="icon-thumb_up"></span>
                                <span v-show="item.rateType===1" class="icon-thumb_down"></span>
                                <span v-show="item.text" class="text">{{item.text}}</span>
                            </div>
                        </li>
                    </ul>
                    <div class="rating-block"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import cartconcontrol from '../cartconcontrol/cartconcontrol';
import BScroll from 'better-scroll';
import bus from '../../common/bus/bus.js';
// function scrollToOpacityOff(el, posY, posNow) {
//     el.style.opacity = 1 + (posNow / posY);
// };
// function scrollToOpacityOn(el, posY, posNow) {
//     el.style.opacity = 0 - (posNow / posY);
// };
function scrollToOpacityOff(el, posY, posNow, posStart) {
    el.style.opacity = 1 - parseFloat((posNow - posStart) / posY).toFixed(2);
};
function scrollToOpacityOn(el, posY, posNow, posStart) {
    el.style.opacity = parseFloat((posNow - posStart) / posY).toFixed(2);
};
function toFixed(num, s) {
    var times = Math.pow(10, s);
    var des = num * times + 0.5;
    des = parseInt(des, 10) / times;
    return des;
};
function scrollToPosition(el, posY) {
};
let windowH = window.innerHeight;
var elH = 0;
export default {
    name: 'goods-detail',
    data() {
        return {
            touchY: 0,
            num: 0,
            foodScroll: {},
            foodRating: {},
            curr: {},
            width: '100%',
            height: window.innerHeight - window.innerWidth - 130 + 'px',
            posY: 0,
            ratPosY: 0,
            good: 0,
            bad: 0,
            btnArr: [
                {
                    name: '全部'
                },
                {
                    name: '推荐'
                },
                {
                    name: '吐槽'
                }
            ],
            scrollHeight: window.innerHeight - window.innerWidth - 130,
            positionY: 0
        };
    },
    props: {
        food: {
            type: Object
        },
        showFood: {
            type: Boolean
        }
    },
    components: {
        cartconcontrol
    },
    methods: {
        count(index) {
            switch (index) {
                case 0:
                    return this.goodRating + this.badRating;
                case 1:
                    return this.goodRating;
                case 2:
                    return this.badRating;
            }
        },
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
        scrollUp(event) {
            this.curr.scrollTo(0, -(this.scrollHeight), 1000);
            scrollToOpacityOff(event.target, this.scrollHeight, this.posY);
            scrollToOpacityOn(this.$refs.ratWrapper, this.scrollHeight, this.posY);
        },
        _initFoodScroll() {
            this.$nextTick(() => {
                elH = window.getComputedStyle(this.$refs.det).height;
                var u = navigator.userAgent;
                var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
                this.$refs.arrow.style.opacity = 1;
                // console.log(u);
                // if (u.indexOf('Chrome') > -1) {
                //     this.scrollHeight = Math.floor(elH.substr(0, 3)) - window.innerHeight;
                //     console.log(elH);
                // } else if (isiOS) {
                //     this.scrollHeight = Math.floor(elH.substr(0, 3)) - window.innerHeight;
                // }
                this.foodScroll = new BScroll('.wrapper', {
                    probeType: 3,
                    click: true,
                    scrollY: true,
                    bounce: {
                        bottom: false
                    }
                });
                this.foodRating = new BScroll('.ratingWrapper', {
                    probeType: 3,
                    click: true,
                    bounce: {
                        top: false
                    }
                });
                this.foodScroll.on('scroll', (pos) => {
                    this.posY = Math.floor(pos.y);
                });
                this.foodScroll.on('touchEnd', (pos) => {
                    this.touchY = Math.floor(pos.y);
                });
                this.foodRating.on('scroll', (pos) => {
                    this.ratPosY = Math.floor(pos.y);
                });
            });
        },
        add(target) {
            this.$emit('increDetail', target);
        },
        close() {
            this.$emit('clk');
            this.curr.destroy();
        }
    },
    computed: {
        goodRating() {
            var count = 0;
            for (let val in this.food.ratings) {
                if (this.food.ratings[val].rateType === 0) {
                    count++;
                }
            }
            return count;
        },
        badRating() {
            var count = 0;
            for (let val in this.food.ratings) {
                if (this.food.ratings[val].rateType === 1) {
                    count++;
                }
            }
            return count;
        }
    },
    watch: {
        foodScroll() {
            this.curr = this.foodScroll;
        },
        touchY() {
            if (this.touchY > 80) {
                this.close();
            } else if (this.touchY < 0 && this.touchY > -(this.scrollHeight - 58)) {
                this.foodScroll.scrollTo(0, 0, 1300);
            } else if (this.touchY <= -(this.scrollHeight - 58) && this.touchY > -(this.scrollHeight)) {
                this.foodScroll.scrollTo(0, -(this.scrollHeight), 1300);
            }
        },
        posY() {
            scrollToOpacityOff(this.$refs.arrow, 50, 0, this.posY);
            scrollToOpacityOn(this.$refs.ratWrapper, 50, 0, this.posY);
            let sub = windowH - Math.floor(elH.substr(0, 3));
            if (this.posY === sub) {
                this.foodRating.enable();
            } else {
                this.foodRating.disable();
            }
            let shopChgBottom = -62;
            let shopzIndex = 50;
            if (this.posY <= -(this.scrollHeight - 62) && this.posY >= -(this.scrollHeight)) {
                shopChgBottom += -(this.posY + (this.scrollHeight - 62));
            } else if (this.posY < -(this.scrollHeight)) {
                shopChgBottom = 0;
            } else if (this.posY > -(this.scrollHeight - 62)) {
                shopChgBottom = -62;
            }
            bus.$emit('shopBottom', shopChgBottom);
            bus.$emit('shopzIndex', shopzIndex);
        },
        ratPosY() {
            if (this.ratPosY === 0) {
                this.foodScroll.enable();
            } else {
                this.foodScroll.disable();
            }
        }
    }
};
</script>
<style lang="stylus" scoped ref="stylesheet/stylus">
@import '../../common/stylus/mixin.styl';

.wrapper
    .detail
        width: 100%;
        font-size: 0;

        .image
            position: relative;

            .icon
                position: absolute;
                display: flex;
                align-items: center;
                text-align: center;
                border-radius: 50%;
                height: 24px;
                width: 24px;
                color: #fff;
                background: rgba(0, 0, 0, 0.5);
                top: 8px;
                right: 8px;

                .icon-close
                    flex: 1;
                    font-size: 18px;

        .content
            position: relative;
            padding: 18px;
            border-1px(rgba(7, 17, 27, 0.1));
            background: #fff;

            .title
                font-size: 14px;
                font-weight: 700;
                color: rgb(7, 17, 27);
                line-height: 14px;

            .ratings
                font-size: 10px;
                color: rgb(147, 153, 159);
                line-height: 10px;
                padding: 8px 0px 18px 0px;

            .price
                .now
                    font-size: 14px;
                    font-weight: 700;
                    color: rgb(240, 20, 20);

                .old
                    font-size: 10px;
                    font-weight: normal;
                    color: rgb(147, 153, 159);
                    text-decoration: line-through;

            .cartcontrol
                position: absolute;
                height: 36px;
                right: 0;
                bottom: 0;

        .arrow
            position: fixed;
            width: 100%;
            font-size: 20px;
            height: 30px;
            width: 30px;
            left: 50%;
            margin-left: -15px;
            line-height: 30px;
            text-align: center;
            z-index: 45;
            opacity: 1;

            .icon-arrow_lift
                transform: rotate(90deg);
                height: 30px;
                line-height: 30px;
                color: rgba(7, 17, 27, 0.5);

        .ratingWrapper
            background: #fff;
            height: 300px;
            overflow: hidden;

            .container
                background: #fff;

                .rating-content
                    border-1px(rgba(7, 17, 27, 0.1));

                    .rating-option
                        padding: 18px 18px 0px 18px;

                        .rating-title
                            font-size: 18px;
                            font-weight: 700;
                            padding-bottom: 18px;

                        .btn-group
                            padding-bottom: 18px;
                            border-1px(rgba(7, 17, 27, 0.1));

                            .btn
                                display: inline-block;
                                width: 50px;
                                height: 32px;
                                line-height: 32px;
                                text-align: center;
                                vertical-align: bottom;
                                border-radius: 2px;
                                margin-right: 8px;

                                &:last-child
                                    margin-right: 0;

                                &.btn-g
                                    background: rgba(0, 160, 220, 0.2);

                                &.btn-b
                                    background: rgba(77, 85, 93, 0.2);

                                .name
                                    font-size: 12px;
                                    color: rgb(77, 85, 93);

                                .count
                                    font-size: 8px;
                                    color: rgb(77, 85, 93);

                    .rating-selector
                        display: flex;
                        align-items: center;
                        height: 48px;
                        padding: 0 18px;

                        .icon-check_circle
                            display: inline-block;
                            font-size: 24px;
                            color: rgb(147, 153, 159);

                        .text
                            display: inline-block;
                            font-size: 12px;
                            color: rgb(147, 153, 159);
                            padding-left: 4px;

                .rating-list
                    padding: 0 18px;

                    .rating-item
                        padding-top: 16px;
                        border-1px(rgba(7, 17, 27, 0.1));

                        &:last-child
                            border-none();

                        .user-time
                            font-size: 10px;
                            color: rgb(147, 153, 159);
                            padding-bottom: 10px;
                            height: 10px;

                            .time
                                float: left;

                            .user
                                float: right;

                        .rating-cont
                            padding-bottom: 16px;

                            .icon-thumb_up
                                font-size: 12px;
                                color: rgb(0, 160, 220);

                            .icon-thumb_down
                                font-size: 12px;
                                color: rgb(147, 153, 159);

                            .text
                                font-size: 12px;
                                padding-left: 4px;
                                color: rgb(7, 17, 27);

                .rating-block
                    height: 62px;
</style>
