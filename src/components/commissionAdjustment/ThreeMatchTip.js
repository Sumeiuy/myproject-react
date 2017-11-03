/**
 * @file src/components/commissionAdjustment/ThreeMatchTip.js
 * @description 三匹配信息提示
 * @author sunweibin
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import styles from './threeMatchTip.less';

// 为了给提示文字一个标点符号
function giveTipPause(array) {
  return array.join('、');
}

// 将提示信息放到数组中
function putMsg2Array(info) {
  const {
    riskRankMhrt,
    investProdMhrt,
    investTypeMhrt,
    riskRankMhmsg,
    investProdMhmsg,
    investTypeMhmsg,
  } = info;
  const msgArray = [];
  if (riskRankMhrt === 'N') {
    msgArray.push(riskRankMhmsg);
  }
  if (investProdMhrt === 'N') {
    msgArray.push(investProdMhmsg);
  }
  if (investTypeMhrt === 'N') {
    msgArray.push(investTypeMhmsg);
  }
  return msgArray;
}

export default function ThreeMatchTip(props) {
  const { info } = props;
  if (_.isEmpty(info)) {
    return null;
  }
  const { riskRankMhrt, investProdMhrt, investTypeMhrt } = info;
  if (riskRankMhrt === 'Y' && investProdMhrt === 'Y' && investTypeMhrt === 'Y') {
    // 全匹配
    return (
      <div className={styles.tipsColor}>提示：经对客户与服务产品三匹配结果，请确认客户是否已签署服务计划书及适当确认书。</div>
    );
  }
  const msgs = putMsg2Array(info);
  return (
    <div className={styles.tipsColor}>
      <span>提示：经对客户与服务产品三匹配结果，</span>
      {giveTipPause(msgs)}
      <span>，请确认客户是否已签署以下文件：服务计划书、不适当警示书、回访问卷。</span>
    </div>
  );
}

ThreeMatchTip.propTypes = {
  info: PropTypes.object,
};
ThreeMatchTip.defaultProps = {
  info: {},
};
