<template>
  <div class="pp">
    <ul v-for="(list, index1) in 5" :key="index1">
      <li class="itema" v-for="(item, index2) in push[list-1]" :key="index2">
        {{item[0]}}
        'xxxxx'
      </li>
    </ul>
  </div>
</template>

<script>
var c = 0;
export default {
  name: 'pp',
  props: ['momentCard'],
  data () {
    return {
      card:[[],[],[],[],[]],
      index: 0,
      a: []
    }
  },
  computed: {
    push () {
      this.index = this.momentCard.index;
      this.a = this.momentCard.cardAction;
      let a = [this.momentCard.cardAction[0],this.momentCard.cardAction[1],this.momentCard.cardAction[2]];
      this.card[c%5].push(a);
      c++;
      return this.card;
    }    
  },
  watch: {
    momentCard: function () {
      this.card.push(this.momentCard);
    },
    deep: true,
    immediate: true
  }
}
</script>

<style lang="stylus">
  .pp
    .itema
      height: 60px
      width: 80px
      display: inline-block
      font-size: 20px
      border: 2px solid black
</style>
