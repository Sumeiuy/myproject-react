/**
 * @fileOverview components/invest/ChartBar.js
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import ChartBarStack from '../chartRealTime/ChartBarStack';
import ChartBarNormal from '../chartRealTime/ChartBarNormal';

export default class ChartBar extends PureComponent {

  static propTypes = {
    location: PropTypes.object,
    level: PropTypes.string,
    chartData: PropTypes.object,
  }

  static defaultProps = {
    level: '',
    location: {},
    chartData: {},
  }


  render() {
    // todo未对数据为空进行判断，导致初始页面不渲染
    const { chartData: { orgModel } } = this.props;
    const { chartData, level, location } = this.props;
    // 增加判断走堆叠还是普通柱状图
    if (orgModel &&
      Array.isArray(orgModel) &&
      orgModel.length > 0 &&
      Array.isArray(orgModel[0].indiModelList) &&
      orgModel[0].indiModelList.length > 0) {
      // 走堆叠柱状图
      return (
        <ChartBarStack
          location={location}
          chartData={chartData}
          level={level}
        />
      );
    }
    return (
      <ChartBarNormal
        location={location}
        chartData={chartData}
        level={level}
      />
    );
  }
}
