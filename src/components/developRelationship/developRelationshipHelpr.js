/**
 * @Author: hongguangqing
 * @Date: 2017-1-10 10:23:58
 * @Last Modified by: hongguangqing
 * @Last Modified time: 2017-1-11 20:02:11
 * @description 此处存放通用的数据格式/类型处理的方法
 */

  /**
 * 将后端返回的数据翻译成对应的中文
 * @param {Array} arr 是否投顾入岗
 */
function convertTgFlag(arr) {
  let newArr = [];
  if (arr && arr.length) {
    newArr = arr.map(item => ({
      ...item,
      tgFlag: item.tgFlag === 'Y' ? '是' : '否',
    }));
  }
  return newArr;
}

export default {
  convertTgFlag,
};
