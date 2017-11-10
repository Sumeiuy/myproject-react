/**
 * @Author: sunweibin
 * @Date: 2017-11-08 10:24:52
 * @Last Modified by: sunweibin
 * @Last Modified time: 2017-11-08 13:57:24
 * @description 佣金调整弹出层4个新建通用以及固定的相关代码
 */

import React from 'react';
import approvalConfig from '../choiceApprovalUserConfig';
import { seibelConfig } from '../../../config';

const { comsubs: commadj } = seibelConfig;

// 千分号符号
const permil = (
  <span
    style={{
      fontSize: '14px',
      color: '#9b9b9b',
      lineHeight: '26px',
      paddingLeft: '4px',
    }}
  >
    ‰
  </span>
);

// 获取子类型的审批人BtnId
function getApprovalBtnID(key) {
  const { approvalBtnId } = approvalConfig;
  let btnId = '';
  switch (key) {
    case commadj.single:
      btnId = approvalBtnId.single;
      break;
    case commadj.batch:
      btnId = approvalBtnId.batch;
      break;
    case commadj.subscribe:
      btnId = approvalBtnId.sub;
      break;
    case commadj.unsubscribe:
      btnId = approvalBtnId.unsub;
      break;
    default:
      break;
  }
  return btnId;
}

export default {
  permil,
  getApprovalBtnID,
};
