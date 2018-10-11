/*
 * @Author: sunweibin
 * @Date: 2018-10-11 14:58:06
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-11 16:48:53
 * @Description 新版客户360详情信息下的账户信息Tab下资产分布和收益走势的容器组件
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import AssetDistribute from './AssetDistribute';

import styles from './assetAndIncome.less';

export default class AssetAndIncome extends PureComponent {
  static propTypes = {

  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.assetDistribute}>
          <AssetDistribute />
        </div>
        <div className={styles.splitLine}></div>
        <div className={styles.incomeTrend}>收益走势</div>
      </div>
    );
  }
}
