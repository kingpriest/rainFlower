<template>
  <div class="detail-title">
      <div class="detail-line"></div>
      <div class="detail-font">{{content}}</div>
      <div class="detail-line"></div>
  </div>
</template>
<script>
export default {
    name: 'detail-title',
    props: {
        content: {
            type: String
        }
    }
};
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl';

.detail-title
    display: flex;
    margin: 0 auto;
    vertical-align: top;
    height: 14px;
    width: 80%;

    .detail-line
        flex: 1;
        position: relative;
        vertical-align: top;
        height: 7px;
        border-1px(rgba(255, 255, 255, 0.2));

    .detail-font
        font-size: 14px;
        font-weight: 700;
        color: rgb(255, 255, 255);
        line-height: 14px;
        margin: 0 12px;
</style>
