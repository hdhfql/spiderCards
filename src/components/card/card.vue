<template>
  <div class="card-content" ref="content">
    <div class="card" :class="{'textShow': !rcover}" ref="card">
      <p class="text" :class="{'pShow': !rcover}" >{{action.value}}</p>
      <div class="circle" :class="{'cShow': !rcover}"></div>
      <div class="circle one" :class="{'cShow': !rcover}"></div>
      <div class="circle two" :class="{'cShow': !rcover}"></div>
      <div class="circle three" :class="{'cShow': !rcover}"></div>
      {{action.value}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'cards',
  props: {
    viewport: {type: Object},
    action: {type: Object},
    lightShow: {type: Boolean, default: false}
  },
  data () {
    return {
      cover: true,// 默认每张牌盖上
      color: [111,17,111],
      colorDirection: ['+','+','+'],
      index: ''
    }
  },
  computed: {
    rcover () {
      return this.cover;
    }
  },
  methods: {
    changeColor () {// 变换颜色
      for (let i = 0; i < this.color.length; i++) {
        if (this.color[i] <= 0) {
          this.colorDirection[i] = '+';
        }
        if (this.color[i] >= 255) {
          this.colorDirection[i] = '-';
        }
      }

      for (let i = 0; i < this.colorDirection.length; i++) {
        switch (this.colorDirection[i]) {
          case '+': this.color[i] += i+ 1;break;
          case '-': this.color[i] -= i + 1;break;
        }
      }

      let text = this.$refs.content.querySelector(".text");
      let circle = this.$refs.content.querySelectorAll(".circle");

      this.$refs.card.style.backgroundColor = `rgb(${255-this.color[0]},${255-this.color[1]},${255-this.color[2]})`;
      text.style.color = `rgb(${this.color[2]},${this.color[2]},${this.color[2]})`;
      circle[0].style.border = `2px solid rgb(${this.color[2]},${this.color[2]},${this.color[2]})`;
      circle[1].style.border = `2px solid rgb(${this.color[0]},${this.color[1]},${this.color[2]})`;
      circle[2].style.border = `2px solid rgb(${this.color[1]},${this.color[2]},${this.color[0]})`;
      circle[3].style.border = `2px solid rgb(${this.color[2]},${this.color[1]},${this.color[0]})`;
     
    }
  },
  mounted () {// 根据视口宽度设置牌的宽高、花纹大小、文字大小、间距大小，
    let card = this.$refs.card;

    this.$refs.content.style.perspective = this.viewport.cWidth * 0.1 + 'px';

    this.$refs.card.style.width = this.viewport.cWidth * 0.08 + 'px';
    this.$refs.card.style.height = this.viewport.cWidth * 0.08 / 0.618 + 'px';
    this.$refs.card.style.lineHeight = card.offsetHeight + 'px';
    this.$refs.card.style.borderRadius = card.offsetWidth * 0.06 + 'px';

    let circle = this.$refs.content.querySelectorAll(".circle");
    for (let i = 0; i < circle.length; i++) {
      circle[i].style.height = card.offsetWidth * 0.8 + 'px';
      circle[i].style.width = card.offsetWidth * 0.3 + 'px';
      circle[i].style.marginLeft = `-${circle[i].offsetWidth / 2}px`;
      circle[i].style.marginTop = `-${circle[i].offsetHeight / 2}px`;
    }
    
    let cshow = this.$refs.content.querySelectorAll(".cShow");
    for (let i = 0; i < cshow.length; i++) {
      if (cshow) {
        cshow[i].style.border = '1px solid rgb(7,17,27)';
      }
    }

    let textshow = this.$refs.content.querySelector(".textShow");
    if (textshow) {
      textshow.style.fontSize = card.offsetWidth * 0.2 + 'px';
      textshow.style.fontWeight = '700';
    }

    let pshow = this.$refs.content.querySelector(".pShow");
    let mWidth = card.offsetWidth * 0.05;
    if (pshow) {
      pshow.style.fontSize = 2.6 * mWidth + 'px';
      pshow.style.margin = `${2 * mWidth}px ${mWidth}px`;
      pshow.style.lineHeight = mWidth + 'px';
    }
  },
  updated () {// 每次翻转都会马上更新文字花纹等
    let card = this.$refs.card;
   
    let textshow = this.$refs.content.querySelector(".textShow");
    if (textshow) {
      textshow.style.fontSize = card.offsetWidth * 0.2 + 'px';
      textshow.style.fontWeight = '700';
    }

    let pshow = this.$refs.content.querySelector(".pShow");
    let mWidth = card.offsetWidth * 0.05;
    if (pshow) {
      pshow.style.fontSize = 2.6 * mWidth + 'px';
      pshow.style.margin = `${2 * mWidth}px ${mWidth}px`;
      pshow.style.lineHeight = mWidth + 'px';
    }

    let cshow = this.$refs.content.querySelectorAll(".cShow");
    for (let i = 0; i < cshow.length; i++) {
      if (cshow) {
        cshow[i].style.border = '1px solid rgb(7,17,27)';
      }
    }
  },
  watch: {
    'action.turn': {// 监听是否默认翻转
      handler (turn) {
        if (turn) {
          this.cover = false;
        }
      },
      immediate: true,
      deep: true,
    },
    immediate: true,
    lightShow: function () {// 花纹文字颜色变换
      if (this.lightShow) {
        let card = this.$refs.content.querySelector(".card");
        card.style.color = 'rgb(255,255,255)';
        setInterval(() => {
          this.changeColor();
        }, 50);// 0.05秒变换一种颜色，但会集满越多复牌越卡
      }
    },
    immediate: true
  }
}
</script>

<style lang="stylus" scoped>
  .card-content
    perspective-origin: 50% 50%
    font-size: 0
    .card
      position: relative
      display: block
      vertical-align: top
      text-align: center
      background-color: skyblue
      border: 1px solid rgb(7,17,27)
      border-radius: 5px
      transform: rotateY(180deg)
      transition: transform 1s
      &.textShow
        background-color: rgb(144,238,144)
        transform: rotateY(0deg)
      .text
        position: absolute
        left: 0
        top: 0
        &.pShow
          position: absolute
          left: 0
          top: 0
      .circle
        position: absolute
        left: 50%
        top: 50%
        border: none
        &.cShow
          border-radius: 50%
        &.one
          transform: rotateZ(45deg)
        &.two
          transform: rotateZ(90deg)
        &.three
          transform: rotateZ(135deg)
</style>