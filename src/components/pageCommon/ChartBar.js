/**
 * @fileOverview components/invest/ChartBar.js
 * @author sunweibin
 */

import React, { PropTypes, PureComponent } from 'react';
import ChartBarStack from '../chartRealTime/ChartBarStack';
import ChartBarNormal from '../chartRealTime/ChartBarNormal';

import styles from './ChartBar.less';
import imgSrc from '../chartRealTime/noChart.png';

export default class ChartBar extends PureComponent {

  static propTypes = {
    location: PropTypes.object,
    level: PropTypes.string.isRequired,
    scope: PropTypes.number.isRequired,
    chartData: PropTypes.object,
  }

  static defaultProps = {
    location: {},
    chartData: {},
  }


  render() {
    const { chartData: { orgModel, indiModel } } = this.props;
    const { chartData, level, location, scope } = this.props;
    // 增加判断走堆叠还是普通柱状图
    if (orgModel
      && Array.isArray(orgModel)
      && orgModel.length > 0
      && Array.isArray(orgModel[0].indiModelList)
      && orgModel[0].indiModelList.length > 0) {
      // 走堆叠柱状图
      return (
        <ChartBarStack
          location={location}
          chartData={chartData}
          level={level}
          scope={scope}
        />
      );
    } else if (orgModel && indiModel) {
      return (
        <ChartBarNormal
          location={location}
          chartData={chartData}
          level={level}
          scope={scope}
        />
      );
    }
    return (
      <div className={styles.chartMain}>
        <div className={styles.chartWrapper}>
          <div className={styles.noChart}>
            <img src={imgSrc} alt="图表不可见" />
          </div>
        </div>
      </div>
    );
  }
}
