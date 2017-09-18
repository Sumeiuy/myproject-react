/**
 * @file components/commissionAdjustment/OtherCommission.js
 *  佣金详情页面其他16个佣金率组件
 * @author baojiajia
 */
import React, { PropTypes } from 'react';
import styles from './otherCommission.less';

export default function OtherCommission(props) {
  const { commissionName, commissionValue } = props;
  return (
    <div className={styles.otherComm}>
      <div className={styles.item}>
        <div className={styles.wrap}>
          <span className={styles.itemname}>{ commissionName }</span>
          <span className={styles.itemvalue}>{ commissionValue }</span>
        </div>
      </div>
    </div>
  );
}

OtherCommission.propTypes = {
  commissionName: PropTypes.string,
  commissionValue: PropTypes.string,
};

OtherCommission.defaultProps = {
  commissionName: '',
  commissionValue: '',
};
