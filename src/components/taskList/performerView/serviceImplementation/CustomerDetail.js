import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import TipsInfo from './TipsInfo';
import { formatAsset } from './formatNum';
import styles from './customerDetail.less';

// 根据资产的值返回对应的格式化值和单位串起来的字符串
const handleAssets = (value) => {
  let newValue = '0';
  let unit = '元';
  if (!_.isEmpty(value)) {
    const obj = formatAsset(value);
    newValue = obj.value;
    unit = obj.unit;
  }
  return `${newValue}${unit}`;
};

export default class CustomerDetail extends PureComponent {
  static propTypes = {
    targetCustDetail: PropTypes.object.isRequired,
  }

  render() {
    const { targetCustDetail = {} } = this.props;
    const { assets, openAssets, availablBalance } = targetCustDetail;
    // 佣金率
    let miniFee = '--';
    if (!_.isEmpty(targetCustDetail.commissionRate)) {
      const newCommissionRate = Number(targetCustDetail.commissionRate);
      miniFee = newCommissionRate < 0 ?
        newCommissionRate :
        `${(newCommissionRate * 1000).toFixed(2)}‰`;
    }
    // 归集率
    let hsRate = '--';
    if (!_.isEmpty(targetCustDetail.hsRate)) {
      const newHsRate = Number(targetCustDetail.hsRate);
      hsRate = newHsRate < 0 ?
        Number(newHsRate.toFixed(2)) :
        `${Number((newHsRate * 100).toFixed(2))}%`;
    }
    // 信息完备率
    const infoCompletionRate = targetCustDetail.infoCompletionRate ?
      `${Number(targetCustDetail.infoCompletionRate) * 100}%` : '--';
    return (
      <div className={styles.customerDetail}>
        <div className={styles.container}>
          <div className={styles.item}>
            <div className={styles.itemLabel}>总资产:</div>
            <div className={styles.itemContent}>{handleAssets(assets)}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.itemLabel}>股基佣金率:</div>
            <div className={styles.itemContent}>{miniFee}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.itemLabel}><p>持仓市值：</p><p>（含信用）</p></div>
            <div className={styles.itemContent}>{handleAssets(openAssets)}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.itemLabel}>沪深归集率:</div>
            <div className={styles.itemContent}>{hsRate}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.itemLabel}>可用余额:</div>
            <div className={styles.itemContent}>{handleAssets(availablBalance)}</div>
          </div>
          <div className={styles.item}>
            <div className={styles.itemLabel}>信息完备率:</div>
            <div className={styles.itemContent}>
              {infoCompletionRate}
              <TipsInfo
                title={''}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
