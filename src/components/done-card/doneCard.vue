<template>
  <ul class="doneCard" ref="doneCard">
    <li class="done-list" v-for="(list, listIndex) in 8" :key="listIndex">
      <div class="fix"></div>
      <transition name="box">
        <fixedBox class="doneBox" :viewport="viewport" v-if="boxShow[listIndex]" />
      </transition>
      <ul>
        <li class="done-item" v-for="(item, index) in pushDoneCard[list-1]" :key="index">
          <card :viewport="viewport" :action="item" :lightShow="pushLight[list-1]" />
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
import {doneCardPlace} from '../../common/js/js';
import fixedBox from '../fixed-box/fixedBox';
import card from '../card/card';
export default {
  name: 'doneCard',
  components: {
    fixedBox,
    card
  },
  props: {
    viewport: {type: Object},
    start: {type: Boolean, default: false},
    doneCard: {type: Object},
    step: {type: Number},
    time: {type: Number}
  },
  data () {
    return {
      doneCardData: [[],[],[],[],[],[],[],[]],
      boxShow: [],
      index: 0,// 让computed运行的作用
      lightShow: []
    }
  },
  computed: {
    pushDoneCard () {
      if (this.start && this.doneCard.value != '???') {// 排除掉第一次默认传进来的值
        this.doneCardData[this.doneCard.doneCount].push(this.doneCard);// doneCount正好对应索引
        this.index = this.doneCard.doneTop;
      }
      return this.doneCardData;
    },
    pushLight () {
      if (this.doneCardData[this.doneCard.doneCount].length == 12) {// 13的话会持续触发，所以退一位，延迟定时器弥补时间差
        setTimeout(() => {
          this.lightShow.push(true);
        }, 900);// 所有的牌动画都结束后开始变色
      }
      return this.lightShow;
    }
  },
  mounted () {
    let fix = this.$refs.doneCard.querySelectorAll(".fix");
    let box = this.$refs.doneCard.querySelectorAll(".doneBox");

    for (let i = 0; i < fix.length; i++) {
      fix[i].style.width = this.viewport.cWidth * 0.08 + 6 + 'px';// 防止脱离文档流
    }

    for (let i = 0; i < box.length; i++) {
      box[i].style.right = fix[0].offsetWidth * (7-i) + 4 * (8-i) + 'px';
    }
    
  },
  watch: {
    doneCardData: function () {
      if (this.start) {
        let item = this.$refs.doneCard.querySelectorAll(".done-list")[this.doneCard.doneCount].querySelectorAll(".done-item");
        let box = this.$refs.doneCard.querySelectorAll(".doneBox")[this.doneCard.doneCount];
        doneCardPlace(item, this.doneCard.doneLeft, this.doneCard.doneTop, box);
      }
      if (this.doneCardData[7].length == 13) {
        setTimeout(() => {
          this.$emit('gameWin');
          let score = (500 - this.time) * 2 + (300 - this.step * 2);
          let again = confirm(`恭喜！你已顺利通关！ 你的分数是${score}分,再来一局吧！`);
          if (again) {
            location.reload();
          }
        }, 1000);// 1秒让最后的动画结束后弹窗
      }
    },
    deep: true,
    start: function () {
      if (this.start) {
        let count = 0;
        let showBox = setInterval(() => {
          this.boxShow.push(true);
          if (count == 7) {
            clearInterval(showBox);
          }
          count++;
        }, 250);// 每0.25秒浮上一个框
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .doneCard
    text-align: right
    .done-list
      display: inline-block
      .fix
        height: 0
        content: ''
        display: block
      .box-enter, .box-leave-to
        transform: translateY(40px)
        opacity: 0.1
      .box-enter-to, .box-leave
        transform: translateY(0)
        opacity: 1
      .box-enter-active, .box-leave-active
        transition: all 1s
      .doneBox
        position: absolute
        display: block
        z-index: -1
        top: 0
      .done-item
        position: absolute
        display: block
        transition: all 0.8s ease
</style>
