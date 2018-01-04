/**
 * @file customerPool/PerformanceIndicators.js
 *  目标客户池-投顾绩效
 * @author zhangjunli
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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

// [{name: 1}, {name: 2}] 转成 [1,2]
const getLabelList = arr => arr.map(v => (v || {}).name);

export default class PerformanceIndicators extends PureComponent {
  static propTypes = {
    indicators: PropTypes.object,
    push: PropTypes.func.isRequired,
    cycle: PropTypes.array,
    location: PropTypes.object.isRequired,
    empInfo: PropTypes.object.isRequired,
  }

  static defaultProps = {
    indicators: {},
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
    const labelList = getLabelList(formatIndicator);
    instance.on('click', (arg) => {
      const param = {
        source: 'numOfCustOpened',
        cycle,
        push,
        location: this.props.location,
        empInfo,
        bname: arg.name || arg.value,
      };
      // 点击柱子，arg.name，arg.value都有值
      // 点击x轴， arg.value有值，不存在arg.name
      // 数组的顺序不能变
      const arr = [arg.name, arg.value];
      if (_.includes(arr, labelList[0])) {
        param.value = 'ttfCust';
      } else if (_.includes(arr, labelList[1])) {
        param.value = 'shHkCust';
      } else if (_.includes(arr, labelList[2])) {
        param.value = 'szHkCust';
      } else if (_.includes(arr, labelList[3])) {
        param.value = 'rzrqCust';
      } else if (_.includes(arr, labelList[4])) {
        param.value = 'xsb';
      } else if (_.includes(arr, labelList[5])) {
        param.value = 'optCust';
      } else if (_.includes(arr, labelList[6])) {
        param.value = 'cyb';
      }
      linkTo(param);
    });
  }

  formatIndicators(indicator) {
    const isEmpty = _.isEmpty(indicator);
    const { custNum, totAset, currSignCustNum, currSignCustAset, otcTranAmt,
      newCustInAset, purRake, prdtPurFee, purInteIncome, motCompletePercent,
      serviceCompPercent, feeConfigPercent, infoCompPercent, newCustNum,
      ttfBusiCurr, hgtBusiCurr, sgtBusiCurr, rzrqBusiCurr, xsbBusiCurr,
      gpqqBusiCurr, cybBusiCurr, shzNpRate, kfTranAmt, smTranAmt, taTranAmt,
    } = (isEmpty ? {} : indicator);
    const custAndProperty = {
      key: 'kehujizichan',
      headLine: '客户及资产',
      data: isEmpty ? [] : [
        custNum,  // 服务客户数
        totAset,  // 服务客户资产
        currSignCustNum,  // 签约客户数
        currSignCustAset,  // 签约客户资产
        newCustNum,  // 新开客户数
        newCustInAset,  // 新开客户资产
      ],
    };
    const establishBusiness = {
      key: 'yewukaitong',
      headLine: '业务开通',
      data: isEmpty ? [] : [
        ttfBusiCurr, // 天天发
        hgtBusiCurr, // 港股通
        sgtBusiCurr, // 深港通
        rzrqBusiCurr, // 融资融券
        xsbBusiCurr, // 新三板
        gpqqBusiCurr, // 个股期权
        cybBusiCurr, // 创业板
      ],
    };
    const hsRate = {
      key: 'hushenguijilv',
      headLine: '沪深归集率',
      data: isEmpty ? [] : [
        shzNpRate, // 沪深归集率
      ],
    };
    const productSale = {
      key: 'chanpinxiaoshou',
      headLine: '产品销售',
      data: isEmpty ? [] : [
        kfTranAmt, // 公募
        smTranAmt, // 私模
        taTranAmt, // 紫金
        otcTranAmt, // OTC
      ],
    };
    const pureIcome = {
      key: 'jingchuangshou',
      headLine: '净创收',
      data: isEmpty ? [] : [
        purRake, // 净佣金收入
        prdtPurFee, // 产品净手续费收入
        purInteIncome, // 净利息收入
      ],
    };
    const serviceIndicator = {
      key: 'fuwuzhibiao',
      headLine: '服务指标',
      data: isEmpty ? [] : [
        motCompletePercent,  // 必做MOT任务完成率
        serviceCompPercent,  // 服务覆盖率
        feeConfigPercent,  // 多元产品覆盖率
        infoCompPercent,  // 客户信息完善率
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
    const { push } = this.props;
    const data = getCustAndProperty(param.data);
    const headLine = { icon: 'kehu', title: param.headLine };
    return (
      <Col span={8}>
        <RectFrame dataSource={headLine}>
          <IfEmpty isEmpty={_.isEmpty(param.data)}>
            <Funney dataSource={data} push={push} />
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
    const finalData = getProductSale({ productSaleData: valueArray, nameArray });
    const icon = param.key === 'chanpinxiaoshou' ? 'chanpinxiaoshou' : 'shouru';
    const headLine = { icon, title: param.headLine };
    return (
      <Col span={8}>
        <RectFrame dataSource={headLine}>
          <IfEmpty isEmpty={_.isEmpty(param.data)}>
            <ProgressList dataSource={finalData} key={param.key} type={'productSale'} />
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
          value: (filterEmptyToNumber(item.value) * 100),
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
          <Row gutter={28}>
            {this.renderIndictors(formatIndicator[0])}
            {this.renderIndictors(formatIndicator[1])}
            {this.renderIndictors(formatIndicator[2])}
          </Row>
        </div>
        <div className={styles.listItem}>
          <Row gutter={28}>
            {this.renderIndictors(formatIndicator[3])}
            {this.renderIndictors(formatIndicator[4])}
            {this.renderIndictors(formatIndicator[5])}
          </Row>
        </div>
      </div>
    );
  }
}
