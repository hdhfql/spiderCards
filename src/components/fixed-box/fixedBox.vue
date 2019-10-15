<template>
  <div class="fixed-box" ref="fixedBox"></div>
</template>

<script>
export default {
  name: 'fixed-box',
  props: {
    viewport: {type: Object}
  },
  mounted () {
    let box = this.$refs.fixedBox;// 根据视口宽度设置牌的宽高，
    box.style.width = this.viewport.cWidth * 0.08 + 'px';
    box.style.height = this.viewport.cWidth * 0.08 / 0.618 + 'px';
    box.style.lineHeight = box.offsetHeight + 'px';
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .fixed-box
    display: inline-block
    border-radius: 8px
    border: 1px solid rgba(7,17,27,0.1)
    background-color: rgba(250,250,250,0.5)
</style>