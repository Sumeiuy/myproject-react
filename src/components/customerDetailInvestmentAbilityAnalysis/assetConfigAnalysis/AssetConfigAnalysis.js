/*
 * @Author: zuoguangzu
 * @Date: 2018-11-23 20:28:58
 * @Last Modified by: zuoguangzu
 * @Last Modified time: 2018-11-23 20:42:50
 */
import React, { PureComponent } from 'react';

import CountPeriod from '../CountPeriod';
import InfoTitle from '../InfoTitle';
import styles from './assetConfigAnalysis.less';

export default class AssetConfigAnalysis extends PureComponent {
  render() {
    return (
      <div className={styles.assetConfigAnalysis}>
        <CountPeriod />
        <InfoTitle title="期末资产配置"/>
      </div>
    );
  }
}
