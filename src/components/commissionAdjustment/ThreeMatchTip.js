/**
 * @file src/components/commissionAdjustment/ThreeMatchTip.js
 * @description 三匹配信息提示
 * @author sunweibin
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import styles from './threeMatchTip.less';

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
  const { riskRankMhmsg, investProdMhmsg, investTypeMhmsg } = info;
  return (
    <div className={styles.tipsColor}>
      <span>提示：经对客户与服务产品三匹配结果，</span>
      {
        riskRankMhrt === 'N' ? (<span>{riskRankMhmsg}</span>) : null
      }
      {
        investProdMhrt === 'N' ? (<span>{investProdMhmsg}</span>) : null
      }
      {
        investTypeMhrt === 'N' ? (<span>{investTypeMhmsg}</span>) : null
      }
      <span>,请确认客户是否已签署以下文件：服务计划书、不适当警示书、回访问卷。</span>
    </div>
  );
}

ThreeMatchTip.propTypes = {
  info: PropTypes.object,
};
ThreeMatchTip.defaultProps = {
  info: {},
};
