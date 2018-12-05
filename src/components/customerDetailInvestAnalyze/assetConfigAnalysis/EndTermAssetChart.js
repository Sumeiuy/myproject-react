/*
 * @Author: zhangjun
 * @Date: 2018-12-04 14:16:41
 * @Last Modified by: zhangjun
 * @Last Modified time: 2018-12-05 11:05:35
 * @description 期末资产配置雷达图
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import _ from 'lodash';
import IECharts from '../../IECharts';
import { CHART_RADAR_OPTIONS, CHART_SERIES_OPTIONS } from './config';
import { composeIndicatorAndData } from '../utils';
import IfWrap from '../../common/biz/IfWrap';
import styles from './endTermAssetChart.less';

export default class EndTermAssetChart extends PureComponent {
  static propTypes = {
    // 雷达图表数据
    endTermAssetTableData: PropTypes.object.isRequired,
    // 总资产
    totalAsset: PropTypes.string.isRequired,
    // 负债
    liabilities: PropTypes.string.isRequired,
  }

  // 获取雷达图配置项
  @autobind
  getChartOption() {
    const { endTermAssetTableData } = this.props;
    // 1.获取雷达图的指标名称
    const indicators = _.map(endTermAssetTableData, item => ({ name: item.classifyName }));
    // 2.获取雷达图的每一项指标的值
    const value = _.map(endTermAssetTableData, item => item.holdAmount || 0);
    // 3. 因为UI图上面需要在指标名称下显示指标的值，但是echart上并没有这个功能
    // 所以此处需要将指标名称和其指标值先进行拼接起来，然后在区分开
    const composedIndicators = composeIndicatorAndData(indicators, value);
    // 4. 生成雷达图的配置项
    return {
      radar: {
        ...CHART_RADAR_OPTIONS,
        name: {
          ...CHART_RADAR_OPTIONS.name,
          formatter: (name) => {
            // 此时的name中含有了指标的值,并且是用|分割
            // 三个值分别是指标名称、指标索引、指标值
            const nameLable = name.split('|');
            const axisName = nameLable[0];
            const axisNameValue = nameLable[2];
            return `{name|${axisName}}\n{value|${axisNameValue}万}`;
          },
        },
        indicator: composedIndicators,
      },
      series: [{
        ...CHART_SERIES_OPTIONS,
        data: [{
          name: '资产分布',
          value,
        }],
      }],
    };
  }

  render() {
    const {
      endTermAssetTableData,
      totalAsset,
      liabilities,
    } = this.props;
    const option = this.getChartOption();
    return (
      <div className={styles.endTermAssetChart}>
        <IfWrap isRender={!_.isEmpty(endTermAssetTableData)}>
          <IECharts
            option={option}
            style={{
              height: '240px',
            }}
            resizable
          />
          <div className={styles.assetExplain}>
            <p>
              总资产
              <span>{totalAsset}</span>
              万元
            </p>
            <p>
              负债
              <span>{liabilities}</span>
              万元
            </p>
          </div>
        </IfWrap>
      </div>
    );
  }
}
