/**
 * @Author: sunweibin
 * @Date: 2018-05-08 16:37:54
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-05-09 18:51:17
 * @description 营业部非投顾签约客户分配页面工具函数
 */

import _ from 'lodash';

const utils = {
  // 修正请求参数
  fixQuery(query) {
    const omitData = _.omit(query, ['currentId', 'isResetPageNum']);
    return omitData;
  },
};

export default utils;
