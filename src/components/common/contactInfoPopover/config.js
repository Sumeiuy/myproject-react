/**
 * @Author: XuWenKang
 * @Description: 客户列表联系方式弹窗中更多联系方式的悬浮层内容--部分方法提出来放到这里，因为其他外部组件可能会用到
 * @Date: 2018-08-28 11:16:06
 * @Last Modified by: XuWenKang
 * @Last Modified time: 2018-08-28 13:48:10
 */
import _ from 'lodash';

/**
 * 个人客户：将联系方式列表中的主要电话提至第一个显示
 * {cellphones: [{mainFlag: false}, {mainFlag: true}]}
 * 转成 [ key: 'cellphones', value: [{mainFlag: true}, {mainFlag: false}] ]
 */
export function headMainContact(object) {
  // 定义两个临时的数组，分别用来存储mainFlag=true和mainFlag=false的元素
  const list1 = [];
  const list2 = [];
  // 遍历传入的对象查找有mainFlag=true的属性，并排序属性值
  Object.keys(object).forEach((key) => {
    if (_.findIndex(object[key], { mainFlag: true }) > -1) {
      const newList = _.sortBy(object[key], item => !item.mainFlag);
      list1.push({ key, value: newList });
    } else {
      list2.push({ key, value: object[key] });
    }
  });
  return list1.concat(list2);
}

/**
 * 机构客户： 联系人列表中的主联系人提至最上方
 * @param {*} list
 */
export function headMainLinkman(list) {
  return _.sortBy(list, item => !item.flag);
}
