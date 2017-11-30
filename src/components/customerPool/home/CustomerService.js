/**
 * @file components/customerPool/CustomerService.js
 *  客户池-客户服务
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import classnames from 'classnames';
import _ from 'lodash';
import IECharts from '../../IECharts';
import styles from './customerService.less';

export default class CustomerService extends PureComponent {

  static propTypes = {
    data: PropTypes.object,
  }

  static defaultProps = {
    data: {},
  }

  // 创建option
  getOption(okData, toData, colors) {
    const dataArray = this.formatterData(okData, toData);
    const options = {
      color: colors,
      series: [{
        type: 'pie',
        radius: ['70%', '83%'], // 这里是控制环形内半径和外半径
        avoidLabelOverlap: false,
        hoverAnimation: false, // hover区域是否放大
        data: dataArray,
        label: {
          normal: { show: false, position: 'center' },
        },
      }],
    };
    return options;
  }

  formatterData(finishData, totalData) {
    let finish = 0;
    let unfinished = 100;
    let finishedName = '暂无数据';
    let unfinishedName = '';
    if (!_.isEmpty(finishData) && !_.isEmpty(totalData) && _.toNumber(totalData) > 0) {
      finish = (_.toNumber(finishData) / _.toNumber(totalData)) * 100;
      unfinished = ((_.toNumber(totalData) - _.toNumber(finishData)) / _.toNumber(totalData)) * 100;
      finishedName = `${parseFloat(finish).toFixed(0)}%`;
      unfinishedName = `${parseFloat(unfinished).toFixed(0)}%`;
    }
    const textStyle = { fontSize: '20', fontWeight: 'bold', fontFamily: 'Microsoft YaHei' };
    const configItems = { show: true, textStyle };

    return [{
      value: finish,
      name: finishedName,
      label: {
        normal: { ...configItems, position: 'center' },
        emphasis: { ...configItems },
      },
    }, {
      value: unfinished,
      name: unfinishedName,
      label: {
        emphasis: { ...configItems, backgroundColor: '#fff' }, // 此处添加背景色，是为了盖着下方的文字
      },
    }];
  }

  render() {
    const { data } = this.props;
    const { motOkMnt, motTotMnt, taskCust, totCust } = data;
    const motOption = this.getOption(motOkMnt, motTotMnt, ['#33D0E2', '#d6d6d6']);
    const serviceOption = this.getOption(taskCust, totCust, ['#6b87d8', '#d6d6d6']);

    return (
      <div className={styles.row}>
        <div className={classnames(styles.column, styles.firstColumn)}>
          <IECharts
            option={motOption}
            resizable
            style={{
              height: '115px',
            }}
          />
          <div className={styles.text}>{'必做MOT完成率'}</div>
        </div>
        <div className={classnames(styles.column, styles.secondColumn)}>
          <IECharts
            option={serviceOption}
            resizable
            style={{
              height: '115px',
            }}
          />
          <div className={styles.text}>{'高净值客户服务覆盖率'}</div>
        </div>
      </div>
    );
  }
}

