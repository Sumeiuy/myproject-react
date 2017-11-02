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
  createOption(okData, toData, colors) {
    let data = 0;
    let rest = 0;
    let dataName = '';
    if (!_.isEmpty(okData) && !_.isEmpty(toData) && _.toNumber(toData) > 0) {
      data = (_.toNumber(okData) / _.toNumber(toData)) * 100;
      rest = ((_.toNumber(toData) - _.toNumber(okData)) / _.toNumber(toData)) * 100;
      dataName = `${parseFloat(data).toFixed(0)}%`;
    } else {
      data = 0;
      rest = 100;
      dataName = '暂无数据';
    }
    const options = {
      series: [{
        // name: '访问来源',
        type: 'pie',
        radius: ['70%', '83%'], // 这里是控制环形内半径和外半径
        avoidLabelOverlap: false,
        hoverAnimation: false, // 控制鼠标放置在环上时候的交互
        label: {
          normal: {
            show: true,
            position: 'center',
            textStyle: {
              fontSize: '16',
              color: '#a1a1a1',
              fontWeight: 'bold',
              fontFamily: 'Microsoft YaHei',
            },
          },
        },
        selectedOffset: 4,
        data: [{
          value: data,
          name: dataName,
        },
        {
          value: rest,
          name: '',
        },
        ],
      }],
      color: colors, // 38d8e8
    };
    return options;
  }
  render() {
    const { data } = this.props;
    const { motOkMnt, motTotMnt, taskCust, totCust } = data;
    return (
      <div className={styles.row}>
        <div className={classnames(styles.column, styles.firstColumn)}>
          <IECharts
            option={this.createOption(motOkMnt, motTotMnt, ['#33D0E2', '#d6d6d6'])}
            resizable
            style={{
              height: '115px',
            }}
          />
          <div className={styles.text}>{'必做MOT完成率'}</div>
        </div>
        <div className={classnames(styles.column, styles.secondColumn)}>
          <IECharts
            option={this.createOption(taskCust, totCust, ['#6b87d8', '#d6d6d6'])}
            resizable
            style={{
              height: '115px',
            }}
          />
          <div className={styles.text}>{'客户服务覆盖率'}</div>
        </div>
      </div>
    );
  }
}

