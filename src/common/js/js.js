function cardsPlace (oldEl, oldIndex, newEl, newIndex, n, oldBox, newBox, initialPoint, start) {
  if (!start) {// 初始发牌
    if (n == 0) {
      newEl.style.left = '0px';
      newEl.style.top = '0px';
    } else {
      oldEl.style.left = oldBox.offsetLeft + 'px';
      oldEl.style.top = oldBox.offsetTop + oldEl.offsetWidth * oldIndex * 0.3 + 'px';

      newEl.style.left = initialPoint.offsetLeft + 'px';
      newEl.style.top = initialPoint.offsetTop + 'px';
      if (n == 53) {
        setTimeout(() => {
          newEl.style.left = newBox.offsetLeft + 'px';
          newEl.style.top = newBox.offsetTop + newEl.offsetWidth * newIndex * 0.3 + 'px';
        }, 20);
        
      }
    }
  } else {// 游戏时发牌
    if (n == 0) {
      newEl.style.left = initialPoint.offsetLeft + 'px';// 被点击的发牌元素的位置，初始化发牌时牌的动画的起始位置
      newEl.style.top = initialPoint.offsetTop + 'px';
    } else {
      oldEl.style.left = oldBox.offsetLeft + 'px';
      oldEl.style.top = oldBox.offsetTop + oldEl.offsetWidth * oldIndex * 0.3 + 'px';// 设置发牌时前一张牌的动画最后位置

      newEl.style.left = initialPoint.offsetLeft + 'px';
      newEl.style.top = initialPoint.offsetTop + 'px';
      if (n == 9) {
        setTimeout(() => {
          newEl.style.left = newBox.offsetLeft + 'px';// 最后一张牌，设置动画最后位置
          newEl.style.top = newBox.offsetTop + newEl.offsetWidth * newIndex * 0.3 + 'px';
        }, 20);
      }
    }
  }
}

function moveCardPlace (newEl, box, boxZero) {
  if (boxZero) {// 表示放置该列牌的第一张，以该列的fixedBox为标准
    newEl.style.left = box.offsetLeft + 'px';
    newEl.style.top = box.offsetTop + 'px';
  } else {// 非第一张
    newEl.style.left = box.offsetLeft + 'px';
    newEl.style.top = box.offsetTop + newEl.offsetWidth * 0.3 + 'px';
  }
}

function doneCardPlace (item, elLeft, elTop, box) {// 集满牌后放置牌的函数
  if (item.length == 1) {
    item[0].style.zIndex = '100';
    item[0].style.left = elLeft + 'px';
    item[0].style.top = elTop + 'px';
  } else {
    item[item.length-2].style.left = box.offsetLeft + 'px';
    item[item.length-2].style.top = box.offsetTop + 'px';
    item[item.length-2].style.transform = 'rotateZ(360deg)';

    item[item.length-1].style.zIndex = '100';
    item[item.length-1].style.left = elLeft + 'px';
    item[item.length-1].style.top = elTop + 'px';

    if (item.length == 13) {
      setTimeout(() => {
        item[item.length-1].style.left = box.offsetLeft + 'px';
        item[item.length-1].style.top = box.offsetTop + 'px';
        item[item.length-1].style.transform = 'rotateZ(360deg)';
  }, 20)
    }
  }
}

function getMoveTime (list, index) {// 判断被点击的牌是否可移动
  let itemArr = [];
  for (let i = index; i < list.length; i++) {
    if (list[i].value == 'A') {
      itemArr.push(1);
    } else if (list[i].value == 'J') {
      itemArr.push(11);
    } else if (list[i].value == 'Q') {
      itemArr.push(12);
    } else if (list[i].value == 'K') {
      itemArr.push(13);
    } else {
      itemArr.push(parseInt(list[i].value));
    }
  }
  console.log(itemArr[0]);// 作弊用的
  for (let i = 0; i < itemArr.length - 1; i++) {
    if (itemArr.length == 1) {
      break;
    }
    if (itemArr[i] != itemArr[i+1] + 1) {
      return false;
    }
  }
  return true;
}

function getEl (lists, count) {// 拿到发牌时牌与前一张牌的索引和设置位置的必须数据的函数
  let oldEl, newEl, oldIndex, newIndex;
  if (count == 0) {
    oldEl = undefined;// count为0即发第一张牌，不存在前一张牌
  } else {
    let list = lists[(count - 1) % 10].querySelectorAll(".card-item");
    oldIndex = Math.floor((count - 1) / 10);// 初始发牌时前一张牌的索引
    if (list.length != oldIndex + 1) {// 游戏时发牌时前一张牌的索引
      oldIndex = oldIndex + list.length - 1;
    }
    oldEl = list[oldIndex];
  }
  let list = lists[count % 10].querySelectorAll(".card-item");
  newIndex = Math.floor(count / 10);
  if (list.length != newIndex + 1) {
    newIndex = newIndex + list.length - 1;
  }
  newEl = list[newIndex];
  return [oldEl, newEl, oldIndex, newIndex]
}

function getLastItemValue (item) {// 返回数字
  if (item == 'A') {
    return 1;
  } else if (item == 'J') {
    return 11;
  } else if (item == 'Q') {
    return 12;
  } else if (item == 'K') {
    return 13;
  } else {
    return parseInt(item);
  }
}

function ifDone (item, index, length) {// 判断是否集满一副牌
  if (length - index < 13) {
    return false;
  } else {
    for (let i = index; i < index + 12; i++) {
      if (getLastItemValue(item[i].value) != getLastItemValue(item[i+1].value) + 1) {
        return false;
      } else {
        continue;
      }
    }
    return true;
  }
}

export {
  cardsPlace,
  getEl,
  getMoveTime,
  getLastItemValue,
  moveCardPlace,
  ifDone,
  doneCardPlace
}