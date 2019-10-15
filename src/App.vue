<template>
  <div id="app">
    <div class="content-left" ref="left">
      <div class="header-wrapper">
        <div class="deal-wrapper">
          <card class="start-card" :viewport="viewport" :action="{value: ''}" v-if="!unfold" />
          <dealCard
            :viewport="viewport"
            :start="start"
            :unfold="unfold"
            :dealListNum="dealListNum"
            @deal="deal"
          />
        </div>
        <doneCard
          :viewport="viewport"
          :start="start"
          :over="over"
          :doneCard="doneCard"
          :step="step"
          :time="time"
          @gameWin="gameWin"
        />
      </div>
      <contentCard
        :viewport="viewport"
        :momentCard="momentCard"
        :start="start" :over="over"
        :dealStart="dealStart" 
        @done="donePush"
        @step="pushStep"
        />
    </div>
    <div class="content-right">
      <contentRight
        :viewport="viewport"
        :start="start"
        :step="step"
        @gameOver="gameOver"
        @pushTime="pushTime"
      />
    </div>
  </div>
</template>

<script>
import card from './components/card/card';
import fixedBox from './components/fixed-box/fixedBox';
import dealCard from './components/deal-card/dealCard';
import doneCard from './components/done-card/doneCard';
import contentCard from './components/content-card/contentCard';
import contentRight from './components/content-right/contentRight';
let allCount = 103;// 牌的总张数
export default {
  name: 'App',
  components: {
    card,
    fixedBox,
    dealCard,
    doneCard,
    contentCard,
    contentRight
  },
  data () {
    return {
      viewport: {
        windowWidth: 0,// 视窗宽度
        cWidth: 0// 左面板宽度
      },
      cardsData: [// 所有牌的数据
        'A','2','3','4','5','6','7','8','9','10','J','Q','K',
        'A','2','3','4','5','6','7','8','9','10','J','Q','K',
        'A','2','3','4','5','6','7','8','9','10','J','Q','K',
        'A','2','3','4','5','6','7','8','9','10','J','Q','K',
        'A','2','3','4','5','6','7','8','9','10','J','Q','K',
        'A','2','3','4','5','6','7','8','9','10','J','Q','K',
        'A','2','3','4','5','6','7','8','9','10','J','Q','K',
        'A','2','3','4','5','6','7','8','9','10','J','Q','K'
      ],
      dealListCardsData: [[],[],[],[],[]],// 发牌处的数据存放处
      dealListNum: 5,// 发牌处的张数
      doneCard: {doneLeft: 0, doneTop: 0, doneCount: 0, value: '???', turn: true},
      momentCard: {value: '', initialPoint: null, turn: false, index: 0},// 发牌时的时时数据，并传递给子组件
      unfold: false,// 初始时折叠发牌处的5张牌
      start: false,// 初始发牌时为false，发完牌时变为true，作为开始游戏的开关
      over: false,// 结束时的开关 
      dealStart: false,// 点击发牌时变为true
      step: 0,
      time: 0
    }
  },
  created () {
    this.viewport.cHeight = window.innerHeight ||// 获取视窗的高宽
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    this.viewport.windowWidth = window.innerWidth||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    this.viewport.cWidth = (this.viewport.windowWidth - this.viewport.windowWidth * 0.06) * 0.7;

    let start_card = document.querySelector(".start-card");// 传递第一张牌的数据，放在created里是为了防止子组件渲染第一个没数据的dom
    let num = Math.round(Math.random() * allCount);
    this.momentCard.value = this.cardsData[num];
    this.momentCard.initialPoint = start_card;
    this.momentCard.index = allCount;
    allCount--;
    this.cardsData.splice(num,1);
  },
  mounted () {
    alert("点击开始游戏！");// 游戏开始前弹窗
    document.getElementById("app").style.margin = this.viewport.windowWidth * 0.02 + 'px';// 拿到视窗宽度并设置元素宽高
    let hw = document.querySelector(".header-wrapper");
    let left = document.querySelector(".content-left");

    this.$refs.left.style.width = this.viewport.cWidth + 'px';
    this.$refs.left.style.marginRight = this.viewport.windowWidth * 0.02 + 'px';

    hw.style.height = this.viewport.cWidth * 0.08 / 0.618 + 2 + 'px';
    hw.style.width = this.viewport.cWidth + 'px';
    hw.style.marginBottom = this.viewport.cWidth * 0.06 + 'px';

    let start_card = document.querySelector(".start-card");// 初始发牌传递数据，一共54张
    let count = 0;
    let dealCardsStart = setInterval(() => {
      if (count == 52) {// 在created里发了第一张，所以这里发53张
        clearInterval(dealCardsStart);
      }
      let num = Math.round(Math.random() * allCount);
      this.momentCard.value = this.cardsData[num];
      this.momentCard.initialPoint = start_card;
      this.momentCard.index = allCount;
      this.cardsData.splice(num,1);
      allCount--;
      count++;
      if (count == 53) {// 发完牌，初始化发牌处的5张牌的数据
        this.unfold = true;
        this.$nextTick(() => {// dom渲染完成后改变，不然初始发牌会少发两张
          this.start = true;
        });
        for (let i = 0; i < this.dealListCardsData.length; i++) {
          let count = 0;
          while (count < 10) {
            let num = Math.round(Math.random() * allCount)
            this.dealListCardsData[i].push(this.cardsData[num]);
            this.cardsData.splice(num,1);
            allCount--;
            count ++;
          }
        }
      }
    }, 100);// 初始发牌每0.1秒发一张
  },
  methods: {
    deal (e) {// 点击发牌处的牌开始发牌，传递数据
      let listCount = 9;
      let deal = setInterval(() => {
        let num = Math.round(Math.random() * listCount);
        // let num = listCount;
        this.momentCard.value = this.dealListCardsData[0][num];
        this.momentCard.initialPoint = e;
        this.momentCard.turn = true;
        this.momentCard.index = --allCount;
        this.dealListCardsData[0].splice(num,1);
        if (listCount == 0) {
          this.dealListCardsData.splice(0,1);
            setTimeout(() => {
              this.dealListNum--;
              this.dealStart = false;// 重置发牌开关
            }, 200);// 延迟更改发牌处牌的张数，延迟渲染dom，过渡画面更连贯
          clearInterval(deal);
        }
        listCount--;
      }, 100);// 发牌每0.1秒发一张
      setTimeout(() => {
        this.dealStart = true;
      }, 100);// 延迟开始，不然第一次数据传不过去
    },
    donePush (elLeft, elTop, doneCount) {// 将集满一副牌的牌位置传给子组件，完成动画效果
      this.doneCard.doneLeft = elLeft;
      this.doneCard.doneTop = elTop;
      this.doneCard.doneCount = doneCount;
      this.doneCard.value = 'H';
    },
    gameWin () {// 游戏胜利，计时停止
      this.over = true;
    },
    gameOver () {// 时间到游戏失败
      this.over = true;
      let again = confirm('时间到，游戏失败！再来一局吧~');
      if (again) {
        location.reload();
      }
    },
    pushStep (count) {// 将移动步数传给右面板子组件
      this.step = count;
    },
    pushTime (time) {
      this.time = time;
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  body
    background-color: rgb(220,80,80)
    #app
      position: relative
      display: flex
      font-size: 0
      .content-left
        flex: 0
        .header-wrapper
          .deal-wrapper
            float: left
            .start-card
              position: absolute
              left: 0
              top: 0
      .content-right
        flex: 1
</style>
