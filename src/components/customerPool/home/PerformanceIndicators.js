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

import CheckLayout from './CheckLayout';
import CustomerService from './CustomerService';
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
  getPureAddCust,
  getTradingVolume,
} from './homeIndicators_';

// [{name: 1}, {name: 2}] 转成 [1,2]
const getLabelList = arr => arr.map(v => (v || {}).name);

export default class PerformanceIndicators extends PureComponent {
  static propTypes = {
    category: PropTypes.string,
    indicators: PropTypes.object,
    push: PropTypes.func.isRequired,
    cycle: PropTypes.array,
    location: PropTypes.object.isRequired,
    empInfo: PropTypes.object.isRequired,
    custCount: React.PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]), // 问了后端的逻辑，当有报错时，返回的是空对象，当正常时，返回的是数组
    permissionType: PropTypes.number.isRequired,
  }

  static defaultProps = {
    category: 'manager',
    indicators: {},
    cycle: [],
    custCount: {},
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
      permissionType,
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
        permissionType,
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

  formatIndicators(indicator, category) {
    const isEmpty = _.isEmpty(indicator);
    const { custNum, totAset, currSignCustNum, currSignCustAset, otcTranAmt,
      newCustInAset, purRake, prdtPurFee, purInteIncome, motCompletePercent,
      serviceCompPercent, feeConfigPercent, infoCompPercent, newCustNum,
      ttfBusiCurr, hgtBusiCurr, sgtBusiCurr, rzrqBusiCurr, xsbBusiCurr,
      gpqqBusiCurr, cybBusiCurr, shzNpRate, kfTranAmt, smTranAmt, taTranAmt,
      purFinAset, zhTranAmt, tradTranAmt, gjPurRake, gjzMotCompletePercent,
      gjzServiceCompPercent,
    } = (isEmpty ? {} : indicator);
    const isManager = category === 'manager';
    // 资产和交易量
    const assetAndTrade = {
      key: 'zichanhejiaoyiliang',
      headLine: '资产和交易量',
      data: isEmpty ? [] : [
        { ...purFinAset, name: '净新增客户资产' },  // 净新增客户资产
        { ...tradTranAmt, name: '累计基础交易量' },  // 累计基础交易量
        { ...zhTranAmt, name: '累计综合交易量' },  // 累计综合交易量
        { ...gjPurRake, name: '股基累计净佣金' }, // 股基累计净佣金
      ],
    };

    // 服务指标
    const managerSevice = {
      key: 'fuwuzhibiao',
      headLine: '服务指标',
      data: isEmpty ? [] : [
        gjzMotCompletePercent,  // 必做MOT任务完成率
        { ...gjzServiceCompPercent, name: '高净值客户服务覆盖率' },  // 高净值客户服务覆盖率
      ],
    };
    // 客户及资产
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
    // 业务开通
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
    // 沪深归集率
    const hsRate = {
      key: 'hushenguijilv',
      headLine: '沪深归集率',
      data: isEmpty ? [] : [
        shzNpRate, // 沪深归集率
      ],
    };
    // 产品销售
    const productSale = {
      key: 'chanpinxiaoshou',
      headLine: '产品销售',
      data: isEmpty ? [] : [
        isManager ? { ...kfTranAmt, name: '公募基金' } : kfTranAmt, // 公募
        isManager ? { ...smTranAmt, name: '证券投资类私募' } : smTranAmt, // 私模
        isManager ? { ...taTranAmt, name: '资金产品' } : taTranAmt, // 紫金
        otcTranAmt, // OTC
      ],
    };
    // 净创收
    const pureIcome = {
      key: 'jingchuangshou',
      headLine: '净创收',
      data: isEmpty ? [] : [
        purRake, // 净佣金收入
        prdtPurFee, // 产品净手续费收入
        purInteIncome, // 净利息收入
      ],
    };
    // 服务指标
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
    let newIndicators = [];
    if (isManager) {
      newIndicators = [
        { ...establishBusiness, data: this.filterFalsityArray(establishBusiness.data) },  // 业务开通指标块
        { ...hsRate, data: this.filterFalsityArray(hsRate.data) }, // 沪深归集率指标块
        { ...assetAndTrade, data: this.filterFalsityArray(assetAndTrade.data) }, // 资产与交易量指标块
        { ...productSale, data: this.filterFalsityArray(productSale.data) },  // 产品销售指标块
        { ...managerSevice, data: this.filterFalsityArray(managerSevice.data) },  // 产品销售指标块
      ];
    } else {
      newIndicators = [
        { ...custAndProperty, data: this.filterFalsityArray(custAndProperty.data) },  // 客户及资产指标块
        { ...establishBusiness, data: this.filterFalsityArray(establishBusiness.data) },  // 业务开通指标块
        { ...hsRate, data: this.filterFalsityArray(hsRate.data) }, // 沪深归集率指标块
        { ...productSale, data: this.filterFalsityArray(productSale.data) },  // 产品销售指标块
        { ...pureIcome, data: this.filterFalsityArray(pureIcome.data) },  // 净创收指标块
        { ...serviceIndicator, data: this.filterFalsityArray(serviceIndicator.data) },  // 服务指标
      ];
    }
    return newIndicators;
  }

  @autobind
  renderIndictors(item, category) {
    if (item.key === 'kehujizichan') {
      return this.renderCustAndPropertyIndicator(item);
    } else if (item.key === 'yewukaitong') {
      return this.renderBusinessIndicator(item);
    } else if (item.key === 'hushenguijilv') {
      return this.renderHSRateIndicators(item);
    } else if (item.key === 'chanpinxiaoshou' || item.key === 'jingchuangshou') {
      return this.renderProductSaleAndPureIcomeIndicators(item);
    } else if (item.key === 'fuwuzhibiao' && category === 'performance') {
      return this.renderServiceIndicators(item);
    } else if (item.key === 'fuwuzhibiao' && category === 'manager') {
      return this.renderManagerServiceIndicators(item);
    } else if (item.key === 'xinzengkehu') {
      return this.renderPureAddCustIndicators(item);
    } else if (item.key === 'zichanhejiaoyiliang') {
      return this.renderAssetAndTradeIndicators(item);
    }
    return null;
  }

  // 服务指标（经营指标）
  renderManagerServiceIndicators(param) {
    const data = _.map(
      param.data,
      (item) => {
        const { value = '' } = item || {};
        if (_.isEmpty(value)) {
          return { hasNumber: false, value: 0 };
        }
        return { hasNumber: true, value: _.toNumber(item.value) };
      },
    );
    const headLine = { icon: 'kehufuwu', title: param.headLine };
    return (
      <Col span={8} key={param.key}>
        <RectFrame dataSource={headLine}>
          <IfEmpty isEmpty={_.isEmpty(param.data)}>
            <CustomerService data={data} />
          </IfEmpty>
        </RectFrame>
      </Col>
    );
  }

  // 客户及资产（投顾绩效）
  renderCustAndPropertyIndicator(param) {
    const data = getCustAndProperty(param.data);
    const headLine = { icon: 'kehu', title: param.headLine };
    return (
      <Col span={8} key={param.key}>
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
      <Col span={8} key={param.key}>
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
      <Col span={8} key={param.key}>
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
    const headLine = { icon: 'shouru', title: param.headLine };
    return (
      <Col span={8} key={param.key}>
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
      <Col span={8} key={param.key}>
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

  // 新增客户
  @autobind
  renderPureAddCustIndicators(param) {
    const { cycle, push, location, empInfo, custCount } = this.props;
    const isEmpty = _.isEmpty(custCount);
    const { newUnit: pureAddUnit, items: pureAddItems } = getPureAddCust({
      pureAddData: isEmpty ? [0, 0, 0, 0] : custCount,
    });
    const headLine = { icon: 'kehu', title: `新增客户（${pureAddUnit}）` };
    return (
      <Col span={8} key={param.key}>
        <RectFrame dataSource={headLine}>
          <IfEmpty isEmpty={isEmpty}>
            <ProgressList
              key={'pureAdd'}
              dataSource={pureAddItems}
              cycle={cycle}
              push={push}
              location={location}
              empInfo={empInfo}
            />
          </IfEmpty>
        </RectFrame>
      </Col>
    );
  }

  // 资产和交易量
  @autobind
  renderAssetAndTradeIndicators(param) {
    // 资产和交易量（经营指标）
    const tradeingVolumeData = _.map(
      param.data,
      (item) => {
        const { value = '' } = item || {};
        return filterEmptyToNumber(value);
      },
    );
    const finalTradeingVolumeData = getTradingVolume({ tradeingVolumeData });
    const headLine = { icon: 'chanpinxiaoshou', title: param.headLine };

    return (
      <Col span={8} key={param.key}>
        <RectFrame dataSource={headLine}>
          <IfEmpty isEmpty={_.isEmpty(param.data)}>
            <CheckLayout dataSource={finalTradeingVolumeData} />
          </IfEmpty>
        </RectFrame>
      </Col>
    );
  }

  render() {
    const { indicators, category } = this.props;
    let formatIndicator = this.formatIndicators(indicators, category);
    if (category === 'manager') {
      formatIndicator = [{ key: 'xinzengkehu' }, ...formatIndicator];
    }
    const firstRowData = _.slice(formatIndicator, 0, 3);
    const secondRowData = _.slice(formatIndicator, 3);
    return (
      <div className={styles.indexBox}>
        <div className={`${styles.listItem} ${styles.firstListItem}`}>
          <Row gutter={28}>
            {
              _.map(
                firstRowData,
                item => this.renderIndictors(item, category),
              )
            }
          </Row>
        </div>
        <div className={styles.listItem}>
          <Row gutter={28}>
            {
              _.map(
                secondRowData,
                item => this.renderIndictors(item, category),
              )
            }
          </Row>
        </div>
      </div>
    );
  }
}
