<template>
  <ul class="content-wrapper" ref="content">
    <li class="card-list" v-for="(list, index) in 10" :key="index">
      <fixedBox class="contentBox" :viewport="viewport" />
      <ul>
        <li v-for="(item, index) in pushCard[list-1]" :key="index"
          class="card-item"
          @mousedown.stop="move(index, pushCard[list-1], list-1)"
        >
          <card :viewport="viewport" :action="item" :lightShow="lightShow" />
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
import card from '../card/card';
import { cardsPlace, getEl, getMoveTime, getLastItemValue, moveCardPlace, ifDone } from '../../common/js/js';
import fixedBox from '../fixed-box/fixedBox';
let startCount = -1;// 初始发牌索引
let dealCount = -1;// 游戏时点击发牌处的发牌索引
let doneCount = -1;// 表示集满牌副数
export default {
  name: 'contentCard',
  props: {
    viewport: {type: Object},
    momentCard: {
      type: Object,
      default () {
        return {
          turn: false,// 是否能点击翻转
        }
      }
    },
    start: {type: Boolean},
    over: {type: Boolean, default: false},
    dealStart: {typr: Boolean, default: false}
  },
  components: {
    card,
    fixedBox
  },
  data () {
    return {
      listCards: [[],[],[],[],[],[],[],[],[],[]],// 保存面板上的牌的数据
      index: 0,// 用于触发computed,每次父组件传进数据computed都更新index，防止父组件传进相同数据不会触发computed
      listPlace: [[],[],[],[],[],[],[],[],[],[]],// 每列的边界位置数据，用于分辨准心处在哪列上
      moveTime: false,// 牌是否可移动
      x0: 0,
      y0: 0,
      x1: 0,
      y1: 0,
      moveCard: {newEl: null, box: null, boxZero: false, time: null},
      lightShow: false,
      stepCount: 0
    }
  },
  computed: {
    pushCard () {
      if (this.dealStart) {// 监听游戏时发牌的传入数据并保存数据
        if (!this.moveTime) {// 移动牌时不触发
          this.index = this.momentCard.index;
          let obj = {
            value: this.momentCard.value,
            turn: this.momentCard.turn
          }
          this.listCards[(dealCount + 1) % 10].push(obj);
          dealCount++;
          return this.listCards;
        }
      }
      if (!this.start) {// 监听初始发牌的传入数据并保存数据
        this.index = this.momentCard.index;// 保证每次传进数据时都能被调用
        let obj = {// 不直接push传入的对象是因为会出bug，解决所有牌的数据会被更改为最后一张牌的数据
          value: this.momentCard.value,
          turn: this.momentCard.turn
        }
        this.listCards[(startCount + 1) % 10].push(obj);
        startCount++;
        return this.listCards;
      } else {// 移动牌时触发，不做更改
        return this.listCards;
      }
    }
  },
  methods: {
    move (index, list, listIndex) {// 移动牌函数
      if (this.start && !this.dealStart && !this.over) {// 发牌时不触发点击效果
        this.moveTime = getMoveTime(list, index);// 判断被点击的牌是否能移动
        let e = event || window.event;
        e.returnValue = false || e.preventDefault();
        [this.x0, this.y0] = [e.clientX, e.clientY];
        let item = this.$refs.content.querySelectorAll(".card-list")[listIndex].querySelectorAll(".card-item");// 整个函数item不可更改
        let cardsList = this.$refs.content.querySelectorAll(".card-list");// 整个函数item不可更改

        if (this.moveTime) {
          let ifcover = false;
          for (let i = index; i < list.length; i++) {// 判断被移动的牌是否存在盖上的，有则不能移动
            if (list[i].turn == false) {
              ifcover = true;
            }
          }
          if (!ifcover) {
            document.onmousemove = (e) => {
              [this.x1, this.y1] = [e.clientX, e.clientY];// 移动前记录初始坐标
              let [X, Y] = [this.x1 - this.x0, this.y1 - this.y0];
              [this.x0, this.y0] = [this.x1, this.y1];
              
              for (let i = index; i < item.length; i++) {
                item[i].style.transition = 'none';// 去除过渡效果
                item[i].style.zIndex = '50';// 防止被后列的牌遮挡
                item[i].style.left = X + item[i].offsetLeft + 'px';
                item[i].style.top = Y + item[i].offsetTop + 'px';
              }

              document.onmouseup = (e) => {// 重置每列最后一张牌是否能被点击翻转，放置被移动的牌;经过move后的up

                this.stepCount++;
                this.$emit('step', this.stepCount);// 增加移动步数，并传值到父组件


                let placeTrue = false;// 放置是否成功
                let aimPoint = item[index].offsetLeft + item[index].offsetWidth / 2;// 设置准心，被移动的牌的中心

                for (let i = 0; i < this.listPlace.length; i++) {// 更新数据
                  if (aimPoint >= this.listPlace[i][0] && aimPoint <= this.listPlace[i][1]) {// 准心移到列边界内
                  
                    if (this.listCards[i].length == 0) {// 该列没牌
                      let count = item.length;
                      let pushMoveCard = setInterval(() => {
                        let itemValue = this.listCards[listIndex][index];
                        this.listCards[i].push(itemValue);// 将数据放进新的列
                        this.listCards[listIndex].splice(index,1);// 删掉原来列的数据

                        this.$nextTick(() => {
                          let elList = cardsList[i].querySelectorAll(".card-item");
                          let box = cardsList[i].querySelector(".contentBox");
                          this.moveCard.time = new Date();// 保证每次push的对象都不同，让watch监听到
                          this.moveCard.newEl = elList[elList.length-1];
                          if (elList.length == 1) {// 已经push进了一个数据，所以长度至少为1
                            this.moveCard.boxZero = true;// 表示该列没牌，以底框为标准
                            this.moveCard.box = box;
                          } else {
                            this.moveCard.boxZero = false;
                            this.moveCard.box = elList[elList.length-2];
                          }
                        });
                        count--;
                        if (count == index) {
                          clearInterval(pushMoveCard);
                        }
                      }, 2);// 延迟改变被移动牌组的各个牌的数据，每张牌数据都被检测到，不加所有数据都变成最后一张牌的

                    } else {// 该列有牌
                      let itemValue = this.listCards[listIndex][index];
                      if (i == listIndex) {// 移动到自己原本这列
                        let count = item.length;
                        let oldIndex = index;// 因为移到原本列，长度没有减少，而每次push和splice的索引要固定
                        let pushMoveCard = setInterval(() => {
                          let itemValue = this.listCards[listIndex][oldIndex];
                          this.listCards[i].push(itemValue);
                          this.listCards[listIndex].splice(oldIndex,1);

                          this.$nextTick(() => {
                            let elList = cardsList[listIndex].querySelectorAll(".card-item");
                            let box = cardsList[listIndex].querySelector(".contentBox");
                            this.moveCard.time = new Date();
                            if (!elList[index-2]) {// 移动自己这列所有的牌---(*****)
                              this.moveCard.boxZero = true;
                              this.moveCard.newEl = elList[oldIndex];
                              this.moveCard.box = box;
                            } else {
                              this.moveCard.boxZero = false;
                              this.moveCard.newEl = elList[index-1];// 对应（*）
                              this.moveCard.box = elList[index-2];// 对应（*）
                            }
                          });
                          index++;// 数据改变后，长度+1，index++才能取到下一张;这里会先于（*****）执行，所以到（*****）时index为2 ----（*）
                          if (count == index) {
                            clearInterval(pushMoveCard);
                          }
                        }, 2);

                      } else {// 移动到其他列
                        let lastItemValue = this.listCards[i][this.listCards[i].length-1];

                        if (getLastItemValue(lastItemValue.value) == getLastItemValue(itemValue.value) + 1 && lastItemValue.turn) {// 符合条件，放置到该列
                          let count = item.length;
                          let pushMoveCard = setInterval(() => {
                            let itemValue = this.listCards[listIndex][index];
                            this.listCards[i].push(itemValue);
                            this.listCards[listIndex].splice(index,1);

                            this.$nextTick(() => {
                              let elList = cardsList[i].querySelectorAll(".card-item");
                              this.moveCard.time = new Date();
                              this.moveCard.newEl = elList[elList.length-1];
                              this.moveCard.box = elList[elList.length-2];
                              this.moveCard.boxZero = false;
                            });
                            count--;
                            if (count == index) {
                              clearInterval(pushMoveCard);
                            }
                          }, 2);

                        } else {// 不符合条件，回到原来的列
                          let count = item.length;
                          let oldIndex = index;
                          let pushMoveCard = setInterval(() => {
                            let itemValue = this.listCards[listIndex][oldIndex];
                            this.listCards[listIndex].push(itemValue);
                            this.listCards[listIndex].splice(oldIndex,1);

                            this.$nextTick(() => {
                              let elList = cardsList[listIndex].querySelectorAll(".card-item");
                              let box = cardsList[listIndex].querySelector(".contentBox");
                              this.moveCard.time = new Date();
                              if (!elList[index-2]) {
                                this.moveCard.boxZero = true;
                                this.moveCard.newEl = elList[oldIndex];
                                this.moveCard.box = box;
                              } else {
                                this.moveCard.boxZero = false;
                                this.moveCard.newEl = elList[index-1];
                                this.moveCard.box = elList[index-2];
                              }
                            });
                            index++;
                            if (count == index) {
                              clearInterval(pushMoveCard);
                            }
                          }, 2);
                        }
                      }
                    }
                    placeTrue = true;// 放置成功
                    break;

                  }
                }
                if (!placeTrue) {// 放置不成功,即准心没在任何列上，则回到原来的位置
                  let count = item.length;
                  let oldIndex = index;
                  let pushMoveCard = setInterval(() => {
                    let itemValue = this.listCards[listIndex][oldIndex];
                            
                    this.listCards[listIndex].push(itemValue);
                    this.listCards[listIndex].splice(oldIndex,1);
                    this.$nextTick(() => {// （*****）
                      let elList = cardsList[listIndex].querySelectorAll(".card-item");
                      let box = cardsList[listIndex].querySelector(".contentBox");
                      this.moveCard.time = new Date();
                      if (!elList[index-2]) {// index会先++，所以fixedBox为0，所以index要-2
                        this.moveCard.boxZero = true;
                        this.moveCard.newEl = elList[oldIndex];
                        this.moveCard.box = box;
                      } else {
                        this.moveCard.boxZero = false;
                        this.moveCard.newEl = elList[index-1];
                        this.moveCard.box = elList[index-2];
                      }
                    });
                    index++;// 这里会先于（*****）执行，
                    if (count == index) {
                      clearInterval(pushMoveCard);
                    }
                  }, 2);
                }

                for (let i = index; i < item.length; i++) {
                  setTimeout(() => {
                    item[i].style.zIndex = '10';// 重置被移动的牌的重叠权重
                  }, 100);// 延迟0.1秒，防止放置过程被该列原牌遮挡
                }

                setTimeout(() => {// 延迟重置moveTime，防止触发非移动时监听数据变化的watch，这里用this.$nextTick不行
                  this.moveTime = false;
                }, 20);
                
                document.onmousemove = null;
                document.onmouseup = null;
              }
            }
          }
          
          document.onmouseup = () => {// 未经过move后的up，即翻转牌
            this.moveTime = false;
            if (index == list.length - 1) {
              this.listCards[listIndex][index].turn = true;
            }
            document.onmousemove = null;// 重置鼠标事件
            document.onmouseup = null;
          }
        }
      }
    }
  },
  updated () {
    if (this.start && !this.dealStart) {// 发牌时不触发
      for (let i = 0; i < this.listCards.length; i++) {// 检测是否集满一副牌
        let item = this.listCards[i];
        for (let j = 0; j < item.length; j++) {
          if (item[j].value == 'K' && item[j].turn) {
            let ifdone = ifDone(item, j, item.length);
            if (ifdone) {// 表示集满
              let item = this.$refs.content.querySelectorAll(".card-list")[i].querySelectorAll(".card-item");
              let count = j + 12;
              let pushDone = setInterval(() => {// 将集满的那组牌从下到上位置逐个传给父组件
                let doneCardLeft = item[count].offsetLeft;
                let doneCardTop = item[count].offsetTop;
                this.$emit('done', doneCardLeft, doneCardTop, doneCount);
                this.listCards[i].splice(count,1);// 从下到上逐个删掉
                if (count == j) {
                  clearInterval(pushDone);
                }
                count--;
              }, 100);// 0.1秒传一个
              console.log('---------集满第'+doneCount+'组');
              doneCount++;
              break;
            }
          }
        }
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      let box = this.$refs.content.querySelectorAll(".contentBox");
      for (let i = 0; i < box.length; i++) {
        this.listPlace[i][0] = box[i].offsetLeft;
        this.listPlace[i][1] = box[i].offsetLeft + box[i].offsetWidth;
      }
    });// 拿到每列的边界数据
   
  },
  watch: {
    listCards: function () {// 监听存牌数据的变化
      if (!this.moveTime) {// 可拖动时则不触发
        let lists = this.$refs.content.querySelectorAll(".card-list");
        let box = this.$refs.content.querySelectorAll(".contentBox");
        if (!this.start) {// 初始发牌时设置牌的位置
          let [oldEl, newEl, oldIndex, newIndex] = getEl(lists, startCount);
          cardsPlace(
            oldEl,
            oldIndex,
            newEl,
            newIndex,
            startCount,
            box[(startCount - 1) % 10],
            box[startCount % 10],
            this.momentCard.initialPoint,
            this.start
          );
        } 
        if (this.dealStart) {// 游戏时发牌设置牌的位置
          let [oldEl, newEl, oldIndex, newIndex] = getEl(lists, dealCount % 10);
          cardsPlace(
            oldEl,
            oldIndex,
            newEl,
            newIndex,
            dealCount % 10,
            box[(dealCount - 1) % 10],
            box[dealCount % 10],
            this.momentCard.initialPoint,
            this.start
          );
        }
      }
    },
    immediate: true,
    deep: true,
    start: function () {// 监听是否完成初始发牌
      if (this.start) {
        let count = 9;
        let startTurn = setInterval(() => {
          let list = this.listCards[count];
          list[list.length - 1].turn = true;// 翻转每列牌的最后一张
          if (count == 0) {
            clearTimeout(startTurn);
          }
          count--;
        }, 200);// 每0.2秒翻转一张牌
      }
    },
    'moveCard.time': function () {// 监听牌移动后moveCard数据的变化
      this.$nextTick(() => {
        moveCardPlace (this.moveCard.newEl, this.moveCard.box, this.moveCard.boxZero);// 调整移动牌后的位置
      })
    },
    deep: true,
    immediate: true
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .content-wrapper
    display: flex
    justify-content: space-between
    .card-list
      display: inline-block
      flex: 0
      .card-item
        position: absolute
        display: block
        z-index: 10
        vertical-align: top
        transition: all 0.3s linear
</style>
