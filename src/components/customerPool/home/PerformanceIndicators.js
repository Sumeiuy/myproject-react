/**
 * @file customerPool/PerformanceIndicators.js
 *  目标客户池-投顾绩效
 * @author zhangjunli
 */

import React, { PropTypes, PureComponent } from 'react';
import { Row, Col } from 'antd';
import _ from 'lodash';
import { autobind } from 'core-decorators';

import Funney from './Funney';
import RectFrame from './RectFrame';
import IECharts from '../../IECharts';
import ProgressList from './ProgressList';
import styles from './performanceIndicators.less';
import {
  getHSRate,
  getProductSale,
  getClientsNumber,
  getCustAndProperty,
  getServiceIndicatorOfPerformance,
} from './HomeIndicators';

export default class PerformanceIndicators extends PureComponent {
  static propTypes = {
    indicators: PropTypes.array,
    push: PropTypes.func.isRequired,
    cycle: PropTypes.array,
    location: PropTypes.object.isRequired,
  }

  static defaultProps = {
    indicators: [],
    cycle: [],
  }

  // 客户及资产（投顾绩效）
  renderCustAndPropertyIndicator(param) {
    const data = getCustAndProperty(param.data);
    const headLine = { icon: 'kehu', title: param.headLine };
    return (
      <Col span={8}>
        <RectFrame dataSource={headLine}>
          <Funney dataSource={data} />
        </RectFrame>
      </Col>
    );
  }

  // 业务开通数（投顾绩效）
  renderBusinessIndicator(param) {
    const numberArray = [];
    const nameArray = [];
    let shangHaiStock = 0; // 沪港通
    let shenZhenStock = 0; // 深港通
    let colourfulIndex = 0;
    _.forEach(
      param.data,
      (item, index) => {
        if (item.key === 'hgtBusi') {
          shangHaiStock = _.parseInt(item.value, 10);
          colourfulIndex = index;
          numberArray.push(_.parseInt(item.value, 10));
          nameArray.push('港股通');
        } else if (item.key === 'sgtBusi') {
          shenZhenStock = _.parseInt(item.value, 10);
        } else {
          numberArray.push(_.parseInt(item.value, 10));
          nameArray.push(item.name);
        }
      },
    );
    const argument = {
      colourfulIndex,
      names: nameArray,
      clientNumberData: numberArray,
      colourfulTotalNumber: (shangHaiStock + shenZhenStock),
      colourfulData: [{ value: shenZhenStock, color: '#38d8e8' }],
    };
    const { newUnit, items } = getClientsNumber(argument);
    const headLine = { icon: 'kehuzhibiao', title: `${param.headLine}（${newUnit}次）` };
    return (
      <Col span={8}>
        <RectFrame dataSource={headLine}>
          <IECharts
            option={items}
            resizable
            style={{
              height: '170px',
            }}
          />
        </RectFrame>
      </Col>
    );
  }

  // 沪深归集率（投顾绩效）
  renderHSRateIndicators(param) {
    let rate = 0;
    if (!_.isEmpty(param.data)) {
      const hsRate = param.data[0];
      rate = hsRate.value;
    }
    const data = getHSRate([_.toNumber(rate)]);
    console.log('hsRate:', data);
    const headLine = { icon: 'jiaoyiliang', title: param.headLine };
    return (
      <Col span={8}>
        <RectFrame dataSource={headLine}>
          <div />
          {/* <IECharts
            option={data}
            resizable
            style={{
              height: '170px',
            }}
          /> */}
        </RectFrame>
      </Col>
    );
  }

  // 产品销售 & 净创收（投顾绩效）
  renderProductSaleAndPureIcomeIndicators(param) {
    const valueArray = [];
    const nameArray = [];
    _.forEach(
      param.data,
      (item) => {
        valueArray.push(_.toNumber(item.value));
        nameArray.push(item.name);
      },
    );
    const { newUnit, items } = getProductSale({ productSaleData: valueArray, nameArray });
    const icon = param.key === 'chanpinxiaoshou' ? 'chanpinxiaoshou' : 'shouru';
    const headLine = { icon, title: `${param.headLine}（${newUnit}）` };
    return (
      <Col span={8}>
        <RectFrame dataSource={headLine}>
          <ProgressList dataSource={items} key={param.key} />
        </RectFrame>
      </Col>
    );
  }

  // 服务指标（投顾绩效）
  renderServiceIndicators(param) {
    const performanceData = [];
    const colors = ['#38d8e8', '#60bbea', '#7d9be0', '#756fb8'];
    _.forEach(
      param.data,
      (item, index) => (
        performanceData.push({
          value: _.toNumber(item.value),
          color: colors[index],
        })
      ),
    );
    const option = getServiceIndicatorOfPerformance({ performanceData });
    const headLine = { icon: 'kehufuwu', title: param.headLine };
    return (
      <Col span={8}>
        <RectFrame dataSource={headLine}>
          <IECharts
            option={option}
            resizable
            style={{
              height: '170px',
            }}
          />
        </RectFrame>
      </Col>
    );
  }

  @autobind
  renderIndictors(item) {
    if (item.key === 'kehujizichan') {
      return this.renderCustAndPropertyIndicator(item);
    } else if (item.key === 'yewukaitongshu') {
      return this.renderBusinessIndicator(item);
    } else if (item.key === 'hushenguijilv') {
      return this.renderHSRateIndicators(item);
    } else if (item.key === 'chanpinxiaoshou' || item.key === 'jingchuangshou') {
      return this.renderProductSaleAndPureIcomeIndicators(item);
    } else if (item.key === 'fuwuzhibiao') {
      return this.renderServiceIndicators(item);
    }
    return null;
  }

  render() {
    const { indicators } = this.props;
    if (_.isEmpty(indicators)) {
      return null;
    }
    return (
      <div className={styles.indexBox}>
        <div>
          <div className={`${styles.listItem} ${styles.firstListItem}`}>
            <Row gutter={16}>
              {this.renderIndictors(indicators[0])}
              {this.renderIndictors(indicators[1])}
              {this.renderIndictors(indicators[2])}
            </Row>
          </div>
          <div className={styles.listItem}>
            <Row gutter={16}>
              {this.renderIndictors(indicators[3])}
              {this.renderIndictors(indicators[4])}
              {this.renderIndictors(indicators[5])}
            </Row>
          </div>
        </div>
      </div>
    );
  }
}
