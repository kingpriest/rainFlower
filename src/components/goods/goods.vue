<template>
  <div class="goods">
    <div class="menu-wrapper">
      <ul>
        <li class="menu-item" v-for="(name,index) in goods" :key="index" :class="currentIndex===index?'on':'off'" @click="change(index,$event)">
          <span class="text border-1px">
            <span v-if="name.type>0" class="icon" :class="sales[name.type]"></span>
          {{name.name}}</span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper">
      <ul>
      <li class="food-list" v-for="(item,index) in goods" :key="index" v-pushToArr>
        <h1 class="title">{{item.name}}</h1>
        <ul>
          <li class="food-item" v-for="(food,index) in item.foods" :key="index">
            <div class="food-icon" @click="$emit('toDetail', food, $event)">
              <img width="57" height="57" :src="food.icon" :alt="food.name">
            </div>
            <div class="content">
              <h2 class="name">{{food.name}}</h2>
              <p class="desc">{{food.description}}</p>
              <div class="extra">
                <span class="sellout">月售{{food.sellCount}}份</span>
                <span class="rating">好评率{{food.rating}}%</span>
              </div>
              <div class="price">
                <span class="new-price">￥{{food.price}}</span><span v-show="food.oldPrice" class="old-price">￥{{food.oldPrice}}</span>
              </div>
              <div class="cartconcontrol">
                <cartconcontrol :food="food"></cartconcontrol>
              </div>
            </div>
          </li>
        </ul>
      </li>
      </ul>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import BScroll from 'better-scroll';
import cartconcontrol from '../cartconcontrol/cartconcontrol';
import bus from '../../common/bus/bus.js';
const ERR_OK = 0;
let heightArray = [];
let foodList = [];
export default {
  name: 'goods',
  components: {
    cartconcontrol
  },
  data() {
    return {
      goods: [],
      seller: [],
      sales: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
      heightArr: [],
      scrollY: 0,
      menuScroll: {},
      foodsScroll: {}
    };
  },
  created() {
    axios.get('/api').then((res) => {
      let response = res.data;
      if (response.errno === ERR_OK) {
        this.goods = response.data.goods;
        this.seller = response.data.seller;
        this.$nextTick(() => {
          this._initScroll();
          this._calHeight();
          bus.$on('increment', target => {
            bus.$emit('showSel', this.selectFood);
          });
        });
      }
    });
  },
  watch: {
    scrollY() {
      var sw = false;
      if (this.scrollY === 0) {
        sw = true;
      } else {
        sw = false;
      }
      bus.$emit('transw', sw);
    }
  },
  methods: {
    enableScroll() {
      this.menuScroll.enable();
      this.foodsScroll.enable();
    },
    disableScroll() {
      this.menuScroll.disable();
      this.foodsScroll.disable();
    },
    _initScroll() {
      this.menuScroll = new BScroll('.menu-wrapper', {
        probeType: 3,
        click: true,
        bounce: {
          top: false
        }
      });
      this.foodsScroll = new BScroll('.foods-wrapper', {
        probeType: 3,
        click: true,
        bounce: {
          top: false
        }
      });
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    _calHeight() {
      let height = 0;
      this.heightArr.push(height);
      heightArray.forEach((value, index) => {
        height += Number(value);
        this.heightArr.push(height);
      });
    },
    change(index, event) {
      let el = foodList[index];
      this.foodsScroll.scrollToElement(el, 300);
    }
  },
  directives: {
    pushToArr: {
      inserted(el) {
        heightArray.push(el.clientHeight);
        foodList.push(el);
      }
    }
  },
  computed: {
    currentIndex() {
      let arr = this.heightArr;
      for (let i = 0, len = arr.length; i < len; i++) {
        let heightS = arr[i];
        let heightL = arr[i + 1];
        if (!heightL || (this.scrollY >= heightS && this.scrollY < heightL)) {
          return i;
        }
      }
      return 0;
    },
    selectFood() {
      let result = [];
      this.goods.forEach((value, i) => {
        value.foods.forEach((val, index) => {
          if (val.count > 0) {
            result.push(val);
          }
        });
      });
      return result;
    }
  }
};
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl';

.goods
  display: flex;
  overflow: hidden;
  font-family: '黑体';

  .menu-wrapper
    flex: 0 0 80px;
    width: 80px;
    background: #f3f5f7;

    .menu-item
      height: 54px;
      display: table;
      width: 56px;
      line-height: 14px;
      padding: 0 12px;

      &.on
        background: white;
        margin-top: -1px;
        z-index: 100;

        .text
          font-weight: 700;
          border-none();

      .icon
        display: inline-block;
        vertical-align: top;
        margin-right: 2px;
        width: 12px;
        height: 12px;
        background-size: 12px 12px;
        background-repeat: no-repeat;

        &.decrease
          bg-image('decrease_3');

        &.discount
          bg-image('discount_3');

        &.guarantee
          bg-image('guarantee_3');

        &.invoice
          bg-image('invoice_3');

        &.special
          bg-image('special_3');

      .text
        display: table-cell;
        vertical-align: middle;
        font-size: 12px;
        color: rgb(240, 20, 20);
        font-weight: 200;
        border-1px(rgba(7, 17, 27, 0.1));

  .foods-wrapper
    flex: 1;

    .food-list
      background: #fff;

      .title
        height: 26px;
        padding-left: 14px;
        border-left: 2px solid #d9dde1;
        font-size: 12px;
        color: rgb(147, 153, 159);
        line-height: 26px;
        background: #f3f5f7;

      .food-item
        display: flex;
        margin: 18px;
        padding-bottom: 18px;
        border-1px(rgba(7, 17, 27, 0.1));

        &:last-child
          border-none();
          margin-bottom: 0;

        .food-icon
          flex: 0 0 57px;
          margin-right: 10px;

        .content
          flex: 1;

          .name
            font-size: 14px;
            color: rgb(7, 17, 27);
            line-height: 14px;
            margin-top: 2px;

          .desc, .extra
            margin-top: 8px;
            font-size: 10px;
            color: rgb(147, 153, 159);
            line-height: 12px;

          .extra
            .rating
              display: inline-block;
              margin-left: 12px;

          .price
            font-weight: 700;
            font-family: '黑体';

            .new-price
              font-size: 14px;
              color: rgb(240, 20, 20);
              line-height: 24px;
              margin-right: 8px;

            .old-price
              text-decoration: line-through;
              font-size: 10px;
              color: rgb(147, 153, 159);
              line-height: 24px;

          .cartconcontrol
            position: absolute;
            right: 0px;
            bottom: 12px;
</style>
