<template>
  <ul class="deal-card" ref="dealCard">
    <li class="deal-item" v-for="(item, index) in dealListNum" :key="index" @click.stop="deal($event, index)">
      <card class="card" :viewport="viewport" :action="{value: ''}" />
    </li>
    <fixedBox :viewport="viewport" v-if="zero" />
  </ul>
</template>

<script>
import card from '../card/card';
import fixedBox from '../fixed-box/fixedBox';
export default {
  name: 'deal-card',
  props: {
    viewport: {type: Object},
    start: {type: Boolean},
    unfold: {type: Boolean},
    dealListNum: {type: Number}
  },
  components: {
    card,
    fixedBox
  },
  data () {
    return {
      zero: false// 发牌处牌的张数为0，则zero为true，利用watch监听
    }
  },
  methods: {// 点击发牌处的函数，向父组件传递被点击的元素并触发deal事件
    deal (e, n) {
      if (this.start) {
        let item = this.$refs.dealCard.querySelectorAll(".deal-item");
        if (n == item.length - 1) {
          this.$emit('deal', e.currentTarget);
        }
      }
    }
  },
  watch: {
    unfold: function () {// 初始化发牌处的位置
      let item = this.$refs.dealCard.querySelectorAll(".deal-item");
      if (this.unfold) {
        for (let i = 0; i < item.length; i++) {
          item[i].style.left = this.viewport.cWidth * 0.04 * i * 0.618 + 'px';
        }
      }
    },
    dealListNum: function () {
      if (this.dealListNum == 0) {
        this.zero = true;
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .deal-card
    position: relative
    .deal-item
      position: absolute
      left: 0
      top: 0
      transition: all 2s
      &.zero
        background-color: rgb(253,253,255)
        border-radus: 1px solid rgba(7,17,27,0.2)
</style>
