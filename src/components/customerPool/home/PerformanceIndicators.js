/**
 * @file customerPool/PerformanceIndicators.js
 *  目标客户池-投顾绩效
 * @author zhangjunli
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { autobind } from 'core-decorators';
import { Row, Col, Popover } from 'antd';
import _ from 'lodash';
import 'echarts-liquidfill';

import CheckLayout from './CheckLayout__';
import CustomerService from './CustomerService';
import Funney from './Funney__';
import IfEmpty from '../common/IfEmpty';
import RectFrame from './RectFrame';
import IECharts from '../../IECharts';
import ProgressList from './ProgressList__';
import logable, { logCommon } from '../../../decorators/logable';
import { homeModelType } from '../config';
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

import antdStyles from '../../../css/antd.less';
import styles from './performanceIndicators.less';
import classes from './performanceIndicators__.less';

const SOURCE_PRODUCT_SALE = 'chanpinxiaoshou';
// 服务指标（投顾绩效）source
const SOURCE_SERVICER = 'serviceTarget';

// [{name: 1}, {name: 2}] 转成 [1,2]
const getLabelList = arr => arr.map(v => (v || {}).name);

export default class PerformanceIndicators extends PureComponent {
  static contextTypes = {
    push: PropTypes.func.isRequired,
    dict: PropTypes.object.isRequired,
  }

  static propTypes = {
    category: PropTypes.string,
    indicators: PropTypes.object,
    cycle: PropTypes.array,
    isNewHome: PropTypes.bool,
    location: PropTypes.object.isRequired,
    custCount: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]), // 问了后端的逻辑，当有报错时，返回的是空对象，当正常时，返回的是数
  }

  static defaultProps = {
    category: 'manager',
    indicators: {},
    cycle: [],
    custCount: {},
    isNewHome: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      isToolTipVisible: false, // 是否显示柱状图lable上的Popover
      posX: 0, // 鼠标距离浏览器可视区域左上角的水平距离clientX
      posY: 0, // toolTip距离浏览器可视区域左上角的垂直距离clientY
      desc: '', // 指标说明
      title: '', // 指标title
    };
  }

  getNameAndValue(data, formatterNumber) {
    const numberArray = [];
    const nameArray = [];
    const descArray = [];
    _.forEach(
      data,
      (item) => {
        numberArray.push(formatterNumber(item.value));
        nameArray.push(item.name);
        descArray.push(item.description);
      },
    );
    return { nameArray, numberArray, descArray };
  }

  // 过滤掉假值(false, null, 0, '', undefined, NaN)的数组
  filterFalsityArray(array) {
    return _.isEmpty(_.compact(array)) ? [] : _.compact(array);
  }

  @autobind
  handleClick(labelList, arg, originData) {
    const {
      cycle,
      location,
    } = this.props;
    const { push, dict: { singleBusinessTypeList } } = this.context;
    const { name, value } = arg;
    const param = {
      source: 'numOfCustOpened',
      cycle,
      push,
      location,
      bname: name || value,
    };
    const currentSingleBusinessType = _.find(singleBusinessTypeList,
        item => _.includes(item.value, name)) || {};
    param.value = currentSingleBusinessType.key;
    linkTo(param);
    // log日志 --- 业务开通
    const { dataIndex } = arg;
    logCommon({
      type: 'DrillDown',
      payload: {
        name: '业务开通',
        subtype: arg.name,
        value: originData[dataIndex].value || 0,
      },
    });
  }

  @autobind
  handleBusinessOpenReady(instance, originData) {
    const {
      indicators,
    } = this.props;
    let formatIndicator = [];
    const tempArr = this.formatIndicators(indicators || {});
    if (!_.isEmpty(tempArr)) {
      formatIndicator = (tempArr[1] || {}).data;
    }
    const labelList = getLabelList(formatIndicator);
    instance.on('click', (arg) => {
      this.handleClick(labelList, arg, originData);
    });

    // timeout变量用于鼠标移出label时，取消显示Popover
    let timeout;
    instance.on('mouseover', (arg) => {
      // clientX鼠标距离浏览器可视区域左上角的水平距离
      // clientY鼠标距离浏览器可视区域左上角的垂直距离
      const { event: { event: { clientX: posX, clientY: posY } }, value } = arg;
      const descKey = _.findKey(indicators, o => o.name === value);
      timeout = setTimeout(() => {
        this.setState({
          isToolTipVisible: !!descKey,
          posX,
          posY,
          desc: (indicators[descKey] || {}).description || '',
          title: (indicators[descKey] || {}).name || '',
        });
      }, 200);
    });

    instance.on('mouseout', () => {
      clearTimeout(timeout);
      this.setState({
        isToolTipVisible: false,
        desc: '',
        title: '',
      });
    });
  }

  @autobind
  handleHSRateClick(instance) {
    instance.on('click', (arg) => {
      this.aggregationToList();
    });
  }

  formatIndicators(indicator, category) {
    // 资产和交易量指标数据
    const assetAndTradeData = [
      indicator.purFinAset,  // 净新增客户资产
      indicator.tradTranAmt,  // 累计基础交易量
      indicator.zhTranAmt,  // 累计综合交易量
      indicator.gjPurRake,  // 股基累计净佣金
    ];
    // 服务指标数据
    const managerSeviceData = [
      indicator.gjzMotCompletePercent,   // 必做MOT任务完成率
      indicator.gjzServiceCompPercent,   // 高净值客户服务覆盖率
    ];
    // 客户及资产数据
    const custAndPropertyData = [
      indicator.custNum,  // 服务客户数
      indicator.totAset,  // 服务客户资产
      indicator.currSignCustNum,  // 签约客户数
      indicator.currSignCustAset,  // 签约客户资产
      indicator.newCustNum,  // 新开客户数
      indicator.newCustInAset,  // 新开客户资产
    ];
    // 业务开通
    const establishBusinessData = [
      indicator.ttfBusiCurr, // 天天发
      indicator.hgtBusiCurr, // 港股通
      indicator.sgtBusiCurr, // 深港通
      indicator.rzrqBusiCurr, // 融资融券
      indicator.xsbBusiCurr, // 新三板
      indicator.gpqqBusiCurr, // 个股期权
      indicator.cybBusiCurr, // 创业板
    ];
    // 沪深归集率数据
    const hsRateData = [
      indicator.shzNpRate, // 沪深归集率
    ];
    // 产品销售数据
    const productSaleData = [
      indicator.kfTranAmt, // 公募
      indicator.smTranAmt, // 私模
      indicator.taTranAmt, // 紫金
      indicator.otcTranAmt, // OTC
    ];
    // 净创收数据
    const pureIcomeData = [
      indicator.purRake, // 净佣金收入
      indicator.prdtPurFee, // 产品净手续费收入
      indicator.purInteIncome, // 净利息收入
    ];
    // 服务指标数据
    const serviceIndicatorData = [
      indicator.motCompletePercent,  // 必做MOT任务完成率
      indicator.serviceCompPercent,  // 服务覆盖率
      indicator.feeConfigPercent,  // 多元产品覆盖率
      indicator.infoCompPercent,  // 客户信息完善率
    ];

    // 是否是经营指标的展示
    const isManager = category === 'manager';
    if (isManager) {
      // 展示经营指标区域
      return [
        { key: 'yewukaitong', headLine: '业务开通', data: this.filterFalsityArray(establishBusinessData) },  // 业务开通指标块
        { key: 'hushenguijilv', headLine: '沪深归集率', data: this.filterFalsityArray(hsRateData) }, // 沪深归集率指标块
        { key: 'zichanhejiaoyiliang', headLine: '资产和交易量', data: this.filterFalsityArray(assetAndTradeData) }, // 资产与交易量指标块
        { key: 'chanpinxiaoshou', headLine: '产品销售', data: this.filterFalsityArray(productSaleData) },  // 产品销售指标块
        { key: 'fuwuzhibiao', headLine: '服务指标', data: this.filterFalsityArray(managerSeviceData) },  // 服务指标块
      ];
    }
    // 展示投顾绩效
    return [
      { key: 'kehujizichan', headLine: '客户及资产', data: this.filterFalsityArray(custAndPropertyData) },  // 客户及资产指标块
      { key: 'yewukaitong', headLine: '业务开通', data: this.filterFalsityArray(establishBusinessData) },  // 业务开通指标块
      { key: 'hushenguijilv', headLine: '沪深归集率', data: this.filterFalsityArray(hsRateData) }, // 沪深归集率指标块
      { key: 'chanpinxiaoshou', headLine: '产品销售', data: this.filterFalsityArray(productSaleData) },  // 产品销售指标块
      { key: 'jingchuangshou', headLine: '净创收', data: this.filterFalsityArray(pureIcomeData) },  // 净创收指标块
      { key: 'fuwuzhibiao', headLine: '服务指标', data: this.filterFalsityArray(serviceIndicatorData) },  // 服务指标
    ];
  }

  @autobind
  renderIndictors(item, category) {
    if (item.key === 'kehujizichan') {
      return this.renderCustAndPropertyIndicator(item);
    } else if (item.key === 'yewukaitong') {
      return this.renderBusinessIndicator(item);
    } else if (item.key === 'hushenguijilv') {
      return this.renderHSRateIndicators(item);
    } else if (item.key === SOURCE_PRODUCT_SALE || item.key === 'jingchuangshou') {
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
  @autobind
  renderManagerServiceIndicators(param) {
    const { push } = this.context;
    const { cycle, location } = this.props;
    const headLine = { icon: 'kehufuwu', title: param.headLine };
    return (
      <Col span={8} key={param.key}>
        <RectFrame dataSource={headLine} isNewHome={this.props.isNewHome}>
          <IfEmpty isEmpty={_.isEmpty(param.data)}>
            <CustomerService
              cycle={cycle}
              location={location}
              push={push}
              data={param.data}
            />
          </IfEmpty>
        </RectFrame>
      </Col>
    );
  }

  // 客户及资产（投顾绩效）
  @autobind
  renderCustAndPropertyIndicator(param) {
    const { push } = this.context;
    const { cycle, location } = this.props;
    const data = getCustAndProperty(param.data);
    const headLine = { icon: 'kehu', title: param.headLine };
    return (
      <Col span={8} key={param.key}>
        <RectFrame dataSource={headLine} isNewHome={this.props.isNewHome}>
          <IfEmpty isEmpty={_.isEmpty(param.data)}>
            <Funney
              location={location}
              push={push}
              cycle={cycle}
              dataSource={data}
            />
          </IfEmpty>
        </RectFrame>
      </Col>
    );
  }

  // 业务开通数（投顾绩效）
  renderBusinessIndicator(param) {
    const argument = this.getNameAndValue(param.data, filterEmptyToInteger);
    const { newUnit, items } = getClientsNumber(argument);
    const headLine = { icon: 'kehuzhibiao', title: `${param.headLine}（${newUnit}次）` };
    return (
      <Col span={8} key={param.key}>
        <RectFrame dataSource={headLine} isNewHome={this.props.isNewHome}>
          <IfEmpty isEmpty={_.isEmpty(param.data)}>
            {/*
              * 因为神策日志提交的数据需要是原始数据，所以此处需要在onReady的时候将原始数据传递出去
            */}
            <IECharts
              onReady={instance => this.handleBusinessOpenReady(instance, param.data)}
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

  @autobind
  @logable({
    type: 'DrillDown',
    payload: {
      name: '沪深归集率',
      subtype: '沪深归集率',
      value: '$args[1]',
    }
  })
  aggregationToList() {
    const { push } = this.context;
    const {
      cycle,
      location,
    } = this.props;
    const param = {
      source: 'aggregationRate',
      cycle,
      push,
      location,
    };
    linkTo(param);
  }

  // 沪深归集率
  renderHSRateIndicators(param) {
    const { value = '' } = param.data[0] || {};
    const data = getHSRate([filterEmptyToNumber(value)]);
    const headLine = { icon: 'jiaoyiliang', title: param.headLine };
    // description指标说明
    let description = null;
    const { indicators: { shzNpRate } } = this.props;
    if (shzNpRate && shzNpRate.description) {
      description = shzNpRate.description;
    }
    return (
      <Col span={8} key={param.key}>
        <RectFrame
          dataSource={headLine}
          isNewHome={this.props.isNewHome}
        >
          <IfEmpty isEmpty={_.isEmpty(param.data)}>
            <IECharts
              onReady={this.handleHSRateClick}
              option={data}
              resizable
              style={{
                height: '180px',
                cursor: 'auto',
              }}
            />
              <Popover
                title={param.headLine}
                content={description}
                placement="bottom"
                mouseEnterDelay={0.2}
                overlayClassName={antdStyles.popoverClass}
              >
              <div
                className={styles.clickContent}
                onClick={() => { this.aggregationToList(param.data, param.data[0].value || 0 ); }}
              />
              </Popover>
          </IfEmpty>
        </RectFrame>
      </Col>
    );
  }

  // 产品销售 & 净创收（投顾绩效）
  @autobind
  renderProductSaleAndPureIcomeIndicators(param) {
    const { push } = this.context;
    const { cycle, location } = this.props;
    const argument = this.getNameAndValue(param.data, filterEmptyToNumber);
    const finalData = getProductSale(argument);
    const headLine = { icon: 'shouru', title: param.headLine };
    const type = param.key === SOURCE_PRODUCT_SALE ? 'productSale' : 'income';
    return (
      <Col span={8} key={param.key}>
        <RectFrame dataSource={headLine} isNewHome={this.props.isNewHome}>
          <IfEmpty isEmpty={_.isEmpty(param.data)}>
            <ProgressList
              dataSource={finalData}
              key={param.key}
              type={type}
              cycle={cycle}
              push={push}
              location={location}
            />
          </IfEmpty>
        </RectFrame>
      </Col>
    );
  }

  @autobind
  handleServiceToListClick(instance, originData) {
    instance.on('click', (arg) => {
      const { dataIndex } = arg;
      this.toList(dataIndex, originData[dataIndex].value || 0, originData[dataIndex].name);
      logCommon({
        type: 'DrillDown',
        payload: {
          name: '服务指标',
          subtype: originData[dataIndex].name,
          value: arg.value,
        },
      });
    });
  }

  // 服务指标（投顾绩效）下钻
  @autobind
  @logable({
    type: 'DrillDown',
    payload: {
      name: '服务指标',
      subtype: '$args[2]',
      value: '$args[1]',
    }
  })
  toList(dataIndex) {
    const { push } = this.context;
    const {
      cycle,
      location,
    } = this.props;
    const modalTypeList = homeModelType[SOURCE_SERVICER];
    const type = modalTypeList[dataIndex];
    if (type) {
      const param = {
        source: SOURCE_SERVICER,
        cycle,
        push,
        location,
        type,
      };
      linkTo(param);
    }
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
    const { data } = param;
    const trueStyles = this.props.isNewHome ? classes : styles;
    return (
      <Col span={8} key={param.key}>
        <RectFrame dataSource={headLine} isNewHome={this.props.isNewHome}>
          <IfEmpty isEmpty={_.isEmpty(param.data)}>
            <div>
              <IECharts
                onReady={instance => this.handleServiceToListClick(instance, param.data)}
                option={option}
                resizable
                style={{
                  height: '132px',
                }}
              />
              <div className={trueStyles.labelWrap}>
                <Popover
                  title={data[0] && data[0].name}
                  content={data[0] && data[0].description}
                  placement="bottom"
                  mouseEnterDelay={0.2}
                  overlayStyle={{ maxWidth: '320px' }}
                  overlayClassName={antdStyles.popoverClass}
                >
                {/*
                  *data.value为null,给定默认值为0
                */}
                  <span
                    className={trueStyles.chartLabel}
                    onClick={() => { this.toList(0, data[0].value || 0, data[0].name); }}
                  >
                    {data[0] && data[0].name}
                  </span>
                </Popover>
                <Popover
                  title={data[1] && data[1].name}
                  content={data[1] && data[1].description}
                  placement="bottom"
                  mouseEnterDelay={0.2}
                  overlayStyle={{ maxWidth: '320px' }}
                  overlayClassName={antdStyles.popoverClass}
                >
                  <span
                    className={trueStyles.chartLabel}
                    onClick={() => { this.toList(1, data[1].value || 0, data[1].name); }}
                  >
                    {data[1] &&data[1].name}
                  </span>
                </Popover>
                <Popover
                  title={data[2] && data[2].name}
                  content={data[2] && data[2].description}
                  placement="bottom"
                  mouseEnterDelay={0.2}
                  overlayStyle={{ maxWidth: '320px' }}
                  overlayClassName={antdStyles.popoverClass}
                >
                  <span
                    onClick={() => { this.toList(2, data[2].value || 0, data[2].name); }}
                    className={trueStyles.chartLabel}
                  >
                    {data[2] &&data[2].name}
                  </span>
                </Popover>
                <Popover
                  title={data[3] && data[3].name}
                  content={data[3] && data[3].description}
                  placement="bottom"
                  mouseEnterDelay={0.2}
                  overlayStyle={{ maxWidth: '320px' }}
                  overlayClassName={antdStyles.popoverClass}
                >
                  <span
                    onClick={() => { this.toList(3, data[3].value || 0, data[3].name); }}
                    className={trueStyles.chartLabel}
                  >
                    {data[3] &&data[3].name}
                  </span>
                </Popover>
              </div>
            </div>
          </IfEmpty>
        </RectFrame>
      </Col>
    );
  }

  // 新增客户
  @autobind
  renderPureAddCustIndicators(param) {
    const { push } = this.context;
    const { cycle, location, custCount } = this.props;
    const isEmpty = _.isEmpty(custCount);
    const { newUnit: pureAddUnit, items: pureAddItems } = getPureAddCust({
      pureAddData: isEmpty ? [0, 0, 0, 0] : custCount,
    });
    const headLine = { icon: 'kehu', title: `新增客户（${pureAddUnit}）` };
    return (
      <Col span={8} key={param.key}>
        <RectFrame dataSource={headLine} isNewHome={this.props.isNewHome}>
          <IfEmpty isEmpty={isEmpty}>
            <ProgressList
              key={'pureAdd'}
              dataSource={pureAddItems}
              cycle={cycle}
              push={push}
              location={location}
              type="custIndicator"
            />
          </IfEmpty>
        </RectFrame>
      </Col>
    );
  }

  // 资产和交易量
  @autobind
  renderAssetAndTradeIndicators(param) {
    const {
      cycle,
      location,
    } = this.props;
    // 资产和交易量（经营指标）
    const argument = this.getNameAndValue(param.data, filterEmptyToNumber);
    const finalTradeingVolumeData = getTradingVolume(argument);
    const headLine = { icon: 'chanpinxiaoshou', title: param.headLine };
    return (
      <Col span={8} key={param.key}>
        <RectFrame dataSource={headLine} isNewHome={this.props.isNewHome}>
          <IfEmpty isEmpty={_.isEmpty(param.data)}>
            <CheckLayout
              dataSource={finalTradeingVolumeData}
              location={location}
              cycle={cycle}
            />
          </IfEmpty>
        </RectFrame>
      </Col>
    );
  }

  render() {
    const { indicators, category, isNewHome } = this.props;
    const { posX, posY, isToolTipVisible, desc, title } = this.state;
    let formatIndicator = this.formatIndicators((indicators || {}), category);
    if (category === 'manager') {
      formatIndicator = [{ key: 'xinzengkehu' }, ...formatIndicator];
    }
    const firstRowData = _.slice(formatIndicator, 0, 3);
    const secondRowData = _.slice(formatIndicator, 3);

    const trueStyles = isNewHome ? classes : styles;

    const gutter = isNewHome ? 18: 28;

    return (
      <div className={trueStyles.indexBox}>
        <div className={trueStyles.listItem}>
          <Row gutter={gutter}>
            {
              _.map(
                firstRowData,
                item => this.renderIndictors(item, category),
              )
            }
          </Row>
        </div>
        <div className={trueStyles.listItem}>
          <Row gutter={gutter}>
            {
              _.map(
                secondRowData,
                item => this.renderIndictors(item, category),
              )
            }
          </Row>
        </div>
        <Popover
          visible={isToolTipVisible}
          title={title}
          content={desc}
          placement="bottom"
          overlayClassName={antdStyles.popoverClass}
        >
          <span style={{ position: 'fixed', left: posX, top: posY }} />
        </Popover>
      </div>
    );
  }
}
