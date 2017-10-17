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
  filterEmptyToNumber,
  filterEmptyToInteger,
  getServiceIndicatorOfPerformance,
} from './homeIndicators';

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

  formatIndicators(indicatorArray) {
    const custAndProperty = {
      key: 'kehujizichan',
      headLine: '客户及资产',
      data: [
        indicatorArray[0],
        { ...indicatorArray[1], name: '服务客户资产' },
        { ...indicatorArray[2], name: '签约客户数' },
        { ...indicatorArray[3], name: '签约客户资产' },
        indicatorArray[9],
        { ...indicatorArray[4], name: '新开客户资产' },
      ],
    };
    const establishBusiness = {
      key: 'yewukaitong',
      headLine: '业务开通',
      data: [
        indicatorArray[10],
        indicatorArray[11],
        indicatorArray[12],
        { ...indicatorArray[13], name: '两融' },
        indicatorArray[14],
        { ...indicatorArray[15], name: '期权' },
        indicatorArray[16],
      ],
    };
    const hsRate = {
      key: 'hushenguijilv',
      headLine: '沪深归集率',
      data: [
        indicatorArray[17],
      ],
    };
    const productSale = {
      key: 'chanpinxiaoshou',
      headLine: '产品销售',
      data: [
        { ...indicatorArray[21], name: '公募基金' },
        { ...indicatorArray[22], name: '私募基金' },
        { ...indicatorArray[23], name: '紫金基金' },
        indicatorArray[24],
      ],
    };
    const pureIcome = {
      key: 'jingchuangshou',
      headLine: '净创收',
      data: [
        { ...indicatorArray[18], name: '净佣金' },
        { ...indicatorArray[19], name: '产品手续费' },
        { ...indicatorArray[20], name: '净利息' },
      ],
    };
    const serviceIndicator = {
      key: 'fuwuzhibiao',
      headLine: '服务指标',
      data: [
        { ...indicatorArray[5], name: '必做MOT\n完成率' },
        { ...indicatorArray[6], name: '服务\n覆盖率' },
        { ...indicatorArray[7], name: '多元配\n置覆盖率' },
        { ...indicatorArray[8], name: '信息\n完备率' },
      ],
    };
    return [custAndProperty, establishBusiness, hsRate, productSale, pureIcome, serviceIndicator];
  }

  @autobind
  renderIndictors(item) {
    if (item.key === 'kehujizichan') {
      return this.renderCustAndPropertyIndicator(item);
    } else if (item.key === 'yewukaitong') {
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

  // 客户及资产（投顾绩效）
  renderCustAndPropertyIndicator(param) {
    if (_.isEmpty(param.data)) {
      // 暂无数据图
      return null;
    }
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
    if (_.isEmpty(param.data)) {
      // 暂无数据图
      return null;
    }
    const numberArray = [];
    const nameArray = [];
    let shangHaiStock = 0; // 沪港通
    let shenZhenStock = 0; // 深港通
    let colourfulIndex = 0;
    _.forEach(
      param.data,
      (item, index) => {
        // _.toNumber(null) 值为0，_.parseInt(null) 值为NaN
        if (item.key === 'hgtBusi') {
          shangHaiStock = filterEmptyToInteger(item.value);
          colourfulIndex = index;
          numberArray.push(filterEmptyToInteger(item.value));
          nameArray.push('港股通');
        } else if (item.key === 'sgtBusi') {
          shenZhenStock = filterEmptyToInteger(item.value);
        } else {
          numberArray.push(filterEmptyToInteger(item.value));
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
    if (_.isEmpty(param.data)) {
      // 暂无数据图
      return null;
    }
    const hsRate = param.data[0];
    const data = getHSRate([filterEmptyToNumber(hsRate.value)]);
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
    if (_.isEmpty(param.data)) {
      // 暂无数据图
      return null;
    }
    const valueArray = [];
    const nameArray = [];
    _.forEach(
      param.data,
      (item) => {
        valueArray.push(filterEmptyToNumber(item.value));
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
    if (_.isEmpty(param.data)) {
      // 暂无数据图
      return null;
    }
    const performanceData = [];
    const colors = ['#38d8e8', '#60bbea', '#7d9be0', '#756fb8'];
    _.forEach(
      param.data,
      (item, index) => (
        performanceData.push({
          value: filterEmptyToNumber(item.value).toFixed(2),
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

  render() {
    const { indicators } = this.props;
    if (_.isEmpty(indicators)) {
      return null;
    }
    const formatIndicator = this.formatIndicators(indicators);
    return (
      <div className={styles.indexBox}>
        <div>
          <div className={`${styles.listItem} ${styles.firstListItem}`}>
            <Row gutter={16}>
              {this.renderIndictors(formatIndicator[0])}
              {this.renderIndictors(formatIndicator[1])}
              {this.renderIndictors(formatIndicator[2])}
            </Row>
          </div>
          <div className={styles.listItem}>
            <Row gutter={16}>
              {this.renderIndictors(formatIndicator[3])}
              {this.renderIndictors(formatIndicator[4])}
              {this.renderIndictors(formatIndicator[5])}
            </Row>
          </div>
        </div>
      </div>
    );
  }
}
