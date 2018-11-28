/*
 * @Author: yuanhaojie
 * @Date: 2018-11-23 09:51:00
 * @LastEditors: yuanhaojie
 * @LastEditTime: 2018-11-28 14:34:23
 * @Description: 服务订单流水详情-其他佣金
 */

import React from 'react';
import PropTypes from 'prop-types';
import styles from './otherCommissions.less';

export default function OtherCommissions(props) {
  const {
    commissions: {
      zqCommission = '--', // 债券
      hCommission = '--', // 回购
      coCommission = '--', // 场内基金
      qCommission = '--', // 权证
      stkCommission = '--', // 担保股基
      dzCommission = '--', // 担保债券
      doCommission = '--', // 担保场内基金
      dqCommission = '--', // 担保权证
      creditCommission = '--', // 信用股基
      hkCommission = '--', // 港股通（净佣金）
      opCommission = '--', // 个股期权
      ddCommission = '--', // 担保品大宗
      stbCommission = '--', // 股转
      bgCommission = '--', // B股
      dCommission = '--', // 大宗交易
    },
  } = props;

  return (
    <div className={styles.otherCommissionsWrap}>
      <div className={styles.line}>
        <div className={styles.column}>
          <span className={styles.hint}>债券：</span>
          <span>{zqCommission}‰</span>
        </div>
        <div className={styles.column}>
          <span className={styles.hint}>回购：</span>
          <span>{hCommission}‰</span>
        </div>
        <div className={styles.column}>
          <span className={styles.hint}>场内基金：</span>
          <span>{coCommission}‰</span>
        </div>
        <div className={styles.column}>
          <span className={styles.hint}>权证：</span>
          <span>{qCommission}‰</span>
        </div>
      </div>
      <div className={styles.line}>
        <div className={styles.column}>
          <span className={styles.hint}>担保股基：</span>
          <span>{stkCommission}‰</span>
        </div>
        <div className={styles.column}>
          <span className={styles.hint}>担保债券：</span>
          <span>{dzCommission}‰</span>
        </div>
        <div className={styles.column}>
          <span className={styles.hint}>担保场内基金：</span>
          <span>{doCommission}‰</span>
        </div>
        <div className={styles.column}>
          <span className={styles.hint}>担保权证：</span>
          <span>{dqCommission}‰</span>
        </div>
      </div>
      <div className={styles.line}>
        <div className={styles.column}>
          <span className={styles.hint}>信用股基：</span>
          <span>{creditCommission}‰</span>
        </div>
        <div className={styles.column}>
          <span className={styles.hint}>信用场内基金：</span>
          <span>{coCommission}‰</span>
        </div>
        <div className={styles.column}>
          <span className={styles.hint}>港股通(净佣金)：</span>
          <span>{hkCommission}‰</span>
        </div>
        <div className={styles.column}>
          <span className={styles.hint}>个股期权：</span>
          <span>{opCommission}‰</span>
        </div>
      </div>
      <div className={styles.line}>
        <div className={styles.column}>
          <span className={styles.hint}>担保品大宗：</span>
          <span>{ddCommission}‰</span>
        </div>
        <div className={styles.column}>
          <span className={styles.hint}>股转：</span>
          <span>{stbCommission}‰</span>
        </div>
        <div className={styles.column}>
          <span className={styles.hint}>B股：</span>
          <span>{bgCommission}‰</span>
        </div>
        <div className={styles.column}>
          <span className={styles.hint}>大宗交易：</span>
          <span>{dCommission}‰</span>
        </div>
      </div>
    </div>
  );
}

OtherCommissions.propTypes = {
  commissions: PropTypes.object.isRequired,
};
