/**
 * @file components/commissionAdjustment/OtherCommission.js
 *  佣金详情页面其他16个佣金率组件
 * @author baojiajia
 */
import React, { PropTypes } from 'react';
import styles from './otherCommission.less';

export default function OtherCommission(props) {
  const { name, value } = props;
  return (
    <div className={styles.otherComm}>
      <div className={styles.item}>
        <div className={styles.wrap}>
          <span className={styles.itemname}>{name}</span>
          <span className={styles.itemvalue}>{value}</span>
        </div>
      </div>
    </div>
  );
}

OtherCommission.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
};

OtherCommission.defaultProps = {
  name: '',
  value: '',
};
