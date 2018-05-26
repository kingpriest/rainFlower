<template>
  <div class="wrapper">
    <div class="ratings-wrapper">
      <div class="ratings-content">
        <div class="score-container border-1px">
          <div class="left">
            <div class="score">{{averScore}}</div>
            <div class="rat">综合评分</div>
            <div class="upText">高于周边商家69.2%</div>
          </div>
          <div class="right">
            <div class="service">
              <div class="serTitle">服务态度</div>
              <stars :size="36" :score="Number(averScore)"></stars>
            </div>
            <div class="products">
              <div class="proTitle">商品评价</div>
              <div class="star-container">
                <stars :size="36" :score="Number(averScore)"></stars>
              </div>
            </div>
            <div class="delTime">
              <div class="text">送达时间</div>
              <div class="time">33分钟</div>
            </div>
          </div>
        </div>
        <div class="strap border-1px"></div>
      </div>
      <div class="ratings-container">
        <div class="rating-content border-1px">
          <div class="rating-option">
              <ul class="btn-group border-1px">
                <li class="goodRat">
                  <span class="btn-title">全部</span>
                  <div class="btn-num">{{allRat}}</div>
                </li>
                <li class="goodRat">
                  <span class="btn-title">满意</span>
                  <div class="btn-num">{{good}}</div>
                </li>
                <li class="badRat">
                  <span class="btn-title">不满意</span>
                  <div class="btn-num">{{bad}}</div>
                </li>
              </ul>
          </div>
          <div class="rating-selector">
              <span class="icon-check_circle"></span>
              <span class="text">只看有评价的内容</span>
          </div>
        </div>
        <ul class="comment">
          <li v-for="(item, index) in ratings" :key="index" class="border-1px">
            <div class="avata">
              <div class="icon">
                <img :src="item.avatar" width="28" height="28">
              </div>
              <div class="user">
                <div class="username">{{item.username}}{{scrollY}}</div>
                <div class="rating-star">
                  <stars class="star" :size="24" :score="item.score"></stars>
                  <span v-if="item.deliveryTime" class="deliveryTime">{{item.deliveryTime}}分钟送达</span>
                </div>
              </div>
              <div class="time">{{format(new Date(item.rateTime),'yyyy-MM-dd  hh:mm')}}</div>
            </div>
            <div class="text">{{item.text}}</div>
            <div class="thumb">
              <span v-if="item.rateType===0" class="icon-thumb_up"></span>
              <span v-if="item.rateType===1" class="icon-thumb_down"></span>
              <span class="recommend" v-for="(type, idx) in item.recommend" :key="idx">{{type}}</span>
            </div>
          </li>
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
  name: 'ratings',
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
        this.scroll = new BScroll('.wrapper', {
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
      ratings: [],
      scrollY: -1,
      scroll: null
    };
  },
  watch: {
    scrollY() {
      var sr = false;
      if (this.scrollY === 0) {
        sr = true;
      } else {
        sr = false;
      }
      bus.$emit('transr', sr);
    }
  },
  created() {
    axios.get('http://47.95.250.189/api/ratings').then((res) => {
      let response = res.data;
      if (response.errno === ERR_OK) {
        this.ratings = response.data;
        this.$nextTick(() => {
          this._initScroll();
        });
      }
    });
  },
  computed: {
    averScore() {
      var add = 0;
      this.ratings.forEach(value => {
        add += value.score;
      });
      var result = add / this.ratings.length;
      return result.toFixed(1);
    },
    allRat() {
      return this.ratings.length;
    },
    good() {
      var add = 0;
      this.ratings.forEach(value => {
        if (value.rateType === 0) {
          add++;
        }
      });
      return add;
    },
    bad() {
      return this.allRat - this.good;
    }
  }
};
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl';

.wrapper
  overflow: hidden;
  font-family: '黑体';

  .ratings-wrapper
    background: #fff;

    .ratings-content
      .score-container
        display: flex;
        padding: 18px 24px;
        border-1px(rgba(7, 17, 27, 0.1));

        .left
          flex: 0 0 137px;
          text-align: center;
          border-right: 1px solid rgba(7, 17, 27, 0.1);

          .score
            font-size: 24px;
            color: rgb(255, 153, 0);
            padding-bottom: 6px;

          .rat
            font-size: 12px;
            padding-bottom: 8px;

          .upText
            font-size: 10px;
            color: rgba(7, 17, 27, 0.2);
            padding-bottom: 6px;

        .right
          flex: 1;
          padding-left: 24px;

          .service
            padding-bottom: 8px;
            display: flex;
            align-items: center;

            .serTitle
              flex: 0 0 48px;
              display: inline-block;
              padding-right: 12px;
              font-size: 12px;
              color: rgb(7, 17, 27);

            .star-container
              flex: 1;
              display: inline-block;

          .products
            padding-bottom: 8px;
            display: flex;
            align-items: center;

            .proTitle
              flex: 0 0 48px;
              display: inline-block;
              padding-right: 12px;
              font-size: 12px;
              color: rgb(7, 17, 27);

            .star-container
              flex: 1;
              display: inline-block;

          .delTime
            display: flex;
            align-items: center;

            .text
              flex: 0 0 48px;
              display: inline-block;
              padding-right: 12px;
              font-size: 12px;
              color: rgb(7, 17, 27);

            .time
              font-size: 12px;
              color: rgb(147, 153, 159);

      .strap
        height: 16px;
        background: #f3f5f7;
        border-1px(rgba(7, 17, 27, 0.1));

    .ratings-container
      .rating-content
        padding: 18px 18px 0 18px;
        border-1px(rgba(7, 17, 27, 0.1));

        .rating-option
          padding-bottom: 18px;
          border-1px(rgba(7, 17, 27, 0.1));

          .btn-group
            li
              display: inline-block;
              width: 60px;
              height: 32px;
              line-height: 32px;
              text-align: center;
              vertical-align: bottom;
              border-radius: 2px;
              margin-right: 8px;

              &.goodRat
                background: rgba(0, 160, 220, 0.2);

              &.badRat
                background: rgba(77, 85, 93, 0.2);

              .btn-title
                display: inline-block;
                font-size: 12px;
                padding-right: 4px;

              .btn-num
                display: inline-block;
                font-size: 8px;

        .rating-selector
          display: flex;
          align-items: center;
          height: 48px;

          .icon-check_circle
            display: inline-block;
            font-size: 24px;
            color: rgb(147, 153, 159);

          .text
            display: inline-block;
            font-size: 12px;
            color: rgb(147, 153, 159);
            padding-left: 4px;

      .comment
        padding: 0 18px;

        li
          padding: 18px 0;
          border-1px(rgba(7, 17, 27, 0.1));

          .avata
            display: flex;
            padding-bottom: 6px;

            .icon
              flex: 0 0 28px;
              display: inline-block;
              padding-right: 12px;

              img
                border-radius: 50%;

            .user
              flex: 1;
              display: inline-block;

              .username
                font-size: 10px;
                color: rgb(7, 17, 27);
                padding-bottom: 4px;

              .rating-star
                .star
                  display: inline-block;

                .deliveryTime
                  display: inline-block;
                  padding-left: 6px;
                  font-size: 10px;
                  font-weight: 200;
                  color: rgb(147, 153, 159);

            .time
              flex: 0 0 80px;
              display: inline-block;
              font-size: 10px;
              font-weight: 200;
              color: rgb(147, 153, 159);

          .text
            font-size: 12px;
            color: rgb(7, 17, 27);
            padding: 0 0 8px 40px;

          .thumb
            display: flex;
            align-items: center;
            padding-left: 40px;

            .icon-thumb_up, .icon-thumb_down
              display: inline-block;
              font-size: 12px;
              color: rgb(0, 160, 220);
              padding-right: 8px;

            .recommend
              display: inline-block;
              height: 15px;
              line-height: 15px;
              margin-right: 8px;
              width: 40px;
              font-size: 9px;
              color: rgb(147, 153, 159);
              border: 1px solid rgba(7, 17, 27, 0.1);
              border-radius: 2px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              text-align: center;
</style>
