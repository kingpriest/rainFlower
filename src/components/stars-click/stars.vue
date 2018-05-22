<template>
    <div class="stars">
        <div class="star" v-for="star in stars" :key="star.id" @click="star.on = true">
            <span v-if="star.on" class="on"></span>
            <span v-else class="off"></span>
        </div>
    </div>
</template>
<script>
export default {
    name: 'stars',
    data() {
        return {
            stars: [
                {
                    id: 0,
                    on: false
                },
                {
                    id: 1,
                    on: false
                },
                {
                    id: 2,
                    on: false
                },
                {
                    id: 3,
                    on: false
                },
                {
                    id: 4,
                    on: false
                }
            ]
        };
    },
    watch: {
        stars: {
            handler() {
                var self = this;
                this.stars.forEach((value, index) => {
                    if (value.on === true) {
                        for (var i = 0; i < index; i++) {
                            self.stars[i].on = true;
                        }
                    }
                });
            },
            deep: true
        }
    }
};
</script>
<style lang="stylus" scoped rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl';
.stars
    height: 24px;
    margin-top: 16px;
    margin-bottom: 28px;

    .star
        display: inline-block;
        width: 24px;
        height: 24px;

        .on
            display: inline-block;
            bg-image('star48_on');
            width: 100%;
            height: 100%;
            background-size: 24px 24px;
            background-repeat: no-repeat;

        .off
            display: inline-block;
            bg-image('star48_off');
            width: 100%;
            height: 100%;
            background-size: 24px 24px;
            background-repeat: no-repeat;
</style>
