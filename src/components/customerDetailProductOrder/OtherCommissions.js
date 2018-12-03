/*
 * @Author: yuanhaojie
 * @Date: 2018-11-23 09:51:00
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-29 14:12:36
 * @Description: 服务订单流水详情-其他佣金
 */

import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styles from './otherCommissions.less';

function transformCommission(commission) {
  return _.isEmpty(commission) ? '--' : commission;
}

export default function OtherCommissions(props) {
  const {
    commissions: {
      zqCommission, // 债券
      hCommission, // 回购
      oCommission, // 场内基金
      qCommission, // 权证
      stkCommission, // 担保股基
      dzCommission, // 担保债券
      doCommission, // 担保场内基金
      dqCommission, // 担保权证
      creditCommission, // 信用股基
      coCommission, // 信用场内基金
      hkCommission, // 港股通（净佣金）
      opCommission, // 个股期权
      ddCommission, // 担保品大宗
      stbCommission, // 股转
      bgCommission, // B股
      dCommission, // 大宗交易
    },
  } = props;

  const commissions = [
    {
      name: '债券',
      value: zqCommission,
    },
    {
      name: '回购',
      value: hCommission,
    },
    {
      name: '场内基金',
      value: oCommission,
    },
    {
      name: '权证',
      value: qCommission,
    },
    {
      name: '担保股基',
      value: stkCommission,
    },
    {
      name: '担保债券',
      value: dzCommission,
    },
    {
      name: '担保场内基金',
      value: doCommission,
    },
    {
      name: '担保权证',
      value: dqCommission,
    },
    {
      name: '信用股基',
      value: creditCommission,
    },
    {
      name: '信用场内基金',
      value: coCommission,
    },
    {
      name: '港股通(净佣金)',
      value: hkCommission,
    },
    {
      name: '个股期权',
      value: opCommission,
    },
    {
      name: '担保品大宗',
      value: ddCommission,
    },
    {
      name: '股转',
      value: stbCommission,
    },
    {
      name: 'B股',
      value: bgCommission,
    },
    {
      name: '大宗交易',
      value: dCommission,
    },
  ];

  return (
    <div className={styles.otherCommissionsWrap}>
      {
        _.map(commissions, commission => (
          <div className={styles.commission}>
            <span className={styles.hint}>
              {commission.name}
：
            </span>
            <span title={commission.value}>{transformCommission(commission.value)}</span>
          </div>
        ))
      }
    </div>
  );
}

OtherCommissions.propTypes = {
  commissions: PropTypes.object.isRequired,
};
