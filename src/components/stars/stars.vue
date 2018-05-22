<template>
    <div class="star" :class="starType">
        <span class="star-item" v-for="star in starsC" :class="star.state" :key="star.id"></span>
    </div>
</template>
<script>
const LENGTH = 5;
const CLS_ON = 'on';
const CLS_OFF = 'off';
const CLS_HALF = 'half';
export default {
    name: 'stars',
    props: {
        score: {
            type: Number
        },
        size: {
            type: Number
        }
    },
    data() {
        return {
            stars: [
                {
                    id: 1,
                    state: 'off'
                },
                {
                    id: 2,
                    state: 'off'
                },
                {
                    id: 3,
                    state: 'off'
                },
                {
                    id: 4,
                    state: 'off'
                },
                {
                    id: 5,
                    state: 'off'
                }
            ]
        };
    },
    computed: {
        starType() {
            return 'star-' + this.size;
        },
        starsC() {
            let len = Math.floor(this.score);
            let hasDecimal = this.score % 1 !== 0;
            let divd = this.score - len;
            let result = [];
            this.stars.forEach((value, index) => {
                if (value.id <= len) {
                    result.push({
                        id: value.id,
                        state: CLS_ON
                    });
                } else if (hasDecimal && divd >= 0.5 && value.id === len + 1) {
                    result.push({
                        id: value.id,
                        state: CLS_HALF
                    });
                } else {
                    result.push({
                        id: value.id,
                        state: CLS_OFF
                    });
                }
            });
            return result;
        }
    }
};
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl';

.star
    font-size: 0;

    .star-item
        display: inline-block;
        background-repeat: no-repeat;

    &.star-48
        .star-item
            width: 20px;
            height: 20px;
            margin-right: 22px;
            background-size: 20px 20px;

            &:last-child
                margin-right: 0px;

            &.on
                bg-image('star48_on');

            &.half
                bg-image('star48_half');

            &.off
                bg-image('star48_off');

    &.star-36
        .star-item
            width: 15px;
            height: 15px;
            margin-right: 6px;
            background-size: 15px 15px;

            &:last-child
                margin-right: 0px;

            &.on
                bg-image('star36_on');

            &.half
                bg-image('star36_half');

            &.off
                bg-image('star36_off');

    &.star-24
        .star-item
            width: 10px;
            height: 10px;
            margin-right: 3px;
            background-size: 10px 10px;

            &:last-child
                margin-right: 0px;

            &.on
                bg-image('star24_on');

            &.half
                bg-image('star24_half');

            &.off
                bg-image('star24_off');
</style>
