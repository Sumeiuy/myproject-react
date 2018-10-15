/*
 * @Author: sunweibin
 * @Date: 2018-10-11 14:58:06
 * @Last Modified by: sunweibin
 * @Last Modified time: 2018-10-15 12:23:13
 * @Description 新版客户360详情信息下的账户信息Tab下资产分布和收益走势的容器组件
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import AssetDistribute from './AssetDistribute';

import styles from './assetAndIncome.less';

export default class AssetAndIncome extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 点击含信用的checkbox
    onClickCredit: PropTypes.func.isRequired,
    // 资产分布雷达图数据
    assetsRadarData: PropTypes.object.isRequired,
    // 负债详情数据
    debtDetail: PropTypes.object.isRequired,
    // 查询负债详情数据接口
    queryDebtDetail: PropTypes.func.isRequired,
    // 查询资产分布的雷达上具体指标的数据
    querySpecificIndexData: PropTypes.func.isRequired,
    // 资产分布的雷达上具体指标的数据
    specificIndexData: PropTypes.array.isRequired,
  }

  render() {
    const {
      onClickCredit,
      assetsRadarData,
      queryDebtDetail,
      debtDetail,
      location,
      specificIndexData,
      querySpecificIndexData,
    } = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.assetDistribute}>
          <AssetDistribute
            location={location}
            assetsRadarData={assetsRadarData}
            onClickCredit={onClickCredit}
            queryDebtDetail={queryDebtDetail}
            debtDetail={debtDetail}
            specificIndexData={specificIndexData}
            querySpecificIndexData={querySpecificIndexData}
          />
        </div>
        <div className={styles.splitLine}></div>
        <div className={styles.incomeTrend}>收益走势</div>
      </div>
    );
  }
}
