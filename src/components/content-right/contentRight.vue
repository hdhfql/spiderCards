<template>
  <div class="contentRight">
    <div class="time" ref="time">
      <div class="text">
        <p>剩 余 时 间</p><span>{{getTime}} 秒</span>
      </div>
    </div>
    <div class="score" ref="score">
      <div class="text">
        <p>移 动 步 数</p><span>{{getStep}} 步</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'contentRight',
  props: {
    viewport: {type: Object},
    start: {type: Boolean},
    over: {type: Boolean},
    step: {type: Number}
  },
  data () {
    return {
      time: 600
    }
  },
  computed: {
    getTime () {
      if (this.time == 0) {
        this.$nextTick(() => {
          this.$emit('gameOver');
        });
      }
      return this.time;
    },
    getStep () {
      return this.step;
    }
  },
  mounted () {
    let crWidth = (this.viewport.windowWidth - this.viewport.windowWidth * 0.06) * 0.3;

    this.$refs.time.style.height = crWidth * 0.55 + 'px';
    this.$refs.time.style.marginBottom = crWidth * 0.02 + 'px';

    this.$refs.time.querySelector(".text").style.lineHeight = crWidth * 0.55 / 3 + 'px';
    this.$refs.time.querySelector(".text").style.fontSize = crWidth * 0.1 + 'px';
    this.$refs.time.querySelector(".text").style.marginTop = crWidth * 0.55 / 6 + 'px';

    this.$refs.score.style.height = crWidth * 0.55 + 'px';

    this.$refs.score.querySelector(".text").style.lineHeight = crWidth * 0.55 / 3 + 'px';
    this.$refs.score.querySelector(".text").style.fontSize = crWidth * 0.1 + 'px';
    this.$refs.score.querySelector(".text").style.marginTop = crWidth * 0.55 / 6 + 'px';
  },
  watch: {
    start: function () {
      let timeGo;
      if (this.over) {// 时间到游戏结束
        this.$emit('pushTime', this.time);
        clearInterval(timeGo);
      }
      if (this.start) {
        timeGo = setInterval(() => {
          this.time--;
          if (this.time == 0) {
            clearInterval(timeGo);
          }
        }, 1000);// 计时
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .contentRight
    font-size: 0
    .time
      width: 100%
      border: 1px solid #000
      border-radius: 20px
      text-align: center
    .score
      width: 100%
      border: 1px solid #000
      border-radius: 20px
      text-align: center
</style>
