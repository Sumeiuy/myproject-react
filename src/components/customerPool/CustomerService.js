/**
 * @file components/customerPool/CustomerService.js
 *  客户池-客户服务
 * @author yangquanjian
 */

import React, { PropTypes, PureComponent } from 'react';
import { Row, Col } from 'antd';
import _ from 'lodash';
import IECharts from '../IECharts';
import styles from './customerService.less';

export default class CustomerService extends PureComponent {

  static propTypes = {
    data: PropTypes.object,
  }

  static defaultProps = {
    data: {},
  }

  constructor(props) {
    super(props);
    console.log(props);
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }

  // 创建option
  createOption(okData, toData) {
    let data = 0;
    let rest = 0;
    if (!_.isEmpty(okData) && !_.isEmpty(toData)) {
      data = (okData / toData) * 100;
      rest = ((toData - okData) / toData) * 100;
    }
    const options = {
      series: [{
        // name: '访问来源',
        type: 'pie',
        radius: ['70%', '80%'], // 这里是控制环形内半径和外半径
        avoidLabelOverlap: false,
        hoverAnimation: true, // 控制鼠标放置在环上时候的交互
        label: {
          normal: {
            show: true,
            position: 'center',
            textStyle: {
              fontSize: '16',
              color: '#a1a1a1',
              fontWeight: 'bold',
            },
          },
        },
        selectedOffset: 4,
        data: [{
          value: data,
          name: `${data}%`,
        },
        {
          value: rest,
          name: '',
        },
        ],
        itemStyle: {
          emphasis: {
            shadowColor: '#ccc',
            shadowBlur: 10,
          },
        },
      }],
      color: ['#60bbea', '#f2f2f2'], // 38d8e8
    };
    return options;
  }
  render() {
    const { data } = this.props;
    const { motOkMnt, motTotMnt, taskCust, totCust } = data;
    return (
      <div className={styles.serviceBox}>
        <div className={styles.chartBox}>
          <Row>
            <Col span={12}>
              <div className={styles.chartItem}>
                <IECharts
                  option={this.createOption(motOkMnt, motTotMnt)}
                  resizable
                  style={{
                    height: '180px',
                    width: '90%',
                  }}
                />
                <p>必做MOT任务完成率</p>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.chartItem}>
                <IECharts
                  option={this.createOption(taskCust, totCust)}
                  resizable
                  style={{
                    height: '180px',
                    width: '90%',
                  }}
                />
                <p>客户服务覆盖率</p>
              </div>
            </Col>
          </Row>
        </div>
      </div >
    );
  }
}

