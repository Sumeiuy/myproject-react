/**
 * @description 专门用于辅助SelfSelect.js的方法函数collection
 * @author sunweibin
 */

import _ from 'lodash';

const selfSelectAllCheckNodes = {
  company: {
    id: 'all',
    name: '所有分公司',
  },
  store: {
    id: 'all',
    name: '所有营业部',
  },
};

const selectHandlers = {
  /**
   * 获取SelfSelect的所有分公司/所有营业部的checkbox节点
   */
  getAllCheckboxNode(userLevel) {
    let key = 'company';
    if (userLevel === '2') {
      key = 'store';
    }
    return selfSelectAllCheckNodes[key];
  },
  /**
   * 获取SelfSelect选择后显示的Label文本
   */
  afterSelected(options, allCheckedNode) {
    return (groupCheckedList) => {
      // 第一项永远选中
      const checkedLabels = [options[0].name];
      const chldrenOptions = options.slice(1);
      if (options.length > 1 && Array.isArray(groupCheckedList)) {
        if (groupCheckedList.length === chldrenOptions.length) {
          checkedLabels.push(allCheckedNode.name);
        } else {
          const filterNames = _.filter(options, o => _.includes(groupCheckedList, o.id));
          filterNames.forEach(item => checkedLabels.push(item.name));
        }
      }
      const labelShowName = checkedLabels.join('/');
      return labelShowName;
    };
  },
};

export default selectHandlers;
