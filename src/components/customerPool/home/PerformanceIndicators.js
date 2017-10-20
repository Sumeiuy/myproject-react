/**
 * @file customerPool/PerformanceIndicators.js
 *  目标客户池-投顾绩效
 * @author zhangjunli
 */

import React, { PropTypes, PureComponent } from 'react';
import { autobind } from 'core-decorators';
import { Row, Col } from 'antd';
import _ from 'lodash';
import 'echarts-liquidfill';

import Funney from './Funney';
import IfEmpty from '../common/IfEmpty';
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
  linkTo,
} from './homeIndicators_';

export default class PerformanceIndicators extends PureComponent {
  static propTypes = {
    indicators: PropTypes.array,
    push: PropTypes.func.isRequired,
    cycle: PropTypes.array,
    location: PropTypes.object.isRequired,
    empInfo: PropTypes.object.isRequired,
  }

  static defaultProps = {
    indicators: [],
    cycle: [],
  }

  // 过滤掉假值(false, null, 0, '', undefined, NaN)的数组
  filterFalsityArray(array) {
    return _.isEmpty(_.compact(array)) ? [] : array;
  }

  @autobind
  handleBusinessOpenClick(instance) {
    const {
      push,
      cycle,
      empInfo,
      indicators,
    } = this.props;
    let formatIndicator = [];
    const tempArr = this.formatIndicators(indicators);
    if (!_.isEmpty(tempArr)) {
      formatIndicator = (tempArr[1] || {}).data;
    }
    instance.on('click', (arg) => {
      // console.log('instance arg >>>>', arg, formatIndicator);
      if (arg.componentType !== 'xAxis') {
        return;
      }
      const param = {
        source: 'numOfCustOpened',
        cycle,
        push,
        location: this.props.location,
        empInfo,
      };
      if (arg.value === (formatIndicator[0] || {}).name) {
        param.value = 'ttfCust';
        param.bname = arg.value;
        linkTo(param);
      } else if (arg.value === (formatIndicator[1] || {}).name) {
        param.value = 'shHkCust';
        param.bname = arg.value;
        linkTo(param);
      } else if (arg.value === (formatIndicator[2] || {}).name) {
        param.value = 'szHkCust';
        param.bname = arg.value;
        linkTo(param);
      } else if (arg.value === (formatIndicator[3] || {}).name) {
        param.value = 'rzrqCust';
        param.bname = arg.value;
        linkTo(param);
      } else if (arg.value === (formatIndicator[4] || {}).name) {
        param.value = 'xsb';
        param.bname = arg.value;
        linkTo(param);
      } else if (arg.value === (formatIndicator[5] || {}).name) {
        param.value = 'optCust';
        param.bname = arg.value;
        linkTo(param);
      } else if (arg.value === (formatIndicator[6] || {}).name) {
        param.value = 'cyb';
        param.bname = arg.value;
        linkTo(param);
      }
    });
  }

  formatIndicators(indicatorArray) {
    const custAndProperty = {
      key: 'kehujizichan',
      headLine: '客户及资产',
      data: [
        indicatorArray[0],  // 服务客户数
        indicatorArray[1],  // 服务客户资产
        indicatorArray[2],  // 签约客户数
        indicatorArray[3],  // 签约客户资产
        indicatorArray[9],  // 新开客户数
        indicatorArray[4],  // 新开客户资产
      ],
    };
    const establishBusiness = {
      key: 'yewukaitong',
      headLine: '业务开通',
      data: [
        indicatorArray[10], // 天天发
        indicatorArray[11], // 港股通
        indicatorArray[12], // 深港通
        indicatorArray[13], // 融资融券
        indicatorArray[14], // 新三板
        indicatorArray[15], // 股票期权
        indicatorArray[16], // 创业板
      ],
    };
    const hsRate = {
      key: 'hushenguijilv',
      headLine: '沪深归集率',
      data: [
        indicatorArray[17], // 沪深归集率
      ],
    };
    const productSale = {
      key: 'chanpinxiaoshou',
      headLine: '产品销售',
      data: [
        indicatorArray[21], // 公募
        indicatorArray[22], // 私模
        indicatorArray[23], // 紫金
        indicatorArray[24], // OTC
      ],
    };
    const pureIcome = {
      key: 'jingchuangshou',
      headLine: '净创收',
      data: [
        indicatorArray[18], // 净佣金收入
        indicatorArray[19], // 产品净手续费收入
        indicatorArray[20], // 净利息收入
      ],
    };
    const serviceIndicator = {
      key: 'fuwuzhibiao',
      headLine: '服务指标',
      data: [
        indicatorArray[5],  // MOT 完成率
        indicatorArray[6],  // 服务覆盖率
        indicatorArray[7],  // 资产配置覆盖率
        indicatorArray[8],  // 信息完备率
      ],
    };
    const newIndicators = [
      { ...custAndProperty, data: this.filterFalsityArray(custAndProperty.data) },  // 客户及资产指标块
      { ...establishBusiness, data: this.filterFalsityArray(establishBusiness.data) },  // 业务开通指标块
      { ...hsRate, data: this.filterFalsityArray(hsRate.data) }, // 沪深归集率指标块
      { ...productSale, data: this.filterFalsityArray(productSale.data) },  // 产品销售指标块
      { ...pureIcome, data: this.filterFalsityArray(pureIcome.data) },  // 净创收指标块
      { ...serviceIndicator, data: this.filterFalsityArray(serviceIndicator.data) },  // 服务指标
    ];
    return newIndicators;
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
    const data = getCustAndProperty(param.data);
    const headLine = { icon: 'kehu', title: param.headLine };
    return (
      <Col span={8}>
        <RectFrame dataSource={headLine}>
          <IfEmpty isEmpty={_.isEmpty(param.data)}>
            <Funney dataSource={data} />
          </IfEmpty>
        </RectFrame>
      </Col>
    );
  }

  // 业务开通数（投顾绩效）
  renderBusinessIndicator(param) {
    const numberArray = [];
    const nameArray = [];
    _.forEach(
      param.data,
      (item) => {
        numberArray.push(filterEmptyToInteger(item.value));
        nameArray.push(item.name);
      },
    );
    const argument = {
      names: nameArray,
      clientNumberData: numberArray,
    };
    const { newUnit, items } = getClientsNumber(argument);
    const headLine = { icon: 'kehuzhibiao', title: `${param.headLine}（${newUnit}次）` };
    return (
      <Col span={8}>
        <RectFrame dataSource={headLine}>
          <IfEmpty isEmpty={_.isEmpty(param.data)}>
            <IECharts
              onReady={this.handleBusinessOpenClick}
              option={items}
              resizable
              style={{
                height: '170px',
              }}
            />
          </IfEmpty>
        </RectFrame>
      </Col>
    );
  }

  // 沪深归集率（投顾绩效）
  renderHSRateIndicators(param) {
    const { value = '' } = param.data[0] || {};
    const data = getHSRate([filterEmptyToNumber(value)]);
    const headLine = { icon: 'jiaoyiliang', title: param.headLine };
    return (
      <Col span={8}>
        <RectFrame dataSource={headLine}>
          <IfEmpty isEmpty={_.isEmpty(param.data)}>
            <IECharts
              option={data}
              resizable
              style={{
                height: '180px',
              }}
            />
          </IfEmpty>
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
          <IfEmpty isEmpty={_.isEmpty(param.data)}>
            <ProgressList dataSource={items} key={param.key} />
          </IfEmpty>
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
          <IfEmpty isEmpty={_.isEmpty(param.data)}>
            <IECharts
              option={option}
              resizable
              style={{
                height: '170px',
              }}
            />
          </IfEmpty>
        </RectFrame>
      </Col>
    );
  }

  render() {
    const { indicators } = this.props;
    const formatIndicator = this.formatIndicators(indicators);

    return (
      <div className={styles.indexBox}>
        <div className={`${styles.listItem} ${styles.firstListItem}`}>
          <Row gutter={30}>
            {this.renderIndictors(formatIndicator[0])}
            {this.renderIndictors(formatIndicator[1])}
            {this.renderIndictors(formatIndicator[2])}
          </Row>
        </div>
        <div className={styles.listItem}>
          <Row gutter={30}>
            {this.renderIndictors(formatIndicator[3])}
            {this.renderIndictors(formatIndicator[4])}
            {this.renderIndictors(formatIndicator[5])}
          </Row>
        </div>
      </div>
    );
  }
}
