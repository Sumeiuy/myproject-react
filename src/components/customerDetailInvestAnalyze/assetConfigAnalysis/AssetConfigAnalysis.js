/*
 * @Author: zuoguangzu
 * @Date: 2018-11-23 20:28:58
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-12-11 16:09:08
 * @description 资产配置
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CountPeriod from '../CountPeriod';
import EndTermAssetConfig from './EndTermAssetConfig';
import AssetConfigTrend from './AssetConfigTrend';
import styles from './assetConfigAnalysis.less';

export default class AssetConfigAnalysis extends PureComponent {
  static propTypes = {
    location: PropTypes.object.isRequired,
    // 获取期末资产配置数据
    getEndTermAssetConfig: PropTypes.func.isRequired,
    // 期末资产配置数据
    endTermAssetConfigData: PropTypes.object.isRequired,
    // 获取资产配置变动走势
    getAssetConfigTrend: PropTypes.func.isRequired,
    // 资产配置变动走势数据
    assetConfigTrendData: PropTypes.object.isRequired,
  }

  render() {
    const {
      location,
      getEndTermAssetConfig,
      endTermAssetConfigData,
      getAssetConfigTrend,
      assetConfigTrendData,
    } = this.props;
    return (
      <div className={styles.assetConfigAnalysis}>
        <CountPeriod />
        <EndTermAssetConfig
          location={location}
          getEndTermAssetConfig={getEndTermAssetConfig}
          endTermAssetConfigData={endTermAssetConfigData}
        />
        <AssetConfigTrend
          location={location}
          getAssetConfigTrend={getAssetConfigTrend}
          assetConfigTrendData={assetConfigTrendData}
        />
      </div>
    );
  }
}
